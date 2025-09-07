import { readFile } from 'fs/promises';
import { SourceConfig } from '../types/Source.js';
import Source from './Source.js';

export default class SourceFile extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.getPaths()) {
      console.log(`📂 ${path}`);
      try {
        const text: string = await readFile(path, 'utf-8');
        const source: any = this.parse(text);
        this.items = this.items.concat(this.mapFile(source, path));
      } catch (error) {
        console.error(`Failed to read file ${path}:`, error);
      }
    }
  }

  mapFile(source: any, path: string) {
    const parts = path.split(/[/.]+/).slice(0, -1);
    return [
      {
        org: parts[parts.length - 2],
        slug: parts[parts.length - 1],
        data: source,
      },
    ];
  }
}
