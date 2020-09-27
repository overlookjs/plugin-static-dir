/* --------------------
 * @overlook/plugin-static-dir module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Plugin from '@overlook/plugin';
import staticDirPlugin, * as namedExports from '@overlook/plugin-static-dir/es';

// Imports
import itExports from './exports.js';

// Tests

describe('ESM export', () => {
	it('default export is an instance of Plugin class', () => {
		expect(staticDirPlugin).toBeInstanceOf(Plugin);
	});

	describe('default export has properties', () => {
		itExports(staticDirPlugin);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});
