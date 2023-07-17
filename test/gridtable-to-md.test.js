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
import {
  code, blockquote, heading, image, paragraph, root, text, inlineCode, tableCell, tableRow,
  list as originalList, listItem as originalListItem, strong, emphasis,
} from 'mdast-builder';
import { assertMD } from './utils.js';

import imageReferences from './mdast-image-references.js';

const LARUM_L = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rhoncus elit nibh, sed vestibulum metus tincidunt a.';
const LARUM_M = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const TEST_M = '0 1 2 3 4 5 6 7 8 9 0 a b c d e f 0 1 2 3 4 5 6 7 8 9 0 a b c d e f';

const LARUM_MD = [
  text('Lorem ipsum dolor '),
  strong(text('sit amet')),
  text(', consectetur adipiscing elit. Vivamus rhoncus elit nibh, sed vestibulum metus tincidunt a. '),
  emphasis(text('Integer')),
  text(' interdum tempus consectetur. Phasellus tristique auctor tortor, tincidunt semper odio blandit eu. Proin et aliquet est. Curabitur ac augue ornare, iaculis sem luctus, feugiat tellus.'),
];

const CODE = `for (const row of this.rows) {
  for (let i = 0; i < row.length; i += 1) {
    let col = cols[i];
    if (!col) {
      col = {};
      cols.push(col);
    }
    const cell = row[i];
    if (cell.value) {
      col.size = Math.max(col.size || 0, cell.value.length);
    }
  }
}`;

function brk() {
  return {
    type: 'break',
  };
}

function gtCell(children, align, verticalAlign, rowSpan, colSpan) {
  const node = tableCell(children);
  if (align) {
    node.align = align;
  }
  if (verticalAlign) {
    node.valign = verticalAlign;
  }
  if (rowSpan) {
    node.rowSpan = rowSpan;
  }
  if (colSpan) {
    node.colSpan = colSpan;
  }
  node.type = 'gtCell';
  return node;
}

function gridTable(children) {
  const node = blockquote(children);
  node.type = 'gridTable';
  return node;
}

function gtHeader(children) {
  const node = blockquote(children);
  node.type = 'gtHeader';
  return node;
}

function gtBody(children) {
  const node = blockquote(children);
  node.type = 'gtBody';
  return node;
}

function gtFooter(children) {
  const node = blockquote(children);
  node.type = 'gtFooter';
  return node;
}

function gtRow(children) {
  const node = tableRow(children);
  node.type = 'gtRow';
  return node;
}

function listItem(kids) {
  const li = originalListItem(kids);
  li.spread = false;
  return li;
}

function list(ordered, kids) {
  const li = originalList(ordered, kids);
  li.spread = false;
  return li;
}

