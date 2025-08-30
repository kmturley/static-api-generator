import { readFile } from 'fs/promises';
import { SourceConfig } from '../types/Source.js';
import Source from './Source.js';

export default class SourceFile<T> extends Source<T> {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.getPaths()) {
      const text: string = await readFile(path, 'utf-8');
      this.import(text);
    }
  }
}
