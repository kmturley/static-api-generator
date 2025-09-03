import { parse } from 'csv';
import { xml2js } from 'xml-js';
import yaml from 'js-yaml';
import { SourceConfig, SourceFormat } from '../types/Source.js';
import { SourceData } from '../types/Source.js';

export default abstract class Source {
  protected config: SourceConfig;
  protected items: any[];
  schema: string;

  constructor(config: SourceConfig) {
    this.config = config;
    this.items = [];
    this.schema = config.schema;
  }

  abstract sync(): Promise<void>;

  import(text: string) {
    const source: SourceData = this.parse(text);
    const items: any[] = this.map(source);
    this.validate(items);
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
        return xml2js(text, { ignoreDeclaration: true });
      default:
        return JSON.parse(text);
    }
  }

  map(source: SourceData) {
    return this.config.mapper ? this.config.mapper(source) : [source];
  }

  validate(items: any[]) {
    for (const item of items) {
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
