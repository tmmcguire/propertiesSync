'use strict';

const fs = require('fs');

function getNextFragment(str) {
  let idx = str.search(/\r?\n/);
  if (idx === -1) {
    return [str, ''];
  } else {
    return [str.slice(0, idx), str.slice(idx + 1)];
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
      throw 'duplicated key: ' + elt;
    }
    dictionary = dictionary[elt];
  }
  let element = elements[elements.length - 1].trim();
  if (dictionary.hasOwnProperty(element)) {
    throw 'duplicated key: ' + element;
  }
  dictionary[element] = line.slice(idx + 1).trim();
}

module.exports = {

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
            throw 'duplicated key: ' + key;
          }
        } else {
          target[key] = value;
        }
      }
    }
  }

};
