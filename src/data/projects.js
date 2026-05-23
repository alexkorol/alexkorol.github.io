const projects = [
  {
    id: 'repo2gpt',
    title: 'Repo2GPT',
    kicker: 'Codebase context tooling',
    description:
      'A Python toolkit that turns repositories into repo maps, code bundles, token-aware chunks, API jobs, and MCP-accessible artifacts.',
    image: '/images/projects/repo2gpt.png',
    link: 'https://github.com/alexkorol/repo2GPT',
    status: 'Open source',
    challenge:
      'AI coding assistants are only as good as the context they receive, but manual repo packaging is slow, inconsistent, and easy to pollute with build artifacts.',
    approach:
      'Expanded a CLI into a language-aware repository snapshot system with ignore/include rules, token planning, chunked output, a FastAPI job service, a React control panel, and an MCP server.',
    impact:
      'Makes code archaeology, onboarding, and AI review setup repeatable. The public repo has 10+ GitHub stars and keeps evolving with agent tooling needs.',
    stack: ['Python', 'FastAPI', 'React', 'MCP', 'SSE', 'Docker'],
    metrics: ['10+ stars', 'CLI + API', 'MCP server'],
  },
  {
    id: 'delaford',
    title: 'Delaford',
    kicker: 'ARPG systems prototype',
    description:
      'A modernized 2D action RPG sandbox exploring WASD movement, party instances, item identity, and Diablo/PoE-inspired UX.',
    link: 'https://github.com/alexkorol/delaford',
    status: 'Active prototype',
    challenge:
      'The original fantasy sandbox needed a clearer product direction, modern tooling, and a stronger foundation for real-time movement and systems-heavy gameplay.',
    approach:
      'Refreshed the stack around Vite, Volta, Vue, Pinia, Vitest, and Playwright while documenting a systems roadmap for combat, inventory, names, stats, and persistent towns.',
    impact:
      'Creates a structured game lab for testing agent-assisted engineering against a messy, stateful, high-interaction product surface.',
    stack: ['JavaScript', 'Vue', 'Vite', 'Node', 'Playwright', 'Game systems'],
    metrics: ['Client/server', 'WASD-first', 'Roadmapped systems'],
  },
  {
    id: 'pixel-perfecter',
    title: 'Pixel Perfecter',
    kicker: 'Visual QA for generated art',
    description:
      'A research workspace for converting AI pseudo-pixel art into true grid-aligned pixel art.',
    link: 'https://github.com/alexkorol/pixel-perfecter',
    status: 'Research log',
    challenge:
      'Diffusion images often look like pixel art while hiding irregular grids, noisy tile edges, and misleading structure that code-only agents cannot visually judge.',
    approach:
      'Explores block-size detection, grid offset optimization, mode-color snapping, diagnostic diffs, structured notes, and planned CNN training for grid inference.',
    impact:
      'Turns failed visual experiments into traceable evidence and reusable tooling instead of letting the agent declare success after scripts merely run.',
    stack: ['Python', 'OpenCV', 'Image analysis', 'CNN planning', 'Research notes'],
    metrics: ['18 commits', 'MIT', 'Grid recovery'],
  },
  {
    id: 'songcraft-rag',
    title: 'SongCraft RAG',
    kicker: 'Creative knowledge system',
    description:
      'A source-grounded knowledge layer for songwriting craft, music theory, lyric research, and prosody references.',
    status: 'Active 2026',
    link: 'https://github.com/alexkorol/songcraft-rag',
    challenge:
      'Creative generation needs more than vibes. The system needed a way to answer songwriting questions from a focused corpus without flattening source nuance.',
    approach:
      'Built an ingestion and query pipeline over 34 open-access PDFs and 1,800+ pages. The stack uses LangChain loaders, recursive chunking, local FastEmbed embeddings, ChromaDB persistence, FastAPI endpoints, and OpenRouter generation.',
    impact:
      'Produced a reusable knowledge layer for AI lyric generation experiments, with cited answers and live re-ingestion for corpus changes.',
    stack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'FastEmbed', 'OpenRouter'],
    metrics: ['34 docs', '1,800+ pages', '5,000+ chunks'],
  },
  {
    id: 'compact-crawl',
    title: 'Compact Crawl',
    kicker: 'Small-surface game architecture',
    description:
      'A browser roguelike with procedural levels, permadeath, and infinite dungeon branches in a deliberately tiny file structure.',
    link: 'https://alexkorol.github.io/compact-crawl/',
    githubRepo: 'https://github.com/alexkorol/compact-crawl',
    status: 'Playable',
    challenge:
      'Build a complete game loop that is easy to inspect, modify, and deploy without burying the mechanics in framework overhead.',
    approach:
      'Kept the architecture under 10 files: entity definitions, dungeon generation, UI rendering, game loop, assets, data, and monster behavior.',
    impact:
      'A compact reference point for procedural game feel, input loops, and browser-first deployment.',
    stack: ['HTML', 'JavaScript', 'Procedural generation', 'GitHub Pages'],
    metrics: ['Under 10 files', 'Playable web build', 'Permadeath'],
  },
  {
    id: 'seedvault',
    title: 'Seed Vault',
    kicker: 'Creative reference system',
    description:
      'A browsable catalogue of Midjourney v6 style reference codes with visual examples and tags.',
    image: '/images/projects/seedvault.png',
    link: 'https://alexkorol.github.io/seedvault',
    githubRepo: 'https://github.com/alexkorol/seedvault',
    status: 'Live gallery',
    challenge:
      'Style reference codes are useful only when they are easy to scan, compare, and return to during prompt work.',
    approach:
      'Built a lightweight visual index that pairs codes with examples and tags so style exploration becomes searchable memory.',
    impact:
      'Captures a personal creative dataset and makes repeatable art direction easier across experiments.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Midjourney'],
    metrics: ['2 stars', 'Live Pages site', 'SREF catalog'],
  },
];

export default projects;
