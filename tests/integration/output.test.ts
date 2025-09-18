import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import { execSync } from 'child_process';
import { glob } from 'glob';

const COLLECTION_ID = 'books';

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
    if (pathParts.length === 3) {
      const [collectionId, orgId, pkgId] = pathParts;
      const content = JSON.parse(await readFile(file, 'utf-8'));
      expect(collectionId).toBe(COLLECTION_ID);
      expect(orgId).toBeTruthy();
      expect(pkgId).toBeTruthy();
      expect(content).toHaveProperty('title');
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
      for (const [orgId, org] of Object.entries(
        collection as Record<string, any>,
      )) {
        const orgPath = `./out/${collectionId}/${orgId}/index.json`;
        expect(await readFile(orgPath, 'utf-8')).toBeTruthy();
        for (const [pkgId] of Object.entries(org as Record<string, any>)) {
          const pkgPath = `./out/${collectionId}/${orgId}/${pkgId}/index.json`;
          const pkgContent = JSON.parse(await readFile(pkgPath, 'utf-8'));
          expect(pkgContent).toHaveProperty('title');
          expect(typeof pkgContent.title).toBe('string');
        }
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
      expect(collectionId).toBe(COLLECTION_ID);
      for (const [orgId, org] of Object.entries(
        collection as Record<string, any>,
      )) {
        expect(orgId).toMatch(/^[a-z0-9-]+$/);
        for (const [pkgId, pkg] of Object.entries(org as Record<string, any>)) {
          expect(pkgId).toMatch(/^[a-z0-9-]+$/);
          const pkgFile = `./out/${collectionId}/${orgId}/${pkgId}/index.json`;
          const pkgContent = JSON.parse(await readFile(pkgFile, 'utf-8'));
          expect(pkgContent).toEqual(pkg);
        }
      }
    }
  }
});
