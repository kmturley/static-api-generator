import { CheerioCrawler, log, LogLevel } from 'crawlee';
import { SourceConfig } from '../types/Source.js';
import { logger } from '../utils/Logger.js';
import Source from './Source.js';

export default class SourceSite extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    if (!this.config.mapper)
      throw new Error('Mapper function is required for SourceSite');
    const mapper = this.config.mapper;
    const items: any[] = [];
    log.setLevel(LogLevel.WARNING);
    const crawler = new CheerioCrawler({
      async requestHandler({ request, $ }) {
        logger.debug(`🌐 ${request.url}`);
        items.push(...mapper($));
      },
      maxRequestsPerCrawl: 1,
    });
    await crawler.run(this.getPaths());
    this.items = items;
  }
}
