import fs from 'fs/promises';
import path from 'path';
import Target from './Target.js';
import { TargetConfig } from '../types/Target.js';

export default class TargetFile extends Target {
  constructor(config: TargetConfig) {
    super(config);
  }

  async export(data: any, patternVars: Record<string, string | number> = {}) {
    const outPath = this.replace(this.pattern, patternVars);
    const dir = path.dirname(outPath);
    const content = await this.convert(data.toJSON());
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(outPath, content, 'utf-8');
    console.log(`📄 ${outPath}`);
  }
}
