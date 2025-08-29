import { glob } from 'glob';
import Registry from './classes/Registry';
import SourceFile from './classes/SourceFile';
import { SourceFormat } from './types/Source';
import { TargetData, TargetValidator } from './types/Target';

const registry = new Registry<TargetData>();

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

console.log('result', registry.get('books'));
