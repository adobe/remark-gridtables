/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import globals from 'globals';
import header from './plugins/header/index.cjs';

import bestPractices from './rules/best-practices.js';
import errors from './rules/errors.js';
import es6 from './rules/es6.js';
import node from './rules/node.js';
import strict from './rules/strict.js';
import style from './rules/style.js';
import variables from './rules/variables.js';

const common = {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.node,
      ...globals.es6,
      '__rootdir': true,
    },
  },
  plugins: {
    header,
  },
  rules: {
    ...bestPractices.rules,
    ...errors.rules,
    ...es6.rules,
    ...node.rules,
    ...strict.rules,
    ...style.rules,
    ...variables.rules,

    strict: 0,

    'import/prefer-default-export': 0,

    // Forbid multiple statements in one line
    'max-statements-per-line': ['error', { max: 1 }],

    // Allow for-of loops
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

    // Allow return before else & redundant else statements
    'no-else-return': 'off',

    // allow dangling underscores for 'fields'
    'no-underscore-dangle': ['error', {
      allowAfterThis: true,
    }],

    // allow '_' as a throw-away variable
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_$',
      varsIgnorePattern: '^_$',
    }],

    'no-shadow': ['error', {
      allow: ['_'],
    }],

    // don't enforce extension rules
    // 'import/extensions': [2, 'ignorePackages'],

    // enforce license header
    'header/header': [2, 'block', ['',
      { pattern: ' * Copyright \\d{4} Adobe\\. All rights reserved\\.', template: ' * Copyright 2024 Adobe. All rights reserved.' },
      ' * This file is licensed to you under the Apache License, Version 2.0 (the "License");',
      ' * you may not use this file except in compliance with the License. You may obtain a copy',
      ' * of the License at http://www.apache.org/licenses/LICENSE-2.0',
      ' *',
      ' * Unless required by applicable law or agreed to in writing, software distributed under',
      ' * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS',
      ' * OF ANY KIND, either express or implied. See the License for the specific language',
      ' * governing permissions and limitations under the License.',
      ' ',
    ]],

    'id-match': ['error', '^(?!.*?([wW][hH][iI][tT][eE]|[bB][lL][aA][cC][kK]).*[lL][iI][sS][tT]).*$', {
      properties: true,
    }],
  },
  files: ['*.js'],
  linterOptions: {
    reportUnusedDisableDirectives: 'off',
  },
};

const source = {
  ...common,
  files: ['src/*.js', 'src/**/*.js', 'test/dev/*.mjs'],
};

const test = {
  ...common,
  languageOptions: {
    globals: {
      ...common.languageOptions.globals,
      ...globals.mocha,
      '__testdir': true,
    },
  },
  files: ['test/*.js', 'test/**/*.js'],
};

export default [
  {
    ...source,
  },
  {
    ...test,
  }
];
