// Step 1: Import data from external sources
// This file loads data from different data sources,
// validates, transforms, merges and exports the data,
// outputs to yaml files for curation and review.

import { glob } from 'glob';
import slugify from 'slugify';
import { SourceFormat } from './types/Source.js';
import { PackageValidator } from './types/Package.js';
import Registry from './classes/Registry.js';
import Collection from './classes/Collection.js';
import SourceFile from './classes/SourceFile.js';
import SourceApi from './classes/SourceApi.js';
import SourceSite from './classes/SourceSite.js';
// import SourceLLM from './classes/SourceLLM.js';
import TargetFile from './classes/TargetFile.js';
import { TargetFormat, TargetType } from './types/Target.js';
import { logger, LogLevel } from './utils/Logger.js';

logger.setLevel(LogLevel.INFO);

function toSlug(item: string) {
  return slugify(item, { lower: true, strict: true });
}

const registry = new Registry({
  name: 'My library',
  url: 'https://library.com',
  version: '1.0.0',
});

const apis = new SourceApi({
  format: SourceFormat.Json,
  paths: ['https://jsonplaceholder.typicode.com/comments/1'],
  mapper: source => [
    {
      orgId: toSlug(source.email),
      pkgId: toSlug(source.name),
      data: {
        author: source.email,
        title: source.name,
      },
    },
  ],
});

const files = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./data/books/**/*.yaml'),
});

// const llms = new SourceLLM({
//   format: SourceFormat.Json,
//   paths: [],
//   prompt: 'Generate a example book with author, title and description fields. Output JSON with fields: author, title, description',
//   model: 'Xenova/gpt2',
//   mapper: source => [
//     {
//       orgId: toSlug(source.author),
//       pkgId: toSlug(source.title),
//       data: {
//         author: source.author,
//         title: source.title,
//       },
//     },
//   ],
// });

const pages = new SourceSite({
  format: SourceFormat.Html,
  paths: [
    'https://www.metacritic.com/game/the-legend-of-zelda-ocarina-of-time/',
  ],
  mapper: $ => [
    {
      orgId: toSlug($('.c-gameDetails_Developer a').text().trim()),
      pkgId: toSlug($('h1').text().trim()),
      data: {
        author: $('.c-gameDetails_Developer a').text().trim(),
        title: $('h1').text().trim(),
      },
    },
  ],
});

const books = new Collection('books', {
  sources: [apis, files, pages],
  validator: PackageValidator,
});

registry.addCollection(books);
await registry.sync();
await registry.export([
  new TargetFile({
    format: TargetFormat.Yaml,
    pattern: './data/${collection.id}/${organization.id}/${package.id}.yaml',
    type: TargetType.Package,
  }),
]);
