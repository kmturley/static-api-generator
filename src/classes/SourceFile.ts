import { SourceConfig, SourceData } from '../types/Source.js';
import { TargetData } from '../types/Target.js';
import Source from './Source.js';
import { readFile } from 'fs/promises';

export default class SourceFile extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.config.paths) {
      const text: string = await readFile(path, 'utf-8');
      const source: SourceData = this.parse(text);
      const target: TargetData[] = this.config.mapper(source);
      this.validate(target);
    }
  }
}
