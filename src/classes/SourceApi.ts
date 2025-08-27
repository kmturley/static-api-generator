import { SourceConfig, SourceData } from '../types/Source.js';
import { TargetData } from '../types/Target.js';
import Source from './Source.js';

export default class SourceApi extends Source {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.config.paths) {
      const response: Response = await fetch(path);
      const text: string = await response.text();
      const source: SourceData = this.parse(text);
      const target: TargetData[] = this.config.mapper(source);
      this.validate(target);
    }
  }
}
