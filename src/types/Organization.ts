import { PackageInterface } from './Package';

export interface OrganizationInterface {
  [pkgId: string]: PackageInterface;
}
