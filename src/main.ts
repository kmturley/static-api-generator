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

const registry = new Registry({
  name: 'My library',
  url: 'https://library.com',
  version: '1.0.0',
});

const files = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
});

const books = new Collection(Library.Books, {
  sources: [files],
  validator: BookValidator,
});

registry.addCollection(books);
await registry.sync();
await registry.export('./out/${collection}/${id}.json');
