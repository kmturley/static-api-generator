import {
  CollectionConfig,
  CollectionInterface,
  CollectionValidator,
} from '../types/Collection.js';
import Source from './Source.js';
import Target from './TargetFile.js';

export default class Collection {
  private config: CollectionConfig;
  private packages: Map<string, any>;
  private sources: Source[] = [];
  private targets: Target[] = [];
  private validator?: CollectionValidator;
  type: string;

  constructor(type: string, config: CollectionConfig) {
    this.config = config;
    this.packages = new Map();
    this.sources = this.config.sources;
    this.targets = this.config.targets;
    this.validator = this.config.validator;
    this.type = type;
  }

  addPackage(pkg: any) {
    if (this.validator && !this.validator(pkg))
      return console.warn('Not valid', pkg);
    this.packages.set(pkg.id, { ...this.packages.get(pkg.id), ...pkg });
  }

  getPackage(id: string) {
    return this.packages.get(id);
  }

  listPackages() {
    return Array.from(this.packages.values());
  }

  removePackage(id: string) {
    if (!this.packages.has(id)) return;
    this.packages.delete(id);
  }

  reset() {
    this.packages.clear();
  }

  search(query: string) {
    const q = query.trim().toLowerCase();
    return this.listPackages().filter(item =>
      JSON.stringify(item).toLowerCase().includes(q),
    );
  }

  async export() {
    for (const target of this.targets) {
      await target.export(this.type, this.packages);
    }
  }

  async sync() {
    await Promise.all(this.sources.map(s => s.sync()));
    for (const source of this.sources) {
      const packages = source.get();
      for (const pkg of packages) {
        this.addPackage(pkg);
      }
    }
    console.log('packages', this.packages);
  }

  toJSON(): CollectionInterface {
    const data: any = {};
    for (const [id, pkg] of this.packages.entries()) {
      data[id] = pkg.toJSON();
    }
    return data;
  }
}
