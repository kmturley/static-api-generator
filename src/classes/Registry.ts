import { RegistryData } from '../types/Registry.js';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { SourceFormat } from '../types/Source.js';

export default class Registry<T extends { id: number | string }> {
  protected records: RegistryData<T>;

  constructor() {
    this.records = {};
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

  async export(dir: string, format: SourceFormat = SourceFormat.Json) {
    for (const [type, collection] of Object.entries(this.records)) {
      for (const [id, record] of Object.entries(collection)) {
        const filePath = path.join(dir, `${type}/${id}.${format}`);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        if (format === SourceFormat.Yaml) {
          await fs.writeFile(filePath, yaml.dump(record), 'utf-8');
          continue;
        }
        await fs.writeFile(filePath, JSON.stringify(record, null, 2), 'utf-8');
      }
    }
  }
}
