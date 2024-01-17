# Remark Gridtables

> Remark plugin to parse and serialize markdown gridtables.

## Status
[![codecov](https://img.shields.io/codecov/c/github/adobe/remark-gridtables.svg)](https://codecov.io/gh/adobe/remark-gridtables)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/adobe/remark-gridtables/main.yaml)
[![GitHub license](https://img.shields.io/github/license/adobe/remark-gridtables.svg)](https://github.com/adobe/remark-gridtables/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/remark-gridtables.svg)](https://github.com/adobe/remark-gridtables/issues)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## What is this?

This package is a [unified][] ([remark][]) plugin to enable the gridtables extensions.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**remark** adds support for markdown to unified.
**mdast** is the markdown AST that remark uses.
This is a remark plugin that transforms mdast.

## When should I use this?

This project is useful when you want to support parsing and serializing gridtables.

This plugin does not handle how markdown is turned to HTML.
That’s done by [`remark-rehype`][remark-rehype].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
$ npm install @adobe/remark-gridtables
```

## Usage

```js
import { unified } from 'unified';
import stringify from 'remark-stringify';
import remark from 'remark-parse';
import remarkGridTable from '@adobe/remark-gridtables';

// markdown -> mdast
const mdast = unified()
  .use(remark)
  .use(remarkGridTable)
  .parse(sourceMarkdown);


// mdast -> markdown
const outputMarkdown = unified()
  .use(stringify)
  .use(remarkGridTable)
  .stringify(mdast);
```

Also see the [test/example.js](./test/example.js) on how to generate HTML tables.

## Overview

GridTables look like this:

```
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
|        | ```             |
| multi  | and contain     |
| line   | blocks          |
| cells  | ```             |
+========+=========:+======+
| footer |    cells |      |
+--------+----------+------+
```

- the top of a cell must be indicated by `+-` followed by some `-` or `+` and finished by `-+`.
- if the table contains a footer but no header, the top row should use `=` as grid line.
- col spans are indicated by missing column (`|`) delimiters
- row spans are indicated by missing row (`-`) delimiters
- cells can be left, center, right, or justify aligned; indicated by the placement of `:` or `><`
- cells can be top, middle, or bottom v-aligned; indicated by the placement of arrows (`v` `^` `x`)
- the header and footer sections are delimited by section delimiters (`=`).
- if no section delimiters are present, all cells are placed in the table body.
- if only 1 section delimiter is present, it delimits header from body.
- the content in cells can be a full Markdown document again. note, that the cell boundaries (`|`)
  need to exactly match with the column markers (`+`) in the row delimiters, if the cell content
  contains `|`, otherwise the correct layout of the table can't be guaranteed.

Layout
======

The table layout tries to keep the table within a certain width (default 120). For example,
if the table has 3 columns, each column will be max 40 characters wide. If all text in a column
is smaller, it will shrink the columns. However, cells have a minimum width (default 10) when
text needs to be broken. If the cell contents need more space, e.g. with a nested table or
code block, it will grow accordingly.

Align
=====

Horizontal align is indicated by placing markers at the grid line above the cell:

```
Justify     Center     Left       Right
+>-----<+  +:-----:+  +:------+  +------:+
| A b C |  |  ABC  |  | ABC   |  |   ABC |
+-------+  +-------+  +-------+  +-------+
```

Vertical align is indicated by placing markers at the center of the grid line above the cell:

```
Top        Middle     Bottom
+---^---+  +---x---+  +---v---+
| Larum |  |       |  |       |
| Ipsum |  | Larum |  |       |
|       |  | Ipsum |  | Larum |
|       |  |       |  | Ipsum |
+-------+  +-------+  +-------+
```

## Syntax

```ebfn

gridTable := gridLine cellLine+ gridLine;
gridLine := gridCell+ "+";
cellLine := ( gridCell | cellContent )+ ( "+" | "|" );   
gridCell := "+" alignMarkerStart? ("-" | "=")+ vAlignMarker? ("-" | "=")* alignMarkerEnd?;
cellContent := ( "+" | "|" ) " " content " " ;
alignMarkerStart := ":" | ">";
alignMarkerEnd   := ":" | "<";
vAlignMarker     := "^" | "v" | "x"
```

## MDAST Syntax tree

The following interfaces are added to **[mdast][]** by this utility.

### Nodes

#### `GridTable`

```idl
interface GridTable <: Parent {
  type: "gridTable"
  children: [GridTableHeader|GridTableBody|GridTableFooter]
}
```

#### `GridTableHeader`

```idl
interface GridTableHeader <: Parent {
  type: "gtHead"
  children: [GridTableRow]
}
```

#### `GridTableBody`

```idl
interface GridTableBody <: Parent {
  type: "gtBody"
  children: [GridTableRow]
}
```

#### `GridTableFoot`

```idl
interface GridTableFooter <: Parent {
  type: "gtFoot"
  children: [GridTableRow]
}
```

#### `GridTableRow`

```idl
interface GridTableRow <: Parent {
  type: "gtRow"
  children: [GridTableCell]
}
```

#### `GridTableCell`

```idl
interface GridTableCell <: Parent {
  type: "gtCell"
  colSpan: number >= 1
  rowSpan: number >= 1
  align: alignType
  valign: valignType
  children: [MdastContent]
}
```

**GridTableCell** ([**Parent**][dfn-parent]) represents a header cell in a
[**GridTable**][dfn-table], if its parent is a [*gridTableHead*][term-head], or a data
cell otherwise.

**GridTableCell** can be used where [**gridTableRow**][dfn-row-content] content is expected.
Its content model is [**mdast**][dfn-phrasing-content] content, allowing full mdast documents.

### Enumeration

#### `alignType`

```idl
enum alignType {
  "left" | "right" | "center" | "justify" | null
}
```

#### `valignType`

```idl
enum alignType {
  "top" | "bottom" | "middle" | null
}
```

<!-- Definitions -->

[npm]: https://docs.npmjs.com/cli/install

[remark]: https://github.com/remarkjs/remark

[unified]: https://github.com/unifiedjs/unified

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast
