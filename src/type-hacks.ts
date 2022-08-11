import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.js';

type AllKeys<T> = T extends never ? never : keyof T;
type OptionalKeys<T> = Exclude<AllKeys<T>, keyof T>;
type Idx<T, K extends PropertyKey, D = never> = T extends never
  ? never
  : K extends keyof T
  ? T[K]
  : D;

type Widen<T> = {
  [K in OptionalKeys<T>]?: Idx<T, K>;
} & { [K in keyof T]: T[K] };

type NotionDatabaseQueryResult = Widen<
  QueryDatabaseResponse['results'][number]
>;

type NotionDatabaseQueryPropertiesType = Extract<
  QueryDatabaseResponse['results'][number],
  { properties: any }
>;

export type NotionPageProperties = NonNullable<
  NotionDatabaseQueryPropertiesType['properties']
>;
export type NotionPagePropertiesValues = NotionPageProperties[string];

export type NotionPropertyType = NotionPagePropertiesValues['type'];

export type PartialUserObjectResponse = Extract<
  NotionPagePropertiesValues,
  { type: 'people' }
>['people'][number];

export type UserObjectResponse = Extract<
  PartialUserObjectResponse,
  { type: 'person' }
>;
