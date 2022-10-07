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
import { testMD } from './utils.js';

describe('gridtable from markdown', () => {
  it('test no tables', async () => {
    await testMD('gt-no-tables');
  });

  it('test wrong tables', async () => {
    await testMD('gt-double-divider');
  });

  it('simple table', async () => {
    await testMD('gt-simple');
  });

  it('single-cell table', async () => {
    await testMD('gt-single-cell');
  });

  it('large table', async () => {
    await testMD('gt-large');
  });

  it('footer no header table', async () => {
    await testMD('gt-footer-no-header');
  });

  it('header no footer table', async () => {
    await testMD('gt-header-no-footer');
  });

  it('table with spans', async () => {
    await testMD('gt-spans');
  });

  it('table in tables', async () => {
    await testMD('gt-tables-in-tables');
  });

  it('table with align', async () => {
    await testMD('gt-with-align');
  });

  it('table with divider in content', async () => {
    await testMD('gt-divider-in-content');
  });

  it('text with breaks', async () => {
    await testMD('gt-with-breaks');
  });
});
