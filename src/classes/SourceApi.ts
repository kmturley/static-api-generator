import { SourceConfig, SourceData } from '../types/Source.js';
import Source from './Source.js';

export default class SourceApi extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    const items: SourceData[] = [];
    for (const path of this.config.paths) {
      const response: Response = await fetch(path);
      const text: string = await response.text();
      const item: SourceData = this.parse(text);
      items.push(item);
    }
    this.items = items.map(this.config.mapper);
  }
}
