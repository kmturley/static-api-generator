import fs from 'fs/promises';
import path from 'path';
import Target from './Target.js';
import { TargetConfig } from '../types/Target.js';

export default class TargetFile extends Target {
  constructor(config: TargetConfig) {
    super(config);
  }

  async export(type: string, packages: Map<string, any>) {
    for (const pathTemplate of this.getPaths()) {
      for (const [id, pkg] of packages.entries()) {
        const filePath = pathTemplate
          .replace(/\$\{collection\}/g, type)
          .replace(/\$\{id\}/g, id);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const content = await this.convert(pkg);
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`+ ${filePath}`);
      }
    }
  }
}
