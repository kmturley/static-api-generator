import { SourceConfig, SourceData } from '../types/Source.js';
import Source from './Source.js';
import { CheerioCrawler } from 'crawlee';

export default class SourceSite extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    const items: SourceData[] = [];
    const crawler = new CheerioCrawler({
      async requestHandler({ $ }) {
        items.push($);
      },
      maxRequestsPerCrawl: 1,
    });
    await crawler.run(this.config.paths);
    this.items = items.map(this.config.mapper);
  }
}
