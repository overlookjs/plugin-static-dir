/* --------------------
 * @overlook/plugin-static-dir module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(staticDirPlugin) {
	describe('symbols', () => {
		it.each([
			'STATIC_FILES',
			'STATIC_DIR_PATH',
			'GET_STATIC_DIR_PATH',
			'STATIC_BUILD_PATH',
			'GET_STATIC_BUILD_PATH'
		])('%s', (key) => {
			expect(typeof staticDirPlugin[key]).toBe('symbol');
		});
	});
};
