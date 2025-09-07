import { TargetType } from '../types/Target.js';
import TargetFile from './TargetFile.js';

export default class Package {
  slug: string;
  org: string;
  data: any;

  constructor(org: string, slug: string, data: any) {
    this.org = org;
    this.slug = slug;
    this.data = data;
  }

  get() {
    return this.data;
  }

  merge(data: any) {
    this.data = { ...this.data, ...data };
  }

  async export(targets: TargetFile[], vars: any) {
    const nextVars = { ...vars, package: this.slug };
    for (const target of targets) {
      if (target.type === TargetType.Package) {
        await target.export(this, nextVars);
      }
    }
  }

  toJSON() {
    return this.data;
  }
}
