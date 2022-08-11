import { NotionPropertyType } from './type-hacks.js';

class Descriptor<T extends NotionPropertyType = NotionPropertyType> {
  constructor(readonly key: string, readonly type: T) {}

  static create<T extends NotionPropertyType>(key: string, type: T) {
    return new Descriptor<T>(key, type);
  }
}

export type Schema<
  K extends string = string,
  T extends NotionPropertyType = NotionPropertyType
> = Record<K, Descriptor<T>>;

export class SchemaBuilder<S extends Schema> {
  private constructor(private schema: S) {}

  static create() {
    return new SchemaBuilder({});
  }

  addProperty<T extends NotionPropertyType, K extends string>(
    key: K,
    columnName: string,
    type: T
  ): SchemaBuilder<S & Schema<K, T>> {
    const descriptor = Descriptor.create(columnName, type);
    const next = {
      ...this.schema,
      [key]: descriptor,
    } as S & Schema<K, T>;
    return new SchemaBuilder<S & Schema<K, T>>(next);
  }

  build(): S {
    return this.schema;
  }
}
