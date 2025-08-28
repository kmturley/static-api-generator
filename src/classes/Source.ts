import { parse } from 'csv';
import { xml2js } from 'xml-js';
import yaml from 'js-yaml';
import { SourceConfig, SourceFormat } from '../types/Source.js';
import { SourceData } from '../types/Source.js';
import { TargetData } from '../types/Target.js';

export default abstract class Source {
  protected config: SourceConfig;
  protected items: TargetData[];

  constructor(config: SourceConfig) {
    this.config = config;
    this.items = [];
  }

  abstract sync(): Promise<void>;

  add(text: string) {
    const source: SourceData = this.parse(text);
    const target: TargetData[] = this.map(source);
    this.validate(target);
  }

  get() {
    return this.items;
  }

  getPaths() {
    return this.config.paths;
  }

  parse(text: string): SourceData {
    switch (this.config.format) {
      case SourceFormat.Csv:
        return parse(text);
      case SourceFormat.Json:
        return JSON.parse(text);
      case SourceFormat.Yaml:
        return yaml.load(text);
      case SourceFormat.Xml:
        return xml2js(text);
      default:
        return JSON.parse(text);
    }
  }

  map(source: SourceData) {
    return this.config.mapper(source);
  }

  validate(target: TargetData[]) {
    for (const item of target) {
      if (this.config.validator) {
        const result = this.config.validator(item);
        if (result === true) {
          this.items.push(item);
        } else {
          console.warn('--------', item, result, '--------');
        }
      } else {
        this.items.push(item);
      }
    }
  }
}
