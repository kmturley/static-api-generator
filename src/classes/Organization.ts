import { TargetType } from '../types/Target.js';
import Package from './Package.js';
import TargetFile from './TargetFile.js';

export default class Organization {
  name: string;
  packages: Map<string, Package>;

  constructor(name: string) {
    this.name = name;
    this.packages = new Map();
  }

  addPackage(pkg: Package) {
    const existing = this.packages.get(pkg.slug);
    if (existing) {
      existing.merge(pkg.get());
    } else {
      this.packages.set(pkg.slug, pkg);
    }
  }

  getPackage(slug: string) {
    return this.packages.get(slug);
  }

  listPackages() {
    return Array.from(this.packages.values());
  }

  async export(targets: TargetFile[], vars: any) {
    const nextVars = { ...vars, org: this.name };

    for (const target of targets) {
      if (target.type === TargetType.Org) {
        await target.export(this, nextVars);
      }
    }

    for (const [, pkg] of this.packages) {
      await pkg.export(targets, { ...nextVars, package: pkg.slug });
    }
  }

  toJSON() {
    const data: any = {};
    for (const [slug, pkg] of this.packages) {
      data[slug] = pkg.toJSON();
    }
    return data;
  }
}
