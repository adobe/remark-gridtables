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
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { TYPE_TABLE, mdast2hastGridTablesHandler } from '@adobe/mdast-util-gridtables';
import rehypeFormat from 'rehype-format';
import remarkGridtables from '../src/index.js'; // use '@adobe/remark-gridtables' outside this repo.

const md = `
# Grid Table Test

+-------------------+------+
| Table Headings    | Here |
+--------+----------+------+
| Sub    | Headings | Too  |
+========+=================+
| cell   | column spanning |
| spans  +---------:+------+
| rows   |   normal | cell |
+---v----+:---------------:+
|        | cells can be    |
|        | *formatted*     |
|        | **paragraphs**  |
|        | \`\`\`             |
| multi  | and contain     |
| line   | blocks          |
| cells  | \`\`\`             |
+========+=========:+======+
| footer |    cells |      |
+--------+----------+------+
`;

async function main() {
  // eslint-disable-next-line no-unused-vars
  const file = await unified()
    .use(remarkParse)
    .use(remarkGridtables)
    .use(remarkRehype, {
      handlers: {
        [TYPE_TABLE]: mdast2hastGridTablesHandler(),
      },
    })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(md);

  // console.log(String(file));
}

main().catch(console.error);
