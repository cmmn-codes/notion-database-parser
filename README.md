# Notion Database Parser (WIP)

A schema and parser api for reading Notion Database Objects into custom typed objects.

## Install

**THIS LIBRARY IS A WORK IN PROGRESS AND IS NOT PUBLISHED YET!**

```shell
npm install --save 'notion-database-parser'
```

### Dependencies

* `@notionhq/client`: "^1.0.4"

Note that this library is not intended for use with Notion SDK v2.
Notion removed the ability to retrieve page properties which makes it prohibitively difficult to query databases.
See: https://github.com/makenotion/notion-sdk-js/issues/334

Until this issues is resolved this library will not be updated to support `@notionhq/client@2`.

## Why

Notion databases have complex data types. Sometimes you want all the detail,
but at other times you just want the data from the table as a simple object.

This library gives you the tools to write simple and reusable parsers which
can translate notion's database properties into an expected and typed object.
It will report errors if the properties do not match the expected structure.

## Usage

1. Define your database schema (what data do you want)

```ts
import { SchemaBuilder, ParserBuilder, isFullUser } from 'notion-database-parser';

const schema = SchemaBuilder.create()
  .addProperty('task', 'Task', 'title')
  .addProperty('date', 'Date', 'date')
  .addProperty('people', 'Person', 'multi_select')
  .addProperty('hours', 'Hours', 'number')
  .addProperty('rate', 'Rate', 'number')
  .addProperty('category', 'Category', 'select')
  .build();
```

2. Define your parser (how to translate notion property objects to simple types)

Use the default parsers:

```ts
const parser = ParserBuilder.create().build(schema)
```

Or Add overrides for specific notion property types.

```ts
const parser = ParserBuilder.create()
  .addParserForType('number', v => v.number || 0)
  .addParserForType('people', v => {
    return v.people.map(person => (isFullUser(person) ? person.name : ''));
  })
  .build(schema);
```

3. Parse data returned from notion database queries

```ts
const res = await notion.databases.query({
  database_id: this.databaseId,
  filter: { ... },
});
const data = parser.parseQueryDatabaseResponse(res);
```
The return type of the parser is inferred from the Schema and return types of the parser functions.
In this example `data` will be an array of objects typed:
```ts
type Data = {
  task: string;
  data: Date | null;
  people: string[];
  hours: number;
  rate: number,
  category: string | []
}
```

## Type guards

Exposes two helpful type guards.

* `isFullUser()` - refines `PartialUserObjectResponse` to `UserObjectResponse`.
* `isFullDatabaseObject()` - refines result objects from `QueryDatabaseResponse` to full objects.

## TODO:

- add tests
