import Source from './Source.js';

export default class Api {
  protected sources: Record<string, Source>;

  constructor() {
    this.sources = {};
  }

  addSource(namespace: string, source: Source) {
    this.sources[namespace] = source;
  }
}
