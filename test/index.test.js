/* --------------------
 * @overlook/plugin-static-dir module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	staticDirPlugin = require('@overlook/plugin-static-dir');

// Init
require('./support/index.js');

// Tests

describe('Plugin', () => {
	it('is an instance of Plugin class', () => {
		expect(staticDirPlugin).toBeInstanceOf(Plugin);
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		const StaticDirRoute = Route.extend(staticDirPlugin);
		expect(StaticDirRoute).toBeFunction();
		expect(StaticDirRoute).toBeDirectSubclassOf(Route);
	});
});
