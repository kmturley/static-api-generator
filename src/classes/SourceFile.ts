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
        this.import(text);
      } catch (error) {
        console.error(`Failed to read file ${path}:`, error);
      }
    }
  }
}
