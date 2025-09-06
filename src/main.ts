// Step 2: Build static JSON API
// This file loads data from existing curated yaml files,
// validates and transforms and exports the data,
// ready to deploy a static JSON API on GitHub pages.

import { glob } from 'glob';
import Collection from './classes/Collection.js';
import Registry from './classes/Registry.js';
import { SourceFormat } from './types/Source.js';
import { BookValidator, Library } from './types/Example.js';
import SourceFile from './classes/SourceFile.js';
import TargetFile from './classes/TargetFile.js';
import { TargetFormat, TargetType } from './types/Target.js';

const registry = new Registry({
  name: 'My library',
  url: 'https://library.com',
  version: '1.0.0',
});

const filesIn = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
});

const books = new Collection(Library.Books, {
  sources: [filesIn],
  validator: BookValidator,
});

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
    pattern: './out/${collection}/index.json',
    type: TargetType.Collection,
  }),
  new TargetFile({
    format: TargetFormat.Json,
    pattern: './out/${collection}/${package}.json',
    type: TargetType.Package,
  }),
]);
