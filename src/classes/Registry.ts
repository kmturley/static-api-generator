import { RegistryConfig, RegistryInterface } from '../types/Registry.js';
import { TargetType } from '../types/Target.js';
import { logger } from '../utils/Logger.js';
import { Report } from '../utils/Report.js';
import Collection from './Collection.js';
import TargetFile from './TargetFile.js';

export default class Registry {
  name: string;
  url: string;
  version: string;
  collections: Map<string, Collection>;

  constructor(config: RegistryConfig) {
    this.name = config.name;
    this.url = config.url;
    this.version = config.version;
    this.collections = new Map();
  }

  addCollection(collection: Collection) {
    this.collections.set(collection.id, collection);
  }

  getCollection(id: string) {
    return this.collections.get(id);
  }

  async export(targets: TargetFile[]) {
    logger.info('Registry export started');
    const nextVars = { registry: { name: this.name, version: this.version } };
    for (const target of targets) {
      if (target.type === TargetType.Registry) {
        await target.export(this, nextVars);
      }
    }
    for (const [, collection] of this.collections) {
      await collection.export(targets, nextVars);
    }
    logger.info('Registry export completed');
  }

  reset() {
    for (const [, collection] of this.collections) {
      collection.reset();
    }
  }

  async sync() {
    const report = new Report();
    logger.info('Registry sync started');

    for (const [, collection] of this.collections) {
      await collection.sync(report);
    }

    report.printSummary();
    logger.info('Registry sync completed');
    return report.getSummary();
  }

  toJSON(): RegistryInterface {
    return {
      name: this.name,
      url: this.url,
      version: this.version,
      ...Object.fromEntries(
        Array.from(this.collections, ([type, collection]) => [
          type,
          collection.toJSON(),
        ]),
      ),
    };
  }
}
