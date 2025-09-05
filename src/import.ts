// Step 1: Import data from external sources
// This file loads data from different data sources,
// validates, transforms, merges and exports the data,
// outputs to yaml files for curation and review.

import { glob } from 'glob';
import { SourceFormat } from './types/Source.js';
import { BookValidator, Library } from './types/Example.js';
import Registry from './classes/Registry.js';
import Collection from './classes/Collection.js';
import SourceFile from './classes/SourceFile.js';
import SourceApi from './classes/SourceApi.js';
import SourceSite from './classes/SourceSite.js';

const registry = new Registry({
  name: 'My library',
  url: 'https://library.com',
  version: '1.0.0',
});

const requests = new SourceApi({
  format: SourceFormat.Json,
  paths: ['https://jsonplaceholder.typicode.com/todos/1'],
  mapper: source => [
    {
      id: source.id,
      title: source.title,
    },
  ],
});

const files = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/*.yaml'),
});

const pages = new SourceSite({
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
});

const books = new Collection(Library.Books, {
  sources: [requests, files, pages],
  validator: BookValidator,
});

registry.addCollection(books);
await registry.sync();
await registry.export('./data/${collection}/${id}.yaml');
