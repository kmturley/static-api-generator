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

  toJSON() {
    return this.data;
  }
}
