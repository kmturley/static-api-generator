import { OrganizationInterface } from '../types/Organization.js';
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
    const existing = this.packages.get(pkg.pkgId);
    if (existing) {
      console.log('📦', pkg.orgId + '/' + pkg.pkgId, '(merge)');
      existing.merge(pkg.get());
    } else {
      console.log('📦', pkg.orgId + '/' + pkg.pkgId);
      this.packages.set(pkg.pkgId, pkg);
    }
  }

  getPackage(pkgId: string) {
    return this.packages.get(pkgId);
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
      await pkg.export(targets, { ...nextVars, package: pkg.pkgId });
    }
  }

  toJSON(): OrganizationInterface {
    return Object.fromEntries(
      Array.from(this.packages, ([pkgId, pkg]) => [pkgId, pkg.toJSON()]),
    );
  }
}
