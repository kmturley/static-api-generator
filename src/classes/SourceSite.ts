import { SourceConfig } from '../types/Source.js';
import { TargetData } from '../types/Target.js';
import Source from './Source.js';
import { CheerioCrawler } from 'crawlee';

export default class SourceSite extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    const config = this.config;
    const items = this.items;
    const crawler = new CheerioCrawler({
      async requestHandler({ $ }) {
        const target: TargetData[] = config.mapper($);
        items.push(...target);
      },
      maxRequestsPerCrawl: 1,
    });
    await crawler.run(this.config.paths);
  }
}
