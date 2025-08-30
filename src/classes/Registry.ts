import fs from 'fs/promises';
import { js2xml } from 'xml-js';
import path from 'path';
import { stringify } from 'csv';
import yaml from 'js-yaml';
import { RegistryData } from '../types/Registry.js';
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

  async convert(obj: Partial<T>, format: SourceFormat): Promise<string> {
    switch (format) {
      case SourceFormat.Csv:
        return new Promise<string>((resolve, reject) => {
          stringify([obj], (err, output) => {
            if (err) reject(err);
            else resolve(output);
          });
        });
      case SourceFormat.Json:
        return JSON.stringify(obj, null, 2);
      case SourceFormat.Yaml:
        return yaml.dump(obj, { indent: 2 });
      case SourceFormat.Xml:
        return js2xml({ root: obj });
      default:
        return JSON.stringify(obj, null, 2);
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

  async export(pathTemplate: string) {
    for (const [type, collection] of Object.entries(this.records)) {
      for (const [id, record] of Object.entries(collection)) {
        const filePath = pathTemplate
          .replace(/\$\{type\}/g, type)
          .replace(/\$\{id\}/g, String(id));
        const ext = path.extname(filePath).slice(1).toLowerCase();
        const format: SourceFormat =
          (Object.values(SourceFormat).find(f => f === ext) as SourceFormat) ??
          SourceFormat.Json;
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const content = await this.convert(record, format);
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`+ ${filePath}`);
      }
    }
  }
}
