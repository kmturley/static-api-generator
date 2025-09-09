import {
  CollectionConfig,
  CollectionInterface,
  CollectionValidator,
} from '../types/Collection.js';
import { TargetType } from '../types/Target.js';
import Organization from './Organization.js';
import Package from './Package.js';
import Source from './Source.js';
import TargetFile from './TargetFile.js';

export default class Collection {
  private config: CollectionConfig;
  private orgs: Map<string, Organization>;
  private sources: Source[] = [];
  private validator?: CollectionValidator;
  type: string;

  constructor(type: string, config: CollectionConfig) {
    this.config = config;
    this.orgs = new Map();
    this.sources = this.config.sources;
    this.validator = this.config.validator;
    this.type = type;
  }

  addPackage(pkg: Package) {
    if (this.validator && !this.validator(pkg.get()))
      return console.warn('Not valid', pkg);

    if (!this.orgs.has(pkg.orgId)) {
      this.orgs.set(pkg.orgId, new Organization(pkg.orgId));
    }
    this.orgs.get(pkg.orgId)!.addPackage(pkg);
  }

  getPackage(orgId: string, pkgId: string) {
    const org = this.orgs.get(orgId);
    return org?.getPackage(pkgId);
  }

  listPackages() {
    const packages: Package[] = [];
    for (const org of this.orgs.values()) {
      packages.push(...org.listPackages());
    }
    return packages;
  }

  removePackage(orgId: string, pkgId: string) {
    const org = this.orgs.get(orgId);
    if (org) {
      org.packages.delete(pkgId);
      if (org.packages.size === 0) {
        this.orgs.delete(orgId);
      }
    }
  }

  reset() {
    this.orgs.clear();
  }

  search(query: string) {
    const q = query.trim().toLowerCase();
    return this.listPackages().filter(item =>
      JSON.stringify(item).toLowerCase().includes(q),
    );
  }

  async export(targets: TargetFile[], vars: any) {
    const nextVars = { ...vars, collection: this.type };

    for (const target of targets) {
      if (target.type === TargetType.Collection) {
        await target.export(this, nextVars);
      }
    }

    for (const [, org] of this.orgs) {
      await org.export(targets, nextVars);
    }
  }

  async sync() {
    await Promise.all(this.sources.map(s => s.sync()));
    for (const source of this.sources) {
      const items: any[] = source.get();
      console.log(source.constructor.name);
      for (const item of items) {
        const pkg = new Package(item.orgId, item.pkgId, item.data);
        this.addPackage(pkg);
      }
    }
  }

  toJSON(): CollectionInterface {
    return Object.fromEntries(
      Array.from(this.orgs, ([orgId, org]) => [orgId, org.toJSON()]),
    );
  }
}
