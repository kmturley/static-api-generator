import { SourceConfig } from '../types/Source.js';
import { logger } from '../utils/Logger.js';
import Source from './Source.js';

export default class SourceApi extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.getPaths()) {
      logger.debug(`🔗 ${path}`);
      const response: Response = await fetch(path);
      const text: string = await response.text();
      this.import(text);
    }
  }
}
