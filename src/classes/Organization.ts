import { OrganizationInterface } from '../types/Organization.js';
import { TargetType } from '../types/Target.js';
import { logger } from '../utils/Logger.js';
import Package from './Package.js';
import TargetFile from './TargetFile.js';

export default class Organization {
  id: string;
  packages: Map<string, Package>;

  constructor(id: string) {
    this.id = id;
    this.packages = new Map();
  }

  addPackage(pkg: Package) {
    const existing = this.packages.get(pkg.id);
    if (existing) {
      logger.info(`  📦 ${pkg.orgId}/${pkg.id} (merge)`);
      existing.merge(pkg.get());
    } else {
      logger.info(`  📦 ${pkg.orgId}/${pkg.id}`);
      this.packages.set(pkg.id, pkg);
    }
  }

  getPackage(id: string) {
    return this.packages.get(id);
  }

  listPackages() {
    return Array.from(this.packages.values());
  }

  async export(targets: TargetFile[], vars: any) {
    const nextVars = { ...vars, organization: { id: this.id } };
    for (const target of targets) {
      if (target.type === TargetType.Org) {
        await target.export(this, nextVars);
      }
    }
    for (const [, pkg] of this.packages) {
      await pkg.export(targets, nextVars);
    }
  }

  toJSON(): OrganizationInterface {
    return Object.fromEntries(
      Array.from(this.packages, ([id, pkg]) => [id, pkg.toJSON()]),
    );
  }
}
