import { mkdir, writeFile } from 'node:fs/promises';

const worker = `const legacyBase = '/projects.github.io';

function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    let pathname = incoming.pathname;

    if (pathname === legacyBase) pathname = '/';
    if (pathname.startsWith(legacyBase + '/')) {
      pathname = pathname.slice(legacyBase.length) || '/';
    }

    const candidates = [pathname];
    if (pathname.endsWith('/')) candidates.push(pathname + 'index.html');
    if (!pathname.includes('.') && !pathname.endsWith('/')) {
      candidates.push(pathname + '/index.html');
    }

    for (const candidate of candidates) {
      const response = await env.ASSETS.fetch(assetRequest(request, candidate));
      if (response.status !== 404) return response;
    }

    return env.ASSETS.fetch(assetRequest(request, '/index.html'));
  },
};
`;

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url), worker, 'utf8');
