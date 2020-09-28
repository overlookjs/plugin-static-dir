/* --------------------
 * @overlook/plugin-static-dir module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const pathSep = require('path').sep,
	Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE} = require('@overlook/route'),
	{PRE_BUILD, BUILD_FILE, deleteRouteProperties} = require('@overlook/plugin-build'),
	{HANDLE_ROUTE} = require('@overlook/plugin-match'),
	{PATH} = require('@overlook/plugin-request'),
	staticPlugin = require('@overlook/plugin-static'),
	readDir = require('recursive-readdir'),
	assert = require('simple-invariant'),
	{isFullString} = require('is-it-type');

// Imports
const pkg = require('../package.json');

// Constants
const DEFAULT_BUILD_PATH = 'static';

// Exports

module.exports = new Plugin(
	pkg,
	[staticPlugin],
	{
		symbols: [
			'STATIC_FILES', 'STATIC_DIR_PATH', 'GET_STATIC_DIR_PATH',
			'STATIC_BUILD_PATH', 'GET_STATIC_BUILD_PATH'
		]
	},
	(Route, {
		STATIC_FILES, STATIC_DIR_PATH, GET_STATIC_DIR_PATH, STATIC_BUILD_PATH, GET_STATIC_BUILD_PATH,
		RESPOND_WITH_FILE, File
	}) => {
		// Extend `[HANDLE_ROUTE]()` if defined, otherwise extend `handle()`
		const handleRouteMethodName = Route.prototype[HANDLE_ROUTE] ? HANDLE_ROUTE : 'handle';

		return class StaticDirRoute extends Route {
			/**
			 * Init props used by plugin.
			 * @param {Object} props - Props
			 */
			[INIT_PROPS](props) {
				super[INIT_PROPS](props);
				this[STATIC_FILES] = undefined;
				this[STATIC_DIR_PATH] = undefined;
				this[STATIC_BUILD_PATH] = undefined;
			}

			/**
			 * Determine path of directory to serve and catalog files in dir.
			 */
			async [INIT_ROUTE]() {
				await super[INIT_ROUTE]();

				// Get dir path
				let dirPath = this[STATIC_DIR_PATH];
				if (dirPath != null) {
					assert(
						isFullString(dirPath), `[STATIC_DIR_PATH] must be a string if provided - received ${dirPath}`
					);
				} else if (dirPath === undefined) {
					dirPath = this[GET_STATIC_DIR_PATH]();
					assert(
						dirPath == null || isFullString(dirPath),
						`[GET_STATIC_DIR_PATH]() must return a path string or null/undefined - returned ${dirPath}`
					);
					if (!dirPath) return;
					this[STATIC_DIR_PATH] = dirPath;
				}

				// Remove trailing slash
				dirPath = stripTrailingSlash(dirPath);
				this[STATIC_DIR_PATH] = dirPath;

				// Catalog files in dir
				const filePaths = await readDir(dirPath);

				const staticFiles = Object.create(null);
				this[STATIC_FILES] = staticFiles;
				const dirPathLen = dirPath.length;
				for (const filePath of filePaths) {
					let servePath = filePath.slice(dirPathLen);
					if (pathSep === '\\') servePath = servePath.replace(/\\/g, '/');
					staticFiles[servePath] = new File(filePath);
				}
			}

			/**
			 * Serve file in response to request.
			 * Uses `@overlook/plugin-static`'s `[RESPOND_WITH_FILE]` method.
			 * @param {Object} req - Request object
			 * @returns {Promise<undefined>}
			 */
			[handleRouteMethodName](req) {
				// Delegate to superiors
				const res = super[handleRouteMethodName](req);
				if (res !== undefined) return res;

				// Locate file to be served
				const file = this[STATIC_FILES][req[PATH]];
				if (!file) return undefined;

				// Serve file
				return this[RESPOND_WITH_FILE](req, file);
			}

			[GET_STATIC_DIR_PATH]() { // eslint-disable-line class-methods-use-this
				return undefined;
			}

			[GET_STATIC_BUILD_PATH]() { // eslint-disable-line class-methods-use-this
				return undefined;
			}

			async [PRE_BUILD]() {
				if (super[PRE_BUILD]) await super[PRE_BUILD]();

				// Determine build path prefix
				let buildPath = this[STATIC_BUILD_PATH];
				if (buildPath != null) {
					assert(
						isFullString(buildPath),
						`[STATIC_BUILD_PATH] must be a string if provided - received ${buildPath}`
					);
				} else {
					buildPath = this[GET_STATIC_BUILD_PATH]();
					assert(
						buildPath == null || isFullString(buildPath),
						`[GET_STATIC_BUILD_PATH]() must return a path string or null/undefined - returned ${buildPath}`
					);
				}

				if (!buildPath) {
					buildPath = DEFAULT_BUILD_PATH;
				} else {
					buildPath = stripTrailingSlash(buildPath);
				}

				// Add all files to build
				assert(
					this[BUILD_FILE], 'Static dir routes must use `@overlook/plugin-build` if app is being built'
				);
				for (const [path, file] of Object.entries(this[STATIC_FILES])) {
					this[BUILD_FILE](file, `${buildPath}${path}`);
				}

				// Delete properties not needed at runtime
				deleteRouteProperties(this, [
					STATIC_DIR_PATH, GET_STATIC_DIR_PATH, STATIC_BUILD_PATH, GET_STATIC_DIR_PATH
				]);
			}
		};
	}
);

function stripTrailingSlash(path) {
	const lastChar = path.slice(-1);
	if (lastChar === '/' || lastChar === '\\') return path.slice(0, -1);
	return path;
}
