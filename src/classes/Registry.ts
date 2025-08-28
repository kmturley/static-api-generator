import { RegistryCollection } from '../types/Registry.js';
import { TargetData } from '../types/Target.js';

export default class Registry {
  protected records: Record<string, RegistryCollection>;

  constructor() {
    this.records = {};
  }

  add(type: string, records: TargetData[]) {
    if (!this.records[type]) {
      this.records[type] = {};
    }
    for (const record of records) {
      const existing = this.records[type][record.id];
      console.log(type, record.id, existing, 'merge', record);
      this.records[type][record.id] = { ...existing, ...record };
    }
  }

  get(type: string) {
    return this.records[type];
  }
}
