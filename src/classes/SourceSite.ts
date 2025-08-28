import { SourceConfig } from '../types/Source.js';
import { TargetData } from '../types/Target.js';
import Source from './Source.js';
import { CheerioCrawler } from 'crawlee';

export default class SourceSite extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    const mapper = this.config.mapper;
    const target: TargetData[] = [];
    const crawler = new CheerioCrawler({
      async requestHandler({ $ }) {
        target.push(...mapper($));
      },
      maxRequestsPerCrawl: 1,
    });
    await crawler.run(this.getPaths());
    this.validate(target);
  }
}
