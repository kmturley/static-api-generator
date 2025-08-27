import { SourceConfig, SourceData } from '../types/Source.js';
import Source from './Source.js';
import { readFile } from 'fs/promises';

export default class SourceFile extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    const items: SourceData[] = [];
    for (const path of this.config.paths) {
      const text: string = await readFile(path, 'utf-8');
      const item: SourceData = this.parse(text);
      items.push(item);
    }
    this.items = items.map(this.config.mapper);
  }
}