describe('gridtable to md', () => {
  it('one cell table', async () => {
    const mdast = root([
      heading(2, text('Single Cell Grid Table')),
      gridTable([
        gtCell(text('A1')),
      ]),
      heading(2, text('Empty cell')),
      gridTable([
        gtCell(text('')),
      ]),
      heading(2, text('Empty cell with align')),
      gridTable([
        gtCell(text(''), 'center', 'middle'),
      ]),
    ]);
    await assertMD(mdast, 'gt-single-cell.md');
  });

  it('simple correct table', async () => {
    const mdast = root([
      heading(2, text('Simple Grid Table')),
      gridTable([
        gtHeader([
          gtRow([
            gtCell(text('A1')),
            gtCell(text('B1')),
            gtCell(text('C1')),
          ]),
        ]),
        gtBody([
          gtRow([
            gtCell(text('a2')),
            gtCell([
              // test trimming cell content
              paragraph(text('')),
              paragraph(text('b2')),
              paragraph(text('')),
            ]),
            gtCell(text('c2')),
          ]),
          gtRow([
            gtCell(text('a3')),
            gtCell(text('b3')),
            gtCell(text('c3')),
          ]),
        ]),
        gtFooter([
          gtRow([
            gtCell(text('af')),
            gtCell(text('bf')),
            gtCell(text('cf')),
          ]),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-simple.md');
  });

  it('footer but no header table', async () => {
    const mdast = root([
      heading(2, text('Grid Table no header')),
      gridTable([
        gtBody([
          gtRow([
            gtCell(text('a2')),
            gtCell(text('b2')),
            gtCell(text('c2')),
          ]),
          gtRow([
            gtCell(text('a3')),
            gtCell(text('b3')),
            gtCell(text('c3')),
          ]),
        ]),
        gtFooter([
          gtRow([
            gtCell(text('af')),
            gtCell(text('bf')),
            gtCell(text('cf')),
          ]),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-footer-no-header.md');
  });

  it('header but no footer table', async () => {
    const mdast = root([
      heading(2, text('Grid Table no footer')),
      gridTable([
        gtHeader([
          gtRow([
            gtCell(text('A1')),
            gtCell(text('B1')),
            gtCell(text('C1')),
          ]),
        ]),
        gtBody([
          gtRow([
            gtCell(text('a2')),
            gtCell(text('b2')),
            gtCell(text('c2')),
          ]),
          gtRow([
            gtCell(text('a3')),
            gtCell(text('b3')),
            gtCell(text('c3')),
          ]),
        ]),
      ]),
      heading(2, text('Grid Table only header')),
      gridTable([
        gtHeader([
          gtRow([
            gtCell(text('A1')),
            gtCell(text('B1')),
            gtCell(text('C1')),
          ]),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-header-no-footer.md');
  });

  it('simple table large and mixed content', async () => {
    const mdast = root([
      heading(2, text('Large Grid Table')),
      gridTable([
        gtHeader([
          gtRow([
            gtCell(text('A1')),
            gtCell(text('B1')),
            gtCell(heading(2, text(LARUM_M))),
          ]),
        ]),
        gtBody([
          gtRow([
            gtCell([
              heading(2, text('My Heading 1')),
              paragraph([
                image('https://hlx.blob.core.windows.net/external/19c0cf25413106c81920d75078ee2ef30a55d52e7'),
                brk(),
                ...LARUM_MD,
                brk(),
                text(TEST_M),
              ]),
            ]),
            gtCell(code('js', CODE)),
            gtCell([
              blockquote([
                paragraph(text('My quote')),
                paragraph(text(LARUM_L)),
              ]),
              list(false, [
                listItem(text('item one')),
                listItem(text('item two')),
                listItem(text(LARUM_L)),
              ]),
            ]),
          ]),
          gtRow([
            gtCell(text('a3')),
            gtCell(text('b3')),
            gtCell(paragraph([strong(text('30 Years.')), text(' That\'s a lot.')])),
          ]),
        ]),
      ]),
    ]);
    // sanitizeTextAndFormats(mdast);
    await assertMD(mdast, 'gt-large.md');
  });

  it('table spans converts correctly', async () => {
    function cell(children, rowSpan, colSpan) {
      const node = gtCell(children);
      if (rowSpan) {
        node.rowSpan = rowSpan;
      }
      if (colSpan) {
        node.colSpan = colSpan;
      }
      return node;
    }

    const mdast = root([
      heading(2, text('Table with spans')),
      gridTable([
        gtRow([
          cell(text(`AB0 - ${LARUM_M}`), 0, 2),
          cell(text('C0')),
        ]),
        gtRow([
          cell(text('A1')),
          cell(text('B1')),
          cell(text('C1')),
        ]),
        gtRow([
          cell(text('A2')),
          cell(text('BC2'), 0, 2),
        ]),
        gtRow([
          cell(text('A3')),
          cell([
            heading(1, text('B34')),
            list('ordered', [
              listItem(text('item one')),
              listItem(text('item two')),
              listItem(text('item three')),
              listItem(text('item four')),
              listItem(text(LARUM_L)),
            ]),
          ], 2),
          cell(text('C3')),
        ]),
        gtRow([
          cell([
            heading(1, text('A4')),
            text(LARUM_M),
          ]),
          cell(text('C4')),
        ]),
        gtRow([
          cell(text('A567'), 3, 1),
          cell(text('BC5'), 1, 2),
        ]),
        gtRow([
          cell(text('B6')),
          cell(text('C678'), 3, 1),
        ]),
        gtRow([
          cell(text('B7'), 1, 1),
        ]),
        gtRow([
          cell(text('AB8'), 1, 2),
        ]),
      ]),
      heading(2, text('Table with overlapping spans')),
      gridTable([
        gtRow([
          cell(text('A1234'), 4, 1),
          cell(text('B1')),
          cell(text('CD1'), 1, 2),
        ]),
        gtRow([
          cell(text('BC23'), 2, 2),
          cell(text('D2')),
        ]),
        gtRow([
          cell(text('D34'), 2, 1),
        ]),
        gtRow([
          cell(text('B4')),
          cell(text('C4')),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-spans.md');
  });

  it('table alignments converts correctly', async () => {
    const mdast = root([
      heading(2, text('Table with alignments')),
      gridTable([
        gtHeader([
          gtRow([
            gtCell(text('top left'), 'left', 'top'),
            gtCell(text('top center'), 'center', 'top'),
            gtCell(text('top justify'), 'justify', 'top'),
            gtCell(text('top right'), 'right', 'top'),
            gtCell(paragraph([text('1'), brk(), text('2'), brk(), text('3')])),
          ]),
        ]),
        gtBody([
          gtRow([
            gtCell(text('middle left'), 'left', 'middle'),
            gtCell(text('middle center'), 'center', 'middle'),
            gtCell(text('top justify'), 'justify', 'middle'),
            gtCell(text('middle right'), 'right', 'middle'),
            gtCell(paragraph([text('1'), brk(), text('2'), brk(), text('3')])),
          ]),
          gtRow([
            gtCell(text('bottom left'), 'left', 'bottom'),
            gtCell(text('bottom center'), 'center', 'bottom'),
            gtCell(text('top justify'), 'justify', 'bottom'),
            gtCell(text('bottom right'), 'right', 'bottom'),
            gtCell(paragraph([text('1'), brk(), text('2'), brk(), text('3')])),
          ]),
          gtRow([
            gtCell(text('middle center'), 'center', 'middle', 1, 4),
          ]),
          gtRow([
            gtCell(text('top left'), 'left', 'top', 1, 2),
            gtCell(text('bottom right'), 'right', 'bottom', 1, 2),
          ]),
          gtRow([
            gtCell(text('middle justify'), 'justify', 'middle', 1, 4),
          ]),
        ]),
      ]),
      heading(2, text('Super small table with align')),
      gridTable([
        gtCell(text('A'), 'justify', 'middle'),
      ]),
    ]);
    await assertMD(mdast, 'gt-with-align.md');
  });

  it('tables in tables in tables', async () => {
    const innerTable = gridTable([
      gtHeader([
        gtRow([
          gtCell(text('A0')),
          gtCell(text('B0')),
        ]),
      ]),
      gtBody([
        gtRow([
          gtCell(text('A1')),
          gtCell(text('B1')),
        ]),
        gtRow([
          gtCell(text('some text with a | in it')),
          gtCell(text('| or at the beginning')),
        ]),
        gtRow([
          gtCell(paragraph([
            text('or some in code: '),
            inlineCode('a + b = c'),
            text('.'),
          ]), '', '', 1, 2),
        ]),
      ]),
    ]);

    const nestedTable = gridTable([
      gtHeader([
        gtRow([
          gtCell(text('nested tables are fun!'), '', '', 1, 2),
        ]),
      ]),
      gtBody([
        gtRow([
          gtCell(text('r0')),
          gtCell(innerTable, '', '', 3),
        ]),
        gtRow([
          gtCell(text('r1')),
        ]),
        gtRow([
          gtCell(text('r2')),
        ]),
      ]),
    ]);

    const mdast = root([
      heading(2, text('Tables in tables in tables')),
      gridTable([
        gtHeader([
          gtRow([
            gtCell(text('Cards (one, two, many)'), '', '', 1, 2),
          ]),
        ]),
        gtBody([
          gtRow([
            gtCell(text('One')),
            gtCell(innerTable),
          ]),
          gtRow([
            gtCell(text('two')),
            gtCell(text('three')),
          ]),
          gtRow([
            gtCell(innerTable, '', '', 1, 2),
          ]),
          gtRow([
            gtCell(text('four')),
            gtCell(text('five')),
          ]),
          gtRow([
            gtCell(text('nested')),
            gtCell(nestedTable),
          ]),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-tables-in-tables.md');
  });

  it('table with delimiters in code', async () => {
    const mdast = root([
      heading(2, text('Table with delimiters in code')),
      gridTable([
        gtRow([
          gtCell(inlineCode('a + b = c')),
        ]),
        gtRow([
          gtCell(code('js', 'a + b = c;\nif (a || b) {\n  throw Error();\n}')),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-code-with-delim.md');
  });

  it('unbalanced tables', async () => {
    const mdast = root([
      heading(2, text('Table with larger colspan')),
      gridTable([
        gtRow([
          gtCell(text('ABC0 (colspan=3)'), '', '', 1, 3),
        ]),
        gtRow([
          gtCell(text('A1')),
          gtCell(text('B1')),
        ]),
        gtRow([
          gtCell(text('A2')),
          gtCell(text('B2')),
        ]),
      ]),
      heading(2, text('Table with unbalanced rows')),
      gridTable([
        gtRow([
          gtCell(text('ABC0 (colspan=3)'), '', '', 1, 3),
        ]),
        gtRow([
          gtCell(text('A1')),
          gtCell(text('B1')),
        ]),
        gtRow([
          gtCell(text('A2')),
          gtCell(text('B2')),
        ]),
        gtRow([
          gtCell(text('A3')),
          gtCell(text('B3')),
          gtCell(text('C3')),
        ]),
        gtRow([
          gtCell(text('A4')),
          gtCell(text('B4')),
        ]),
        gtRow([
          gtCell(text('A5')),
          gtCell(text('B5')),
          gtCell(text('C5')),
          gtCell(text('D5')),
        ]),
        gtRow([
          gtCell(text('A6')),
          gtCell(text('B6')),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-unbalanced.md');
  });

  it('non break space', async () => {
    const mdast = root([
      heading(2, text('Table with non break space')),
      gridTable([
        gtRow([
          gtCell(text('A1')),
          gtCell(text('B1')),
        ]),
        gtRow([
          gtCell(text('A2')),
          gtCell(text('B2 2022 2022 2022 2022 2022 2022 2022 2022 2022 2022 2022 2022 2022 2022')),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-nbsp.md');
  });

  it('text with breaks', async () => {
    const p = paragraph([
      text('“People use these things for their own needs,” says Rivas of stock imagery.\n'
        + '“If they are using things that were not co-created in a process that was not\n'
        + 'intentional, especially when it comes to Indigenous imagery, then we are\n'
        + 'using something that does not really belong to us.”'),
      brk(),
      brk(),
      text('Adobe Stock Senior Director, Content, Sarah Casillas echoes Rivas’ sentiments.'),
    ]);

    const mdast = root([
      heading(2, text('Text with breaks')),
      p,
      gridTable([
        gtRow([
          gtCell(text('Left')),
          gtCell(text('Right')),
        ]),
        gtRow([
          gtCell(p, '', '', '', 2),
        ]),
        gtRow([
          gtCell(text('Test with trailing <br>')),
          gtCell([
            heading(2, text('Educational environments')),
            list('unordered', [
              listItem(text('Aerial images of college campuses and towns; landscape of surrounding areas.')),
              listItem(paragraph([
                text('Specialized fields of study with contextual cues: law, medicine, technology, social sciences'),
                brk(),
              ])),
            ]),
          ]),
        ]),
        gtRow([
          gtCell(text('Test with multiple <br>s')),
          gtCell([
            paragraph([
              text('Specialized fields of study with contextual cues: law, medicine, technology, social sciences'),
              brk(),
              brk(),
              brk(),
            ]),
          ]),
        ]),
        gtRow([
          gtCell(text('Test with non-lf escape')),
          gtCell([
            paragraph([
              text('Specialized fields of study with contextual cues: law, medicine, technology, social sciences\\'),
            ]),
          ]),
        ]),
        gtRow([
          gtCell(text('Test with a single break')),
          gtCell([
            paragraph([
              brk(),
            ]),
          ]),
        ]),
        gtRow([
          gtCell(text('Test with a break after image')),
          gtCell([
            paragraph([
              image('https://dummyimage.com/300'),
              brk(),
            ]),
          ]),
        ]),
        gtRow([
          gtCell(text('Test with image with newline in alt text')),
          gtCell(paragraph(image('about:blank', '', 'hello \nalt text.'))),
        ]),
        gtRow([
          gtCell(text('Test with image with newline in title text')),
          gtCell(paragraph(image('about:blank', 'hello \ntitle'))),
        ]),
      ]),
    ]);
    imageReferences(mdast);
    await assertMD(mdast, 'gt-with-breaks.md');
  });

  it('table with escaped tilde', async () => {
    const mdast = root([
      heading(2, text('escaped tilde')),
      paragraph(text('my ~home')),
      gridTable([
        gtBody([
          gtRow([
            gtCell(text('Column 1')),
          ]),
          gtRow([
            gtCell(paragraph([
              text('On OS X:'),
              brk(),
              text('1. Open the Finder'),
              brk(),
              text('2. under the Go menu, select "Go To Folder"'),
              brk(),
              text('3. in the window that opens, type: ~/Library/Logs/CreativeCloud/CoreSync/'),
            ])),
          ]),
        ]),
      ]),
    ]);
    await assertMD(mdast, 'gt-escape-tilde.md');
  });
});
