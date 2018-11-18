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

### mergeProperties

*_module_.mergeProperties(target, source,...)*

Recursively merge the source objects onto the target object.
