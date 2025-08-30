// Step 1: Import data from external sources
// This file loads data from different data sources,
// validates, transforms, merges and exports the data,
// outputs to yaml files for curation and review.

import { glob } from 'glob';
import SourceApi from './classes/SourceApi.js';
import SourceFile from './classes/SourceFile.js';
import SourceSite from './classes/SourceSite.js';
import { SourceFormat } from './types/Source.js';
import { Book, BookValidator } from './types/Book.js';
import Registry from './classes/Registry.js';

// Api import
const api = new SourceApi<Book>({
  format: SourceFormat.Json,
  paths: ['https://jsonplaceholder.typicode.com/todos/1'],
  mapper: source => [
    {
      id: source.id,
      title: source.title,
    },
  ],
  validator: BookValidator,
});
await api.sync();
console.log(api.get());

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
console.log(file.get());

// Site import
const site = new SourceSite<Book>({
  format: SourceFormat.Html,
  paths: [
    'https://www.metacritic.com/game/the-legend-of-zelda-ocarina-of-time/',
  ],
  mapper: $ => [
    {
      id: 2,
      title: $('h1').text(),
    },
  ],
  validator: BookValidator,
});
await site.sync();
console.log(site.get());

// add/merge sources into registry
const registry = new Registry<Book>();
registry.add('books', api.get());
registry.add('books', file.get());
registry.add('books', site.get());
console.log('result', registry.get('books'));

// export merged data to yaml files for storage/curation
await registry.export('./data/${type}/${id}.yaml');
