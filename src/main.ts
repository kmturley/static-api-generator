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
import { TargetFormat } from './types/Target.js';

const registry = new Registry({
  name: 'My library',
  url: 'https://library.com',
  version: '1.0.0',
});

const filesIn = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
});

const filesOut = new TargetFile({
  format: TargetFormat.Json,
  paths: ['./out/${collection}/${id}.json', './out/${collection}/index.json'],
});

const books = new Collection(Library.Books, {
  sources: [filesIn],
  targets: [filesOut],
  validator: BookValidator,
});

registry.addCollection(books);
await registry.sync();
await registry.export({
  format: TargetFormat.Json,
  paths: ['./out/index.json'],
});
