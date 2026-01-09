import {
  CollectionConfig,
  CollectionInterface,
  CollectionValidator,
} from '../types/Collection.js';
import { SourceMapped } from '../types/Source.js';
import { TargetType } from '../types/Target.js';
import { logger } from '../utils/Logger.js';
import { Report } from '../utils/Report.js';
import Package from './Package.js';
import Source from './Source.js';
import TargetFile from './TargetFile.js';

export default class Collection {
  private config: CollectionConfig;
  private packages: Map<string, Package>;
  private sources: Source[] = [];
  private validator?: CollectionValidator;
  id: string;

  constructor(id: string, config: CollectionConfig) {
    this.config = config;
    this.packages = new Map();
    this.sources = this.config.sources;
    this.validator = this.config.validator;
    this.id = id;
  }

  addPackage(pkg: Package, report?: Report) {
    if (this.validator) {
      const result = this.validator(pkg.get());
      if (report) {
        report.addCustomResult(
          pkg.id,
          result.success,
          result.error?.message ||
            (result.success ? undefined : 'Package validation failed'),
          result.error,
        );
      }
      if (!result.success) {
        logger.warn(`Invalid package: ${pkg.id}`);
        return;
      }
    }

    const existing = this.packages.get(pkg.id);
    if (existing) {
      logger.info(`  📦 ${pkg.id} (merge)`);
      existing.merge(pkg.get());
    } else {
      logger.info(`  📦 ${pkg.id}`);
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

  async export(targets: TargetFile[], vars: any) {
    const nextVars = { ...vars, collection: { id: this.id } };
    for (const target of targets) {
      if (target.type === TargetType.Collection) {
        await target.export(this, nextVars);
      }
    }
    for (const pkg of this.packages.values()) {
      await pkg.export(targets, nextVars);
    }
  }

  async sync(report?: Report) {
    logger.info(
      `${logger['colorize']('❯', 'yellow')} Collection ${this.id} sync`,
    );
    await Promise.all(this.sources.map(s => s.sync()));
    for (const source of this.sources) {
      const items: SourceMapped[] = source.get();
      logger.info(`  ${source.constructor.name}:`);
      for (const item of items) {
        const pkg = new Package(item.pkgId, item.data);
        this.addPackage(pkg, report);
      }
    }
    logger.info(`  Packages:  ${this.listPackages().length}\n`);
  }

  toJSON(): CollectionInterface {
    return Object.fromEntries(
      Array.from(this.packages, ([pkgId, pkg]) => [pkgId, pkg.toJSON()]),
    );
  }

  async exportAssociated(
    id: string,
    collection: Collection,
    targets: TargetFile[],
  ) {
    for (const pkg of this.listPackages()) {
      const sourceData = pkg.get();
      const associations = sourceData[id];

      if (associations && typeof associations === 'object') {
        const baseVars = {
          collection: { id: this.id },
          package: { id: pkg.id },
          associatedCollection: { id },
        };
        for (const target of targets) {
          if (target.type === TargetType.Collection) {
            await target.export(
              {
                toJSON: () => this.buildAssociated(collection, associations),
              },
              baseVars,
            );
          } else if (target.type === TargetType.Package) {
            for (const [pkgId, enabled] of Object.entries(associations)) {
              if (enabled) {
                const targetPackage = collection.getPackage(pkgId);
                if (targetPackage) {
                  const packageVars = {
                    ...baseVars,
                    associatedPackage: { id: pkgId },
                  };
                  await target.export(
                    { toJSON: () => targetPackage.get() },
                    packageVars,
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  private buildAssociated(
    collection: Collection,
    associations: Record<string, boolean>,
  ) {
    const result: any = {};
    for (const [pkgId, enabled] of Object.entries(associations)) {
      if (enabled) {
        const targetPackage = collection.getPackage(pkgId);
        if (targetPackage) {
          result[pkgId] = targetPackage.get();
        }
      }
    }
    return result;
  }
}
