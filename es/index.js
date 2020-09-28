/* --------------------
 * @overlook/plugin-static-dir module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import staticDirPlugin from '../lib/index.js';

export default staticDirPlugin;
export const {
	STATIC_FILES,
	STATIC_DIR_PATH,
	GET_STATIC_DIR_PATH,
	STATIC_BUILD_PATH,
	GET_STATIC_BUILD_PATH
} = staticDirPlugin;
