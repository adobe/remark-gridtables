/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-env mocha */
import assert from 'assert';
import remarkGfm from 'remark-gfm';
import { lstat, readFile } from 'fs/promises';
import stringify from 'remark-stringify';
import { unified } from 'unified';
import remark from 'remark-parse';
import remarkGridTable from '../src/index.js';

export function mdast2md(mdast) {
  return unified()
    .use(stringify, {
      strong: '*',
      emphasis: '_',
      bullet: '-',
      fence: '`',
      fences: true,
      incrementListMarker: true,
      rule: '-',
      ruleRepetition: 3,
      ruleSpaces: false,
      setext: false,
    })
    .use(remarkGridTable)
    .use(remarkGfm)
    .stringify(mdast);
}

export async function assertMD(mdast, fixture) {
  const expected = await readFile(new URL(`./fixtures/${fixture}`, import.meta.url), 'utf-8');
  const actual = mdast2md(mdast);
  assert.strictEqual(actual, expected);
  return actual;
}

export async function testMD(spec) {
  const source = await readFile(new URL(`./fixtures/${spec}.md`, import.meta.url), 'utf-8');

  const actual = unified()
    .use(remark)
    .use(remarkGridTable)
    .use(remarkGfm)
    .parse(source);

  // convert back. check if round-trip md exists
  try {
    await lstat(new URL(`./fixtures/${spec}.rt.md`, import.meta.url));
    // eslint-disable-next-line no-param-reassign
    spec += '.rt';
  } catch {
    // ignore
  }
  await assertMD(actual, `${spec}.md`);
}
