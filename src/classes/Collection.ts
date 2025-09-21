import {
  CollectionConfig,
  CollectionInterface,
  CollectionValidator,
} from '../types/Collection.js';
import { SourceMapped } from '../types/Source.js';
import { TargetType } from '../types/Target.js';
import { logger } from '../utils/Logger.js';
import { ValidationReport } from '../utils/ValidationReport.js';
import Organization from './Organization.js';
import Package from './Package.js';
import Source from './Source.js';
import TargetFile from './TargetFile.js';

export default class Collection {
  private config: CollectionConfig;
  private orgs: Map<string, Organization>;
  private sources: Source[] = [];
  private validator?: CollectionValidator;
  id: string;

  constructor(id: string, config: CollectionConfig) {
    this.config = config;
    this.orgs = new Map();
    this.sources = this.config.sources;
    this.validator = this.config.validator;
    this.id = id;
  }

  addPackage(pkg: Package, report?: ValidationReport) {
    if (this.validator) {
      const result = this.validator(pkg.get());
      if (report) {
        if (typeof result === 'boolean') {
          report.addCustomResult(
            `${pkg.orgId}/${pkg.id}`,
            result,
            result ? undefined : 'Package validation failed',
          );
        } else {
          report.addZodResult(`${pkg.orgId}/${pkg.id}`, result);
        }
      }
      const isValid = typeof result === 'boolean' ? result : result.success;
      if (!isValid) {
        logger.warn(`Invalid package: ${pkg.orgId}/${pkg.id}`);
        return;
      }
    }

    if (!this.orgs.has(pkg.orgId)) {
      this.orgs.set(pkg.orgId, new Organization(pkg.orgId));
    }
    this.orgs.get(pkg.orgId)!.addPackage(pkg);
  }

  getPackage(orgId: string, id: string) {
    const org = this.orgs.get(orgId);
    return org?.getPackage(id);
  }

  listPackages() {
    const packages: Package[] = [];
    for (const org of this.orgs.values()) {
      packages.push(...org.listPackages());
    }
    return packages;
  }

  removePackage(orgId: string, id: string) {
    const org = this.orgs.get(orgId);
    if (org) {
      org.packages.delete(id);
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
    const nextVars = { ...vars, collection: { id: this.id } };
    for (const target of targets) {
      if (target.type === TargetType.Collection) {
        await target.export(this, nextVars);
      }
    }
    for (const [, org] of this.orgs) {
      await org.export(targets, nextVars);
    }
  }

  async sync(report?: ValidationReport) {
    logger.info(`${this.id} sync started`);
    await Promise.all(this.sources.map(s => s.sync()));
    for (const source of this.sources) {
      const items: SourceMapped[] = source.get();
      logger.info(`${this.id} add ${source.constructor.name}`);
      for (const item of items) {
        const pkg = new Package(item.orgId, item.pkgId, item.data);
        this.addPackage(pkg, report);
      }
    }
    logger.info(
      `${this.id} sync completed: ${this.listPackages().length} packages`,
    );
  }

  toJSON(): CollectionInterface {
    return Object.fromEntries(
      Array.from(this.orgs, ([orgId, org]) => [orgId, org.toJSON()]),
    );
  }
}
