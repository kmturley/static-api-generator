import { parse } from 'csv';
import { xml2js } from 'xml-js';
import yaml from 'js-yaml';
import { SourceConfig, SourceFormat } from '../types/Source.js';

export default abstract class Source {
  protected config: SourceConfig;
  protected items: any[];

  constructor(config: SourceConfig) {
    this.config = config;
    this.items = [];
  }

  abstract sync(): Promise<void>;

  import(text: string) {
    const source: any = this.parse(text);
    this.items = this.items.concat(this.map(source));
  }

  get() {
    return this.items;
  }

  getPaths() {
    return this.config.paths;
  }

  parse(text: string) {
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

  map(source: any) {
    return this.config.mapper ? this.config.mapper(source) : [source];
  }
}
