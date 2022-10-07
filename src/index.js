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
import { gridTablesFromMarkdown, gridTablesToMarkdown } from '@adobe/mdast-util-gridtables';
import { gridTables } from '@adobe/micromark-extension-gridtables';

export default function remarkGridtables(options = {}) {
  const data = this.data();

  function add(field, value) {
    /* c8 ignore next 2 */
    if (data[field]) {
      data[field].push(value);
    } else {
      data[field] = [value];
    }
  }

  const opts = {
    processor: this,
    ...options,
  };

  add('micromarkExtensions', gridTables);
  add('fromMarkdownExtensions', gridTablesFromMarkdown(opts));
  add('toMarkdownExtensions', gridTablesToMarkdown(options));
}
