/* --------------------
 * @overlook/plugin-static-dir module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	staticDirPlugin = require('@overlook/plugin-static-dir');

// Imports
const itExports = require('./exports.js');

// Tests

describe('CJS export', () => {
	it('is an instance of Plugin class', () => {
		expect(staticDirPlugin).toBeInstanceOf(Plugin);
	});

	describe('has properties', () => {
		itExports(staticDirPlugin);
	});
});
