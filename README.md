# Notion Database Parser (WIP) 

A schema and parser api for reading Notion Database Objects into custom typed objects.

## Install

**THIS LIBRARY IS A WORK IN PROGRESS AND  IS NOT PUBLISHED YET!**

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
```
2. Define your parser (how to translate notion property objects to simple types)
```ts
```
3. Parse data returned from notion database queries

## Type guards


## TODO:

- add tests
- add example usage
