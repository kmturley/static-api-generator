export type RegistryCollection<T> = Record<string, T>;

export interface RegistryData<T> {
  [type: string]: RegistryCollection<T>;
}
