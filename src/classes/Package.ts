import { TargetType } from '../types/Target.js';
import TargetFile from './TargetFile.js';

export default class Package {
  id: string;
  data: any;

  constructor(id: string, data: any) {
    this.id = id;
    this.data = data;
  }

  get() {
    return this.data;
  }

  merge(data: any) {
    this.data = { ...this.data, ...data };
  }

  async export(targets: TargetFile[], vars: any) {
    vars = { ...vars, package: this.id };
    for (const target of targets) {
      if (target.type === TargetType.Package) {
        await target.export(this, vars);
      }
    }
  }

  toJSON() {
    return this.data;
  }
}
