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

  get() {
    return this.items;
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
}
