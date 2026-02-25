import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_INDEX_FILES = new Set([
  'index',
  'index.js',
  'index.jsx',
  'index.ts',
  'index.tsx',
]);

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full)));
    } else {
      files.push(full);
    }
  }

  return files;
}

function extractModuleSpecifiers(source) {
  const specifiers = [];
  const importRe = /\bfrom\s+['"]([^'"]+)['"]/g;
  const requireRe = /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g;

  let match;
  while ((match = importRe.exec(source))) specifiers.push(match[1]);
  while ((match = requireRe.exec(source))) specifiers.push(match[1]);

  return specifiers;
}

function isDeepModulesImport(spec) {
  const marker = '/modules/';
  const idx = spec.lastIndexOf(marker);
  if (idx === -1) return false;

  const rest = spec.slice(idx + marker.length);
  const parts = rest.split('/').filter(Boolean);
  if (parts.length <= 1) return false;

  return !ALLOWED_INDEX_FILES.has(parts[1]);
}

describe('module boundaries', () => {
  it('disallows deep imports into src/modules from outside modules', async () => {
    const root = path.resolve(process.cwd(), 'src');
    const all = await listFilesRecursive(root);
    const candidates = all.filter(f => {
      const rel = path.relative(root, f);
      if (!/\.(js|jsx|ts|tsx)$/.test(rel)) return false;
      if (rel.startsWith('modules' + path.sep)) return false;
      return true;
    });

    const violations = [];
    for (const file of candidates) {
      const source = await fs.readFile(file, 'utf8');
      const specifiers = extractModuleSpecifiers(source);
      for (const spec of specifiers) {
        if (isDeepModulesImport(spec)) {
          violations.push({ file: path.relative(root, file), spec });
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
