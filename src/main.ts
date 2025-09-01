// Step 2: Build static JSON API
// This file loads data from existing curated yaml files,
// validates and transforms and exports the data,
// ready to deploy a static JSON API on GitHub pages.

import { glob } from 'glob';
import Registry from './classes/Registry.js';
import SourceFile from './classes/SourceFile.js';
import { SourceFormat } from './types/Source.js';
import { Book, BookValidator } from './types/Book.js';
import Target from './classes/Target.js';

// File import
const file = new SourceFile<Book>({
  type: 'books',
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
  validator: BookValidator,
});

// add/merge sources into registry
const registry = new Registry<Book>();
registry.addSource(file);
await registry.sync();
console.log('result', registry.get('books'));

// export to static json API for deployment to GitHub pages
const out = new Target<Book>('./out/${type}/${id}.json');
registry.addTarget(out);
await registry.export();
