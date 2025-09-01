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
import Target from './classes/Target.js';

// Api import
const api = new SourceApi<Book>({
  type: 'books',
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

// File import
const file = new SourceFile<Book>({
  type: 'books',
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
  validator: BookValidator,
});

// Site import
const site = new SourceSite<Book>({
  type: 'books',
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

// add/merge sources into registry
const registry = new Registry<Book>();
registry.addSource(api);
registry.addSource(file);
registry.addSource(site);
await registry.sync();
console.log('result', registry.get('books'));

// export merged data to yaml files for storage/curation
const data = new Target<Book>('./data/${type}/${id}.yaml');
registry.addTarget(data);
await registry.export();
