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
    const target: TargetData[] = [];
    const crawler = new CheerioCrawler({
      async requestHandler({ $ }) {
        target.push(...config.mapper($));
      },
      maxRequestsPerCrawl: 1,
    });
    await crawler.run(this.config.paths);
    this.validate(target);
  }
}
