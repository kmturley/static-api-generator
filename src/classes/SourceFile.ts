import { readFile } from 'fs/promises';
import { SourceConfig, SourceMapped } from '../types/Source.js';
import { logger } from '../utils/Logger.js';
import Source from './Source.js';

export default class SourceFile extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.getPaths()) {
      logger.debug(`📂 ${path}`);
      try {
        const text: string = await readFile(path, 'utf-8');
        const source: any = this.parse(text);
        this.items = this.items.concat(this.mapFile(source, path));
      } catch (error) {
        logger.error(`Failed to read file ${path}:`, error);
      }
    }
  }

  mapFile(source: any, path: string): SourceMapped[] {
    const parts = path.split(/[/.]+/).slice(0, -1);
    return [
      {
        orgId: parts[parts.length - 2],
        pkgId: parts[parts.length - 1],
        data: source,
      },
    ];
  }
}
