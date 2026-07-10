import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sharp from 'sharp';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { hashedEmbedding } from '../shared/retrieval';
import type { CorpusChunk, EvalResults, Post, Project } from '../src/types';

const root = process.cwd();
const siteUrl = 'https://alexkorol.github.io';

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(value: string, maxCharacters: number): string[] {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (`${current} ${word}`.trim().length > maxCharacters && current) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

function chunkMarkdown(markdown: string, source: Omit<CorpusChunk, 'id' | 'heading' | 'text' | 'embedding'>): CorpusChunk[] {
  const sections = markdown.split(/(?=^##\s+)/m).filter((section) => section.trim());
  const chunks: CorpusChunk[] = [];
  let sequence = 1;
  for (const section of sections) {
    const headingMatch = section.match(/^##\s+(.+)$/m);
    const heading = headingMatch?.[1]?.trim() ?? 'Overview';
    const body = stripMarkdown(section.replace(/^##\s+.+$/m, ''));
    if (!body) continue;
    const paragraphs = body.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
    let current = '';
    for (const paragraph of paragraphs) {
      if (current && `${current} ${paragraph}`.length > 900) {
        chunks.push({
          ...source,
          id: `${source.sourceType}-${source.sourceSlug}-${String(sequence).padStart(2, '0')}`,
          heading,
          text: current.trim(),
          embedding: hashedEmbedding(`${source.title} ${heading} ${current}`),
        });
        sequence += 1;
        const overlap = current.slice(-120).replace(/^\S*\s/, '');
        current = `${overlap} ${paragraph}`;
      } else {
        current = `${current} ${paragraph}`.trim();
      }
    }
    if (current) {
      chunks.push({
        ...source,
        id: `${source.sourceType}-${source.sourceSlug}-${String(sequence).padStart(2, '0')}`,
        heading,
        text: current.trim(),
        embedding: hashedEmbedding(`${source.title} ${heading} ${current}`),
      });
      sequence += 1;
    }
  }
  return chunks;
}

async function readCollection<T>(directory: string, mapEntry: (slug: string, data: Record<string, any>, markdown: string, html: string) => T): Promise<T[]> {
  const base = path.join(root, directory);
  const files = (await fs.readdir(base)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(files.map(async (file) => {
    const slug = file.replace(/\.md$/, '');
    const parsed = matter(await fs.readFile(path.join(base, file), 'utf8'));
    const html = await marked.parse(parsed.content, { gfm: true });
    return mapEntry(slug, parsed.data, parsed.content, html);
  }));
}

async function generatePostOg(post: Post): Promise<void> {
  const output = path.join(root, 'public', post.ogImage.replace(/^\//, ''));
  await fs.mkdir(path.dirname(output), { recursive: true });
  const titleLines = wrapText(post.title, 28).slice(0, 3);
  const summaryLines = wrapText(post.summary, 58).slice(0, 2);
  const titleSvg = titleLines.map((line, index) => `<text x="78" y="${190 + index * 84}" fill="#f4f7f8" font-family="Arial, sans-serif" font-size="68" font-weight="700">${escapeXml(line)}</text>`).join('');
  const summarySvg = summaryLines.map((line, index) => `<text x="82" y="${470 + index * 39}" fill="#a9b4b9" font-family="Arial, sans-serif" font-size="29">${escapeXml(line)}</text>`).join('');
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#0b0f12"/><rect x="0" y="0" width="18" height="630" fill="#79e2b4"/><circle cx="1080" cy="102" r="180" fill="#132c27"/><text x="80" y="86" fill="#79e2b4" font-family="Arial, sans-serif" font-size="25" font-weight="700">ALEXEI KOROL · ENGINEERING NOTE</text>${titleSvg}${summarySvg}<text x="82" y="585" fill="#718087" font-family="Arial, sans-serif" font-size="23">${escapeXml(post.date)} · ${escapeXml(post.readTime)}</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(output);
}

async function generateResumePdf(rawMarkdown: string): Promise<void> {
  const parsed = matter(rawMarkdown);
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const width = 612;
  const height = 792;
  const margin = 52;
  let page = pdf.addPage([width, height]);
  let y = height - margin;

  const safe = (value: string) => value.replace(/[–—]/g, '-').replace(/→/g, 'to').replace(/[^ -~]/g, '');
  const drawWrapped = (value: string, size: number, font: typeof regular, color = rgb(0.12, 0.15, 0.17), gap = size * 1.35) => {
    const words = safe(value).split(/\s+/);
    let line = '';
    const lines: string[] = [];
    for (const word of words) {
      const candidate = `${line} ${word}`.trim();
      if (font.widthOfTextAtSize(candidate, size) > width - margin * 2 && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
    for (const outputLine of lines) {
      if (y < margin + gap) {
        page = pdf.addPage([width, height]);
        y = height - margin;
      }
      page.drawText(outputLine, { x: margin, y, size, font, color });
      y -= gap;
    }
  };

  drawWrapped(String(parsed.data.title), 22, bold, rgb(0.05, 0.24, 0.2), 28);
  drawWrapped(`${parsed.data.location} | ${parsed.data.email} | github.com/alexkorol`, 9.5, regular, rgb(0.25, 0.3, 0.32), 14);
  y -= 8;
  for (const rawLine of parsed.content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) { y -= 5; continue; }
    if (line.startsWith('## ')) { y -= 7; drawWrapped(line.slice(3), 14, bold, rgb(0.05, 0.24, 0.2), 19); }
    else if (line.startsWith('### ')) { y -= 3; drawWrapped(line.slice(4), 11.5, bold, rgb(0.1, 0.12, 0.14), 16); }
    else drawWrapped(line, 9.5, regular, rgb(0.16, 0.19, 0.21), 13.5);
  }
  await fs.writeFile(path.join(root, 'public', 'alexei-korol-resume.pdf'), await pdf.save());
}

async function main(): Promise<void> {
  const projects = await readCollection<Project>('content/projects', (slug, data, markdown, html) => ({
    slug, title: data.title, kicker: data.kicker, summary: data.summary, order: Number(data.order),
    status: data.status, repo: data.repo, demo: data.demo, architecture: data.architecture ?? [],
    metrics: data.metrics ?? [], tags: data.tags ?? [], evidenceUpdated: data.evidenceUpdated,
    html, plainText: stripMarkdown(markdown),
  }));
  projects.sort((left, right) => left.order - right.order);

  const posts = await readCollection<Post>('content/posts', (slug, data, markdown, html) => ({
    slug, title: data.title, date: data.date, summary: data.summary, tags: data.tags ?? [],
    readTime: data.readTime, ogImage: `/og/posts/${slug}.png`, html, plainText: stripMarkdown(markdown),
  }));
  posts.sort((left, right) => right.date.localeCompare(left.date));

  const resumeRaw = await fs.readFile(path.join(root, 'content', 'resume.md'), 'utf8');
  const resumeParsed = matter(resumeRaw);
  const projectChunks = (await Promise.all(projects.map(async (project) => {
    const source = matter(await fs.readFile(path.join(root, 'content', 'projects', `${project.slug}.md`), 'utf8')).content;
    return chunkMarkdown(`${project.summary}\n\n${source}`, {
      sourceType: 'project', sourceSlug: project.slug, title: project.title, url: `/projects/${project.slug}/`,
    });
  }))).flat();
  const postChunks = (await Promise.all(posts.map(async (post) => {
    const source = matter(await fs.readFile(path.join(root, 'content', 'posts', `${post.slug}.md`), 'utf8')).content;
    return chunkMarkdown(`${post.summary}\n\n${source}`, {
      sourceType: 'post', sourceSlug: post.slug, title: post.title, url: `/lab-notes/${post.slug}/`,
    });
  }))).flat();
  const corpus: CorpusChunk[] = [
    ...projectChunks,
    ...postChunks,
    ...chunkMarkdown(resumeParsed.content, {
      sourceType: 'resume', sourceSlug: 'resume', title: resumeParsed.data.title, url: '/alexei-korol-resume.pdf',
    }),
  ];

  let evalResults: EvalResults = {
    generatedAt: 'not-run', mode: 'offline', totals: { inScope: 0, outOfScope: 0 },
    metrics: { expectedSourceRecallAt3: 0, groundedAnswerRate: 0, refusalCorrectness: 0 },
  };
  try {
    evalResults = JSON.parse(await fs.readFile(path.join(root, 'evals', 'results.json'), 'utf8')) as EvalResults;
  } catch { /* First content generation happens before the eval artifact exists. */ }

  await fs.mkdir(path.join(root, 'src', 'generated'), { recursive: true });
  const generated = `/* Generated by scripts/generate-content.ts. Do not edit. */\nimport type { CorpusChunk, EvalResults, Post, Project } from '../types';\nexport const projects = ${JSON.stringify(projects, null, 2)} as Project[];\nexport const posts = ${JSON.stringify(posts, null, 2)} as Post[];\nexport const corpus = ${JSON.stringify(corpus, null, 2)} as CorpusChunk[];\nexport const evalResults = ${JSON.stringify(evalResults, null, 2)} as EvalResults;\n`;
  await fs.writeFile(path.join(root, 'src', 'generated', 'content.ts'), generated);
  await fs.mkdir(path.join(root, 'worker', 'src'), { recursive: true });
  await fs.writeFile(path.join(root, 'worker', 'src', 'corpus.json'), JSON.stringify(corpus, null, 2));

  await Promise.all(posts.map(generatePostOg));
  await generateResumePdf(resumeRaw);

  const rssItems = posts.map((post) => `<item><title>${escapeXml(post.title)}</title><link>${siteUrl}/lab-notes/${post.slug}/</link><guid>${siteUrl}/lab-notes/${post.slug}/</guid><pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(post.summary)}</description></item>`).join('');
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Alexei Korol — AI engineering notes</title><link>${siteUrl}/lab-notes/</link><description>Measured notes on RAG, agents, evaluation, and production LLM systems.</description><language>en-us</language>${rssItems}</channel></rss>`;
  await fs.writeFile(path.join(root, 'public', 'rss.xml'), rss);

  const routes = ['/', '/projects/', '/lab-notes/', '/how-it-works/', '/generative-ai-experiments/', ...projects.map((project) => `/projects/${project.slug}/`), ...posts.map((post) => `/lab-notes/${post.slug}/`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${siteUrl}${route}</loc></url>`).join('')}</urlset>`;
  await fs.writeFile(path.join(root, 'public', 'sitemap.xml'), sitemap);
  await fs.writeFile(path.join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

await main();
