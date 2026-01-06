// Step 2: Build static JSON API
// This file loads data from existing curated yaml files,
// validates and transforms and exports the data,
// ready to deploy a static JSON API on GitHub pages.

import { glob } from 'glob';
import Collection from './classes/Collection.js';
import Registry from './classes/Registry.js';
import { SourceFormat } from './types/Source.js';
import { PackageValidator } from './types/Package.js';
import { AuthorValidator } from './types/Author.js';
import SourceFile from './classes/SourceFile.js';
import TargetFile from './classes/TargetFile.js';
import { TargetFormat, TargetType } from './types/Target.js';
import { logger, LogLevel } from './utils/Logger.js';

logger.setLevel(LogLevel.INFO);

const registry = new Registry({
  name: 'My library',
  url: 'https://library.com',
  version: '1.0.0',
});

const authorsIn = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/authors/*.yaml'),
});

const booksIn = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
});

const authors = new Collection('authors', {
  sources: [authorsIn],
  validator: AuthorValidator,
});

const books = new Collection('books', {
  sources: [booksIn],
  validator: PackageValidator,
});

registry.addCollection(authors);
registry.addCollection(books);
await registry.sync();
await registry.export([
  new TargetFile({
    format: TargetFormat.Json,
    pattern: './out/index.json',
    type: TargetType.Registry,
  }),
  new TargetFile({
    format: TargetFormat.Json,
    pattern: './out/${collection.id}/index.json',
    type: TargetType.Collection,
  }),
  new TargetFile({
    format: TargetFormat.Json,
    pattern: './out/${collection.id}/${package.id}/index.json',
    type: TargetType.Package,
  }),
]);

// Export associated packages from another collection
await authors.exportAssociated('books', books, [
  new TargetFile({
    format: TargetFormat.Json,
    pattern:
      './out/${collection.id}/${package.id}/${associatedCollection.id}/index.json',
    type: TargetType.Collection,
  }),
  new TargetFile({
    format: TargetFormat.Json,
    pattern:
      './out/${collection.id}/${package.id}/${associatedCollection.id}/${associatedPackage.id}/index.json',
    type: TargetType.Package,
  }),
]);
