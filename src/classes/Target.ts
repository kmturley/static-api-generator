import fs from 'fs/promises';
import path from 'path';
import { js2xml } from 'xml-js';
import { stringify } from 'csv';
import yaml from 'js-yaml';
import { SourceFormat } from '../types/Source.js';

export default class Target {
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

  async export(type: string, pathTemplate: string, packages: Map<string, any>) {
    for (const [id, pkg] of packages.entries()) {
      const filePath = pathTemplate
        .replace(/\$\{collection\}/g, type)
        .replace(/\$\{id\}/g, id);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      const format: SourceFormat =
        (Object.values(SourceFormat).find(f => f === ext) as SourceFormat) ??
        SourceFormat.Json;
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      const content = await this.convert(pkg, format);
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`+ ${filePath}`);
    }
  }
}
