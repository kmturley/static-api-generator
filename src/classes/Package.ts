import { PackageInterface } from '../types/Package.js';
import { TargetType } from '../types/Target.js';
import TargetFile from './TargetFile.js';

export default class Package {
  orgId: string;
  id: string;
  data: any;

  constructor(orgId: string, id: string, data: any) {
    this.orgId = orgId;
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
    const nextVars = { ...vars, package: { id: this.id } };
    for (const target of targets) {
      if (target.type === TargetType.Package) {
        await target.export(this, nextVars);
      }
    }
  }

  toJSON(): PackageInterface {
    return this.data;
  }
}
