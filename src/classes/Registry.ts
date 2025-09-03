import { RegistryConfig, RegistryData } from '../types/Registry.js';
import { SourceConfig } from '../types/Source.js';
import { TargetConfig } from '../types/Target.js';
import Source from './Source.js';
import SourceApi from './SourceApi.js';
import SourceFile from './SourceFile.js';
import SourceSite from './SourceSite.js';
import Target from './Target.js';

export default class Registry<T extends { id: number | string }> {
  private config: RegistryConfig;
  private sources: Source[] = [];
  private targets: Target[] = [];
  private records: RegistryData;

  constructor(config: RegistryConfig) {
    this.config = config;
    this.records = {};
    if (this.config.sources) this.addSources(this.config.sources);
    if (this.config.targets) this.addTargets(this.config.targets);
  }

  addSources(sources: SourceConfig[]) {
    sources.forEach(source => {
      if (source.type === 'api') {
        this.sources.push(new SourceApi(source));
      } else if (source.type === 'site') {
        this.sources.push(new SourceSite(source));
      } else {
        this.sources.push(new SourceFile(source));
      }
    });
  }

  addTargets(targets: TargetConfig[]) {
    targets.forEach(target => {
      this.targets.push(new Target(target.path));
    });
  }

  async sync() {
    await Promise.all(this.sources.map(s => s.sync()));
    for (const source of this.sources) {
      this.add(source.schema, source.get());
    }
    console.log('records', this.records);
  }

  async export() {
    await Promise.all(this.targets.map(target => target.export(this.records)));
  }

  add(schema: string, items: any[]) {
    if (!this.records[schema]) {
      this.records[schema] = {};
    }
    for (const item of items) {
      const existing = this.records[schema][item.id];
      this.records[schema][item.id] = { ...existing, ...item };
    }
  }

  get(schema: string, id?: string | number) {
    if (!this.records[schema]) return undefined;
    return id ? this.records[schema][id] : Object.values(this.records[schema]);
  }

  list() {
    return Object.keys(this.records);
  }

  filter(schema: string, predicate: (item: T) => boolean) {
    return Object.values(this.records[schema] ?? {}).filter(predicate);
  }

  search(schema: string, query: string) {
    if (!this.records[schema]) return [];
    const q = query.trim().toLowerCase();
    return Object.values(this.records[schema]).filter(item => {
      const str = JSON.stringify(item).toLowerCase();
      return q.split(/\s+/).every(word => str.includes(word));
    });
  }
}
