// Step 2: Build static JSON API
// This file loads data from existing curated yaml files,
// validates and transforms and exports the data,
// ready to deploy a static JSON API on GitHub pages.

import { glob } from 'glob';
import Registry from './classes/Registry.js';
import SourceFile from './classes/SourceFile.js';
import { SourceFormat } from './types/Source.js';
import { Book, BookValidator } from './types/Book.js';

// File import
const file = new SourceFile<Book>({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
  mapper: source => [
    {
      id: source.id,
      title: source.title,
      author: source.author,
      year: source.year,
    },
  ],
  validator: BookValidator,
});
await file.sync();

// add/merge sources into registry
const registry = new Registry<Book>();
registry.add('books', file.get());
console.log('result', registry.get('books'));

// export to static json API for deployment to GitHub pages
await registry.export('./out/${type}/${id}.json');
