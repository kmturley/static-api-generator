import { expect, test } from 'vitest';
import { glob } from 'glob';

import Collection from '../../src/classes/Collection.js';
import Organization from '../../src/classes/Organization.js';
import Package from '../../src/classes/Package.js';
import Registry from '../../src/classes/Registry.js';
import SourceFile from '../../src/classes/SourceFile.js';
import Target from '../../src/classes/Target.js';
import { CollectionValidator } from '../../src/types/Collection.js';
import { OrganizationValidator } from '../../src/types/Organization.js';
import { PackageValidator } from '../../src/types/Package.js';
import { RegistryValidator } from '../../src/types/Registry.js';
import { SourceFormat } from '../../src/types/Source.js';
import { TargetFormat, TargetType } from '../../src/types/Target.js';

test('Package class', () => {
  const pkg = new Package('test-org', 'test-pkg', {
    title: 'Test Book',
    author: 'Test Author',
  });

  expect(pkg.orgId).toBe('test-org');
  expect(pkg.id).toBe('test-pkg');
  expect(pkg.get()).toEqual({ title: 'Test Book', author: 'Test Author' });
  expect(PackageValidator(pkg.toJSON()).success).toBe(true);

  pkg.merge({ year: 2023 });
  expect(pkg.get().year).toBe(2023);
});

test('Organization class', () => {
  const org = new Organization('test-org');
  const pkg = new Package('test-org', 'test-pkg', { title: 'Test Book' });

  org.addPackage(pkg);

  expect(org.id).toBe('test-org');
  expect(org.getPackage('test-pkg')).toBe(pkg);
  expect(org.listPackages()).toHaveLength(1);
  expect(OrganizationValidator(org.toJSON()).success).toBe(true);
});

test('Collection class', () => {
  const collection = new Collection('books', { sources: [] });
  const pkg = new Package('test-org', 'test-pkg', { title: 'Test Book' });

  collection.addPackage(pkg);

  expect(collection.id).toBe('books');
  expect(collection.getPackage('test-org', 'test-pkg')).toBe(pkg);
  expect(collection.listPackages()).toHaveLength(1);
  expect(collection.search('test')).toHaveLength(1);
  expect(CollectionValidator(collection.toJSON()).success).toBe(true);
});

test('Registry class', () => {
  const registry = new Registry({
    name: 'Test Library',
    url: 'https://test.com',
    version: '1.0.0',
  });
  const collection = new Collection('books', { sources: [] });

  registry.addCollection(collection);

  expect(registry.name).toBe('Test Library');
  expect(registry.getCollection('books')).toBe(collection);
  expect(RegistryValidator(registry.toJSON()).success).toBe(true);
});

test('Target replace method', () => {
  class TestTarget extends Target {
    async export() {}
  }

  const target = new TestTarget({
    format: TargetFormat.Json,
    pattern: '${collection.id}/${org.id}/${package.id}',
    type: TargetType.Package,
  });

  const vars = {
    collection: { id: 'books' },
    org: { id: 'test-org' },
    package: { id: 'test-pkg' },
  };

  expect(target.replace(target.pattern, vars)).toBe('books/test-org/test-pkg');
});

test('SourceFile class', async () => {
  const source = new SourceFile({
    format: SourceFormat.Yaml,
    paths: await glob('./data/books/**/*.yaml'),
  });

  await source.sync();

  expect(source.get().length).toBeGreaterThan(0);
  expect(source.getPaths().length).toBeGreaterThan(0);
});

test('Registry integration', async () => {
  const registry = new Registry({
    name: 'My library',
    url: 'https://library.com',
    version: '1.0.0',
  });

  const filesIn = new SourceFile({
    format: SourceFormat.Yaml,
    paths: await glob('./data/books/**/*.yaml'),
  });

  const books = new Collection('books', {
    sources: [filesIn],
    validator: PackageValidator,
  });

  registry.addCollection(books);
  await registry.sync();

  expect(RegistryValidator(registry.toJSON()).success).toBe(true);
});
