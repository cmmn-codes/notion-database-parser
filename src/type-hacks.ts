import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.js';

export type PartialDatabaseResult = QueryDatabaseResponse['results'][number];

export type DatabaseResult = Extract<
  PartialDatabaseResult,
  { properties: any }
>;

export type NotionPageProperties = DatabaseResult['properties'];
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
