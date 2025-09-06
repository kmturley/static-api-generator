import fs from 'fs/promises';
import path from 'path';
import Target from './Target.js';
import { TargetConfig } from '../types/Target.js';
import Package from './Package.js';

export default class TargetFile extends Target {
  constructor(config: TargetConfig) {
    super(config);
  }

  async export(type: string, packages: Map<string, Package>) {
    for (const pathTemplate of this.getPaths()) {
      const pathCollection = pathTemplate.replace(/\$\{collection\}/g, type);
      if (pathTemplate.includes('index')) {
        const pkgList: any = {};
        for (const [id, pkg] of packages.entries()) {
          pkgList[id] = pkg.get();
        }
        const pathIndex = pathCollection.replace(/\$\{id\}/g, 'index');
        const contentIndex = await this.convert(pkgList);
        await fs.writeFile(pathIndex, contentIndex, 'utf-8');
        console.log(`+ ${pathIndex}`);
        return;
      }
      for (const [id, pkg] of packages.entries()) {
        const filePath = pathCollection.replace(/\$\{id\}/g, id);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const content = await this.convert(pkg.get());
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`+ ${filePath}`);
      }
    }
  }

  async exportNew(filePath: string, json: any) {
    const content = await this.convert(json);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }
}
