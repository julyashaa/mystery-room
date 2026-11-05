import { copyFile, mkdir, writeFile } from 'node:fs/promises';

// Real HTML entry points let Pages serve deep links without an SPA rewrite.
// Add future playable routes here when they are implemented.
const routes = ['case/404'];
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
// Unknown paths render the application's existing not-found page.
await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');
console.log('Prepared GitHub Pages deep-link entry points and 404 fallback.');
