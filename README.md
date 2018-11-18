# propertiesSync

## NAME

propertiesSync - Synchronous parsing and manipulating .properties files

## SYNOPSIS

    const properties = require('propertiesSync');
    let props = properties.readPropertiesSync('config.properties');

    let aB = props.a.b;
    let c = props.c;

    let props2 = properties.readPropertiesSync('config2.properties');
    properties.mergeProperties(props, props2);

## DESCRIPTION

This module provides two functions:

* Read .properties files using Node.js' synchronous filesystem
  interface. Since the files are read synchronously, an application's
  configuration will be available immediately.

* Merge two objects, allowing configuration objects to be combined.

### readPropertiesSync

*_module_.readPropertiesSync(path): Object*

Read a file identified by *path*, producing an object.

A properties file consists, roughly, of lines, each consisting of a key
and a value. The result of reading a file is an object mapping keys to
values. If the key is made up of segments joined by periods, the key is
broken into sub-keys, i.e. namespaces, each mapping to a sub-object.

For example, the properties file:

    a.b.c = 1
    a.b.d = 0
    a.e = 2

is read into the object structure:

    {
      a: {
        b: {
          c: "1",
          d: "0",
        },
        e: "2",
      }
    }

If the file does not exist, *undefined* is returned.

If the file contains conflicting structure, an error is thrown. An
example of such conflicts:

    a.b.c = 1
    a.b = 2

In this example, a.b is both an object and the value "2".

### mergeProperties

*_module_.mergeProperties(target, source,...)*

Recursively merge the source objects onto the target object. A target
object must be specified and will be modified, and one or more source
objects.

For example, given the two properties files:

    a.b.c = 1
    a.b.d = 2

    x.y.z = "potato"
    r = "elbow"

the result of merging the two objects will be:

    {
      a: {
        b: {
          c: "1",
          d: "2",
        },
      },
      x: {
        z: "potato",
      },
      r: "elbow",
    }

## SYNTAX

A properties file consists of logical lines. Each logical line is made
of:

* A comment, beginning with '#' and continuing until the end of the
  line. The comment character can be escaped by a backslash ("\#") to
  include it in a key or value.

* A key/value pair consisting of a key ending at the first ':' or '='
  character, followed by a value. Keys are broken at periods ('.'),
  to create namespaces.

Multiple physical lines can be combined into a single logical line by
escaping the terminating newline with a backslash ('\').

## SEE ALSO

* Alternative project: [node-properties](https://github.com/gagle/node-properties).

* The [.properties file format](https://docs.oracle.com/cd/E23095_01/Platform.93/ATGProgGuide/html/s0204propertiesfileformat01.html). (This module does not completely implement that format.)

* [.properties](https://en.wikipedia.org/wiki/.properties) at Wikipedia.
