[![NPM version](https://img.shields.io/npm/v/@overlook/plugin-static-dir.svg)](https://www.npmjs.com/package/@overlook/plugin-static-dir)
[![Build Status](https://img.shields.io/travis/overlookjs/plugin-static-dir/master.svg)](https://travis-ci.org/overlookjs/plugin-static-dir)
[![Dependency Status](https://img.shields.io/david/overlookjs/plugin-static-dir.svg)](https://david-dm.org/overlookjs/plugin-static-dir)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookjs/plugin-static-dir.svg)](https://david-dm.org/overlookjs/plugin-static-dir)
[![Coverage Status](https://img.shields.io/coveralls/overlookjs/plugin-static-dir/master.svg)](https://coveralls.io/r/overlookjs/plugin-static-dir)

# Overlook framework plugin to serve directory of static files

Part of the [Overlook framework](https://overlookjs.github.io/).

## Usage

Serve a directory of static files.

Use this plugin on a route and specify path to serve from with `[STATIC_DIR_PATH]` or `[GET_STATIC_DIR_PATH]()`.

```js
const Route = require('@overlook/route'),
  staticDirPlugin = require('@overlook/plugin-static-dir'),
  { STATIC_DIR_PATH } = staticDirPlugin;

const StaticDirRoute = Route.extend(staticDirPlugin);

const route = new StaticDirRoute( {
  [STATIC_DIR_PATH]: '/path/to/dir'
} );
```

### Options

#### Providing path to dir to serve

`[GET_STATIC_DIR_PATH]()` can alternatively be used to specify path to dir to serve files from.

```js
const { GET_STATIC_DIR_PATH } = require('@overlook/plugin-static-dir');

const route = new StaticDirRoute( {
  [GET_STATIC_DIR_PATH]() {
    return '/path/to/dir';
  }
} );
```

#### Build path

If you are building the app, you can customize the directory in build dir which static files get placed with `[STATIC_BUILD_PATH]` or `[GET_STATIC_BUILD_PATH]()`.

The default is `'static'`.

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookjs/plugin-static-dir/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookjs/plugin-static-dir/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
