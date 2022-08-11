import {
  NotionPagePropertiesValues,
  NotionPropertyType,
} from './type-hacks.js';
import { Schema } from './schema.js';
import { isFullDatabaseObject, isFullUser } from './guards.js';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.js';

type InferInput<K extends PropertyKey> = Extract<
  NotionPagePropertiesValues,
  { type: K }
>;

type RecordType = Record<string, NotionPagePropertiesValues>;

type ParserMap = {
  [K in NotionPropertyType]: (input: InferInput<K>) => unknown;
};

type ValuesFromMap<M extends ParserMap> = {
  [K in NotionPropertyType]: ReturnType<M[K]>;
};

type SchemaReturnType<S extends Schema, M extends ParserMap> = {
  [K in keyof S]: ValuesFromMap<M>[S[K]['type']];
};

class Parser<M extends ParserMap, S extends Schema> {
  constructor(private readonly map: M, private readonly schema: S) {}

  parseQueryDatabaseResponse(
    response: QueryDatabaseResponse
  ): SchemaReturnType<S, M>[] {
    return response.results.map((result) => {
      if (!isFullDatabaseObject(result)) {
        throw new Error('Encountered partial database object.');
      }
      return this.parse(result.properties);
    });
  }

  parse(record: RecordType): SchemaReturnType<S, M> {
    return Object.entries(this.schema).reduce((acc, [key, desc]) => {
      const value = record[desc.key];
      if (value.type !== desc.type) {
        throw Error('type does not match expected type');
      }
      const fn = this.map[desc.type];
      if (!fn) {
        throw new Error('No parser provided for type');
      }
      (acc as any)[key] = fn(value as any);
      return acc;
    }, {} as SchemaReturnType<S, M>);
  }
}

function notImplementedFunction(): never {
  throw new Error('Not Implemented');
}

export class ParserBuilder<M extends ParserMap> {
  private constructor(private readonly map: M) {}

  static create() {
    return new ParserBuilder({
      date: (v) => {
        return v.date ? new Date(v.date.start) : null;
      },
      number: (v) => v.number ?? 0,
      select: (v) => v.select?.name ?? null,
      multi_select: (v) => v.multi_select?.map((v) => v.name),
      title: (v) => (v.title.length > 0 ? v.title[0].plain_text : ''),
      people: (v) =>
        v.people.map((person) => {
          if (isFullUser(person)) {
            return person.name ?? '';
          }
          return '';
        }),
      checkbox: (v) => v.checkbox,
      rich_text: (v) => v.rich_text.reduce((a, v) => (a += v.plain_text), ''),
      files: (v) =>
        v.files.map((f) => {
          // Hacky hack, external URLs expire hourly
          // Need to download these
          return {
            name: f.name,
            url:
              f.type === 'external'
                ? f.external.url
                : f.type === 'file'
                ? f.file.url
                : '',
          };
        }),
      url: notImplementedFunction,
      formula: notImplementedFunction,
      relation: notImplementedFunction,
      rollup: notImplementedFunction,
      email: notImplementedFunction,
      phone_number: notImplementedFunction,
      last_edited_by: notImplementedFunction,
      last_edited_time: notImplementedFunction,
      created_by: notImplementedFunction,
      created_time: notImplementedFunction,
    });
  }

  addParserForType<T extends NotionPropertyType, R>(
    type: T,
    fn: (input: InferInput<T>) => R
  ): ParserBuilder<M & Record<T, (input: InferInput<T>) => R>> {
    (this.map as any)[type] = fn;
    return this as ParserBuilder<M & Record<T, (input: InferInput<T>) => R>>;
  }

  build<S extends Schema>(schema: S): Parser<M, S> {
    return new Parser(this.map, schema);
  }
}
