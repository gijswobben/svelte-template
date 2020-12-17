import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import { scss as svelteScss, sass as svelteSass } from 'svelte-preprocess';
import sass from 'rollup-plugin-sass';
import scss from 'rollup-plugin-scss';

const production = !process.env.ROLLUP_WATCH;
const targetFolder = production ? 'dist' : 'public';

let copyTargets = [
	{ src: 'src/static/index.html', dest: targetFolder },
	{ src: 'src/static/favicon.*', dest: targetFolder },
	{ src: 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*', dest: targetFolder + '/webfonts'},
];

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: targetFolder + '/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: [
				svelteScss({
					prependData: '@import "src/styles/variables.scss";'
				}),
				svelteSass(),
			],
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
		}),

		scss({
			output: targetFolder + '/global.css',
		}),
		sass({
			// Filename to write all styles
			output: targetFolder + '/bundle.css',
		}),

		// Copy files from the static dir, as well as other requirements into their targets
		copy({
			targets: copyTargets
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
