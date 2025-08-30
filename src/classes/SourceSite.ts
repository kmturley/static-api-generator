import { CheerioCrawler } from 'crawlee';
import { SourceConfig } from '../types/Source.js';
import Source from './Source.js';

export default class SourceSite<T> extends Source<T> {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    const mapper = this.config.mapper;
    const target: T[] = [];
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
