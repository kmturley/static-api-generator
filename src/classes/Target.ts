import { js2xml } from 'xml-js';
import { stringify } from 'csv';
import yaml from 'js-yaml';
import { TargetConfig, TargetFormat } from '../types/Target.js';
import Package from './Package.js';

export default abstract class Target {
  protected config: TargetConfig;

  constructor(config: TargetConfig) {
    this.config = config;
  }

  abstract export(type: string, packages: Map<string, Package>): Promise<void>;

  getPaths() {
    return this.config.paths;
  }

  async convert(obj: any): Promise<string> {
    switch (this.config.format) {
      case TargetFormat.Csv:
        return new Promise<string>((resolve, reject) => {
          stringify([obj], (err, output) => {
            if (err) reject(err);
            else resolve(output);
          });
        });
      case TargetFormat.Json:
        return JSON.stringify(obj, null, 2);
      case TargetFormat.Yaml:
        return yaml.dump(obj, { indent: 2 });
      case TargetFormat.Xml:
        return js2xml({ root: obj });
      default:
        return JSON.stringify(obj, null, 2);
    }
  }
}
