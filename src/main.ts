// import Api from "./classes/Api.js";
import { glob } from 'glob';
import SourceApi from './classes/SourceApi.js';
import SourceFile from './classes/SourceFile.js';
import SourceSite from './classes/SourceSite.js';
import { SourceFormat } from './types/Source.js';
import { TargetValidator } from './types/Target.js';

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

const file = new SourceFile({
  format: SourceFormat.Yaml,
  paths: await glob('./src/data/*.yaml'),
  mapper: source => [
    {
      id: source.id,
      title: source.title,
    },
  ],
  validator: TargetValidator,
});
await file.sync();
console.log(file.get());

const site = new SourceSite({
  format: SourceFormat.Html,
  paths: [
    'https://www.metacritic.com/game/the-legend-of-zelda-ocarina-of-time/',
  ],
  mapper: $ => [
    {
      id: 1,
      title: $('h1').text(),
    },
  ],
  validator: TargetValidator,
});
await site.sync();
console.log(site.get());

// const api = new Api();
// api.addSource(api);
// api.addSource(file);
// api.addSource(site);
