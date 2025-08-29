import { glob } from 'glob';
import SourceApi from './classes/SourceApi.js';
import SourceFile from './classes/SourceFile.js';
import SourceSite from './classes/SourceSite.js';
import { SourceFormat } from './types/Source.js';
import { TargetData, TargetValidator } from './types/Target.js';
import Registry from './classes/Registry.js';

// Api import
const api = new SourceApi({
  format: SourceFormat.Json,
  paths: ['https://jsonplaceholder.typicode.com/todos/1'],
  mapper: source => [
    {
      id: source.id,
      title: source.title,
    },
  ],
  validator: TargetValidator,
});
await api.sync();
console.log(api.get());

// File import
const file = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./src/data/*.yaml'),
  mapper: source => [
    {
      id: source.id,
      title: source.title,
      author: source.author,
      year: source.year,
    },
  ],
  validator: TargetValidator,
});
await file.sync();
console.log(file.get());

// Site import
const site = new SourceSite({
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
  validator: TargetValidator,
});
await site.sync();
console.log(site.get());

const registry = new Registry<TargetData>();

// add/merge sources into registry
registry.add('books', api.get());
registry.add('books', file.get());
registry.add('books', site.get());

console.log('result', registry.get('books'));

// export merged data to yaml files for storage/curation
await registry.export('./export');
