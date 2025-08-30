import { SourceConfig } from '../types/Source.js';
import Source from './Source.js';

export default class SourceApi<T> extends Source<T> {
  constructor(config: SourceConfig) {
    super(config);
  }

  async sync() {
    for (const path of this.getPaths()) {
      const response: Response = await fetch(path);
      const text: string = await response.text();
      this.import(text);
    }
  }
}
