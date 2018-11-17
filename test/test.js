'use strict';

const assert = require('assert');
const path = require('path');

const properties = require('../index.js');

let props = properties.readPropertiesSync(path.join(__dirname, 'test.prop'));

assert.deepStrictEqual(props, {
  a: {
    b: {
      c: 'd',
      n: 'o',
    },
  },
  e: 'f',
  g: 'h.i',
  j: 'k.l.m',
});
