// Step 1: Import data from external sources
// This file loads data from different data sources,
// validates, transforms, merges and exports the data,
// outputs to yaml files for curation and review.

import { glob } from 'glob';
import { SourceFormat } from './types/Source.js';
import { BookValidator } from './types/Example.js';
import Registry from './classes/Registry.js';
import { RegistryConfig } from './types/Registry.js';

const config: RegistryConfig = {
  sources: [
    {
      schema: 'books',
      type: 'api',
      format: SourceFormat.Json,
      paths: ['https://jsonplaceholder.typicode.com/todos/1'],
      mapper: source => [
        {
          id: source.id,
          title: source.title,
        },
      ],
      validator: BookValidator,
    },
    {
      schema: 'books',
      type: 'file',
      format: SourceFormat.Yaml,
      paths: await glob('./data/books/*.yaml'),
      validator: BookValidator,
    },
    {
      schema: 'books',
      type: 'site',
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
    },
  ],
  targets: [{ path: './data/${schema}/${id}.yaml' }],
};

const registry = new Registry(config);
await registry.sync();
await registry.export();
