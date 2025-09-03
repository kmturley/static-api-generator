import fs from 'fs/promises';
import path from 'path';
import { js2xml } from 'xml-js';
import { stringify } from 'csv';
import yaml from 'js-yaml';

import { SourceFormat } from '../types/Source.js';
import { RegistryData } from '../types/Registry.js';

export default class Target {
  pathTemplate: string = '';
  constructor(pathTemplate: string) {
    this.pathTemplate = pathTemplate;
  }

  async convert(obj: any, format: SourceFormat): Promise<string> {
    switch (format) {
      case SourceFormat.Csv:
        return new Promise<string>((resolve, reject) => {
          stringify([obj], (err, output) => {
            if (err) reject(err);
            else resolve(output);
          });
        });
      case SourceFormat.Json:
        return JSON.stringify(obj, null, 2);
      case SourceFormat.Yaml:
        return yaml.dump(obj, { indent: 2 });
      case SourceFormat.Xml:
        return js2xml({ root: obj });
      default:
        return JSON.stringify(obj, null, 2);
    }
  }

  async export(records: RegistryData) {
    for (const [schema, collection] of Object.entries(records)) {
      for (const [id, record] of Object.entries(collection)) {
        const sanitizedSchema = path.basename(schema);
        const sanitizedId = path.basename(String(id));
        const filePath = this.pathTemplate
          .replace(/\$\{schema\}/g, sanitizedSchema)
          .replace(/\$\{id\}/g, sanitizedId);
        const ext = path.extname(filePath).slice(1).toLowerCase();
        const format: SourceFormat =
          (Object.values(SourceFormat).find(f => f === ext) as SourceFormat) ??
          SourceFormat.Json;
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const content = await this.convert(record, format);
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`+ ${filePath}`);
      }
    }
  }
}
