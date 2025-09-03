// Step 2: Build static JSON API
// This file loads data from existing curated yaml files,
// validates and transforms and exports the data,
// ready to deploy a static JSON API on GitHub pages.

import { glob } from 'glob';
import Registry from './classes/Registry.js';
import { SourceFormat } from './types/Source.js';
import { RegistryConfig } from './types/Registry.js';
import { Library } from './types/Example.js';

const config: RegistryConfig = {
  sources: [
    {
      schema: Library.Books,
      format: SourceFormat.Yaml,
      paths: await glob('./data/books/*.yaml'),
    },
  ],
  targets: [{ path: './out/${schema}/${id}.json' }],
};

const registry = new Registry(config);
await registry.sync();
await registry.export();
