import { RegistryConfig, RegistryInterface } from '../types/Registry.js';
import { TargetConfig } from '../types/Target.js';
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
    this.collections.set(collection.type, collection);
  }

  getCollection(type: string) {
    return this.collections.get(type);
  }

  async export(config?: TargetConfig) {
    for (const [, collection] of this.collections) {
      await collection.export();
    }
    if (config) {
      const target = new TargetFile(config);
      target.exportNew(config.paths[0], this.toJSON());
    }
  }

  reset() {
    for (const [, collection] of this.collections) {
      collection.reset();
    }
  }

  async sync() {
    for (const [, collection] of this.collections) {
      await collection.sync();
    }
  }

  toJSON(): RegistryInterface {
    const data: RegistryInterface = {
      name: this.name,
      url: this.url,
      version: this.version,
    };
    for (const [type, collection] of this.collections) {
      data[type] = collection.toJSON();
    }
    return data;
  }
}
