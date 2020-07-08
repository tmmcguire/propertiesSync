'use strict';

const fs = require('fs');

/**
 * Exception thrown by this module.
 */
class PropertiesError extends Error {
  constructor (msg) {
    super(msg);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PropertiesError);
    }
    this.name = 'PropertiesError';
  }
}

function getNextFragment(str) {
  let eol = str.search(/\r?\n/);
  let bol = eol + 1;
  if (eol === -1) {
    return [str, ''];
  } else {
    if (str.charAt(bol) === '\r') {
     bol += 1;
    }
    if (str.charAt(bol) === '\n') {
      bol += 1;
    }
    return [str.slice(0, eol), str.slice(bol)];
  }
}

function getNextLine(str) {
  let line = [];
  let [fragment, rest] = getNextFragment(str);
  while (fragment.charAt(fragment.length - 1) === '\\' && rest.length > 0) {
    line.push( fragment.substring(0, fragment.length - 1) );
    [fragment, rest] = getNextFragment(rest);
  }
  line.push(fragment);
  return [line.join(''), rest];
}

function recordProperty(dictionary, line) {
  line = line.replace(/[^\\]#.*/, '');
  line = line.replace(/\\#/g, '#');
  let idx = line.search(/[:=]/);
  if (idx === -1) { return }
  let elements = line.slice(0, idx).split('.');
  for (let element of elements.slice(0, -1)) {
    let elt = element.trim();
    if (!dictionary.hasOwnProperty(elt)) {
      dictionary[elt] = {};
    } else if (typeof dictionary[elt] !== 'object') {
      throw new PropertiesError(`duplicated key: ${elements.join('.')}`)
    }
    dictionary = dictionary[elt];
  }
  let element = elements[elements.length - 1].trim();
  if (dictionary.hasOwnProperty(element)) {
    throw new PropertiesError(`duplicated key: ${elements.join('.')}`)
  }
  dictionary[element] = line.slice(idx + 1).trim();
}

module.exports = {
  PropertiesError,

  readPropertiesSync: function(path) {
    if (fs.existsSync(path)) {
      let result = {};
      let data = fs.readFileSync(path, 'utf8');
      let [line, rest] = getNextLine(data);
      while (rest.length > 0) {
        recordProperty(result, line);
        [line, rest] = getNextLine(rest);
      }
      recordProperty(result, line);
      return result;
    } else {
      return undefined;
    }
  },

  mergeProperties: function mergeProperties(target, ...sources) {
    for (let source of sources) {
      for (let [key, value] of Object.entries(source)) {
        if (target.hasOwnProperty(key)) {
          if (typeof target[key] === 'object' && typeof value === 'object') {
            mergeProperties(target[key], value);
          } else {
            throw new PropertiesError(`duplicated key: ${key}`)
          }
        } else {
          target[key] = value;
        }
      }
    }
  }

};
