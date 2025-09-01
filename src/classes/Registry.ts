import { RegistryData } from '../types/Registry.js';
import Source from './Source.js';
import Target from './Target.js';

export default class Registry<T extends { id: number | string }> {
  private sources: Source<T>[] = [];
  private targets: Target<T>[] = [];
  protected records: RegistryData<T>;

  constructor() {
    this.records = {};
  }

  addSource(source: Source<T>) {
    this.sources.push(source);
  }

  addTarget(target: Target<T>) {
    this.targets.push(target);
  }

  async sync() {
    await Promise.all(this.sources.map(s => s.sync()));
    for (const source of this.sources) {
      this.add(source.type, source.get());
    }
  }

  async export() {
    for (const target of this.targets) {
      await target.export(this.records);
    }
  }

  add(type: string, items: T[]) {
    if (!this.records[type]) {
      this.records[type] = {};
    }
    for (const item of items) {
      const existing = this.records[type][item.id];
      this.records[type][item.id] = { ...existing, ...item };
    }
  }

  get(type: string, id?: string | number): T | T[] | undefined {
    if (!this.records[type]) return undefined;
    return id ? this.records[type][id] : Object.values(this.records[type]);
  }

  list(): string[] {
    return Object.keys(this.records);
  }

  filter(type: string, predicate: (item: T) => boolean): T[] {
    return Object.values(this.records[type] ?? {}).filter(predicate);
  }

  search(type: string, query: string): Partial<T>[] {
    if (!this.records[type]) return [];
    const q = query.trim().toLowerCase();
    return Object.values(this.records[type]).filter(item => {
      const str = JSON.stringify(item).toLowerCase();
      return q.split(/\s+/).every(word => str.includes(word));
    });
  }
}
