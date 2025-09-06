import {
  CollectionConfig,
  CollectionInterface,
  CollectionValidator,
} from '../types/Collection.js';
import Package from './Package.js';
import Source from './Source.js';
import Target from './TargetFile.js';

export default class Collection {
  private config: CollectionConfig;
  private packages: Map<string, Package>;
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

  addPackage(pkg: Package) {
    if (this.validator && !this.validator(pkg.get()))
      return console.warn('Not valid', pkg);
    const existing = this.packages.get(pkg.id);
    if (existing) {
      existing.merge(pkg.get());
    } else {
      this.packages.set(pkg.id, pkg);
    }
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
      const items: any[] = source.get();
      for (const item of items) {
        console.log('item', item);
        const pkg = new Package(item.id, item);
        console.log('pkg', pkg);
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
