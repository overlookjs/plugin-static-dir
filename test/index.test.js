/* --------------------
 * @overlook/plugin-static-dir module
 * Tests
 * ------------------*/

'use strict';

// Modules
const pathJoin = require('path').join,
	{stat: statFile, readFile} = require('fs/promises'),
	Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	staticPlugin = require('@overlook/plugin-static'),
	axios = require('axios'),
	staticDirPlugin = require('@overlook/plugin-static-dir'),
	{STATIC_FILES, STATIC_DIR_PATH, STATIC_BUILD_PATH, GET_STATIC_DIR_PATH, File} = staticDirPlugin;

// Imports
const {startServer, stopServer, URL} = require('./support/server.js');

// Init
require('./support/index.js');

// Tests

const fixturesPath = pathJoin(__dirname, 'fixtures');
const FILE_PATHS = [
	'/file.txt',
	'/sub/file.html',
	'/sub/file.txt',
	'/sub/subSub/file.txt',
	'/sub2/file.txt'
];

const StaticDirRoute = Route.extend(staticDirPlugin);

describe('Plugin', () => {
	it('is an instance of Plugin class', () => {
		expect(staticDirPlugin).toBeInstanceOf(Plugin);
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		const StaticRoute = Route.extend(staticPlugin);
		expect(StaticDirRoute).toBeFunction();
		expect(StaticDirRoute).toBeDirectSubclassOf(StaticRoute);
		expect(StaticDirRoute).toBeSubclassOf(Route);
	});
});

describe('Functionality', () => {
	describe('[INIT_PROPS]', () => {
		it('defines [STATIC_FILES] as undefined', () => {
			const route = new StaticDirRoute();
			expect(route).toContainEntry([STATIC_FILES, undefined]);
		});

		it('defines [STATIC_DIR_PATH] as undefined', () => {
			const route = new StaticDirRoute();
			expect(route).toContainEntry([STATIC_DIR_PATH, undefined]);
		});

		it('defines [STATIC_BUILD_PATH] as undefined', () => {
			const route = new StaticDirRoute();
			expect(route).toContainEntry([STATIC_BUILD_PATH, undefined]);
		});
	});

	describe('.init', () => {
		it('defines [STATIC_DIR_PATH] based on [GET_STATIC_DIR_PATH]', async () => {
			class CustomRoute extends StaticDirRoute {
				[GET_STATIC_DIR_PATH]() { return fixturesPath; } // eslint-disable-line class-methods-use-this
			}
			const route = new CustomRoute();
			await route.init();

			expect(route[STATIC_DIR_PATH]).toBe(fixturesPath);
		});

		it('catalogs all files in directory and stores in `[STATIC_FILES]`', async () => {
			const route = new StaticDirRoute({[STATIC_DIR_PATH]: fixturesPath});
			await route.init();

			const files = route[STATIC_FILES];

			expect(files).toBeObject();
			expect(files).toContainAllKeys(FILE_PATHS);

			for (const path of FILE_PATHS) {
				const file = files[path];
				expect(file).toBeInstanceOf(File);
				expect(file.path).toBe(`${fixturesPath}${path}`);
			}
		});
	});

	describe('serves files', () => {
		beforeEach(async () => {
			const route = new StaticDirRoute({[STATIC_DIR_PATH]: fixturesPath});
			await route.init();
			await startServer(req => route.handle(req));
		});
		afterEach(stopServer);

		it.each(FILE_PATHS)('%s', async (path) => {
			const res = await axios(`${URL}${path}`);
			expect(res.status).toEqual(200);

			const filePath = pathJoin(fixturesPath, path);
			const content = await readFile(filePath, 'utf8');
			expect(res.data).toBe(content);

			const stat = await statFile(filePath);
			expect(res.headers['content-length']).toEqual(`${stat.size}`);
			expect(res.headers['content-type']).toEqual(
				path.slice(-5) === '.html'
					? 'text/html; charset=UTF-8'
					: 'text/plain; charset=UTF-8'
			);
			expect(res.headers.etag).toMatch(/^W\/"[0-9a-f]{1,2}-[0-9a-f]{11}"$/);
		});
	});
});
