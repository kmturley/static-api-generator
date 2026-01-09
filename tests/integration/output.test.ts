import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import { execSync } from 'child_process';
import { glob } from 'glob';

test.beforeAll(async () => {
  execSync('npm run build && npm start', { stdio: 'inherit' });
});

test('Target pattern replacement works correctly', async () => {
  const files = await glob('./out/**/*/index.json');
  for (const file of files) {
    const pathParts = file
      .replace('out/', '')
      .replace('/index.json', '')
      .split('/');
    if (pathParts.length === 2) {
      const [collectionId, id] = pathParts;
      const content = JSON.parse(await readFile(file, 'utf-8'));
      expect(['authors', 'books']).toContain(collectionId);
      expect(id).toBeTruthy();
      expect(content).toHaveProperty(
        collectionId === 'authors' ? 'name' : 'title',
      );
    }
  }
});

test('Variable substitution creates correct folder structure', async () => {
  const registryContent = JSON.parse(
    await readFile('./out/index.json', 'utf-8'),
  );
  for (const [collectionId, collection] of Object.entries(registryContent)) {
    if (typeof collection === 'object' && collection !== null) {
      const collectionPath = `./out/${collectionId}/index.json`;
      expect(await readFile(collectionPath, 'utf-8')).toBeTruthy();
      for (const [pkgId, pkg] of Object.entries(
        collection as Record<string, any>,
      )) {
        const pkgPath = `./out/${collectionId}/${pkgId}/index.json`;
        const pkgContent = JSON.parse(await readFile(pkgPath, 'utf-8'));
        expect(pkgContent).toEqual(pkg);
      }
    }
  }
});

test('Folder names are properly slugified', async () => {
  const files = await glob('./out/**/*.json');
  for (const file of files) {
    const pathParts = file
      .replace('./out/', '')
      .replace('/index.json', '')
      .split('/');
    for (const part of pathParts) {
      expect(part).toMatch(/^[a-z0-9-]+$/);
      expect(part).not.toContain(' ');
      expect(part).not.toContain('_');
    }
  }
});

test('Pattern variables match actual data structure', async () => {
  const registryContent = JSON.parse(
    await readFile('./out/index.json', 'utf-8'),
  );
  for (const [collectionId, collection] of Object.entries(registryContent)) {
    if (typeof collection === 'object' && collection !== null) {
      expect(['authors', 'books']).toContain(collectionId);
      for (const [pkgId, pkg] of Object.entries(
        collection as Record<string, any>,
      )) {
        expect(pkgId).toMatch(/^[a-z0-9-]+$/);
        const pkgFile = `./out/${collectionId}/${pkgId}/index.json`;
        const pkgContent = JSON.parse(await readFile(pkgFile, 'utf-8'));
        expect(pkgContent).toEqual(pkg);
      }
    }
  }
});
