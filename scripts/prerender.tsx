import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '../src/App';
import { posts, projects } from '../src/generated/content';
import { getRouteMeta, metaToHtml } from '../src/lib/meta';

const root = process.cwd();
const dist = path.join(root, 'dist');
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const routes = ['/', '/projects/', '/lab-notes/', '/how-it-works/', '/generative-ai-experiments/', ...projects.map((project) => `/projects/${project.slug}/`), ...posts.map((post) => `/lab-notes/${post.slug}/`)];

for (const route of routes) {
  const appHtml = renderToString(<StaticRouter location={route}><App /></StaticRouter>);
  const output = template
    .replace('<!--app-head-->', metaToHtml(getRouteMeta(route)))
    .replace('<!--app-html-->', appHtml);
  const directory = route === '/' ? dist : path.join(dist, route.replace(/^\/+|\/+$/g, ''));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'index.html'), output);
}

await fs.copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'));
