import { js2xml } from 'xml-js';
import { stringify } from 'csv';
import yaml from 'js-yaml';
import { TargetConfig, TargetFormat, TargetType } from '../types/Target.js';

export default abstract class Target {
  format: TargetFormat;
  pattern: string;
  type: TargetType;

  constructor(config: TargetConfig) {
    this.format = config.format;
    this.pattern = config.pattern;
    this.type = config.type;
  }

  abstract export(
    data: any,
    patternVars?: Record<string, string | number>,
  ): Promise<void>;

  replace(pattern: string, vars: Record<string, string | number>): string {
    return pattern.replace(/\$\{([^}]+)\}/g, (_, key) => {
      return vars[key] !== undefined ? String(vars[key]) : key;
    });
  }

  async convert(obj: any): Promise<string> {
    switch (this.format) {
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
        throw new Error(`Unsupported format: ${this.format}`);
    }
  }
}
