/* --------------------
 * @overlook/plugin-static-dir module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin');

// Imports
const pkg = require('../package.json');

// Exports

module.exports = new Plugin(
	pkg,
	{symbols: ['TEMP']},
	(Route, {TEMP}) => class StaticDirRoute extends Route { // eslint-disable-line no-unused-vars
	}
);
