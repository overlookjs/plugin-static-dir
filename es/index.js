/* --------------------
 * @overlook/plugin-static-dir module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import staticDirPlugin from '../lib/index.js';

export default staticDirPlugin;
export const {
	TEMP
} = staticDirPlugin;
