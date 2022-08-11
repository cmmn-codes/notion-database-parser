#!/usr/bin/env node
import { writeFileSync } from 'fs';
import * as path from 'path';
import { URL } from 'url';

const dirname = new URL('.', import.meta.url).pathname;

writeFileSync(
  path.resolve(dirname, '../dist/cjs/package.json'),
  JSON.stringify({ type: 'commonjs' })
);
