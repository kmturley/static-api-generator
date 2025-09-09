import { PackageInterface } from '../types/Package.js';
import { TargetType } from '../types/Target.js';
import TargetFile from './TargetFile.js';

export default class Package {
  orgId: string;
  pkgId: string;
  data: any;

  constructor(orgId: string, pkgId: string, data: any) {
    this.orgId = orgId;
    this.pkgId = pkgId;
    this.data = data;
  }

  get() {
    return this.data;
  }

  merge(data: any) {
    this.data = { ...this.data, ...data };
  }

  async export(targets: TargetFile[], vars: any) {
    const nextVars = { ...vars, package: this.pkgId };
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
