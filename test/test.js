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

let props2 = properties.readPropertiesSync(path.join(__dirname, 'test2.prop'));

properties.mergeProperties(props, props2);

assert.deepStrictEqual(props, {
  a: {
    b: {
      c: 'd',
      n: 'o',
    },
    z: 'y',
  },
  e: 'f',
  g: 'h.i',
  j: 'k.l.m',
  x: 'w',
});

assert.throws(() => { properties.mergeProperties(props, { e: 'g' }); }, new properties.PropertiesError('duplicated key: e'));
