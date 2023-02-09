import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { default as svgr } from '@svgr/rollup'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

import pj from './package.json' assert { type: 'json' }

export default {
	external: Object.keys(pj.peerDependencies),
	input: './src/index.ts',
	output: [
		{
			file: pj.main,
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: pj.module,
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [
		resolve({
			moduleDirectories: ['node_modules'],
		}),
		commonjs(),
		svgr(),
		typescript({
			declaration: true,
			outDir: 'dist',
		}),
		postcss(),
	],
}
