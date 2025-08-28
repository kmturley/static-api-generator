import { SourceConfig } from '../types/Source.js';
import Source from './Source.js';
import { readFile } from 'fs/promises';

export default class SourceFile extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.getPaths()) {
      const text: string = await readFile(path, 'utf-8');
      this.add(text);
    }
  }
}
