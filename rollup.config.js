import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import { default as svgr } from '@svgr/rollup'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

import pj from './package.json'

export default {
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
		peerDepsExternal(),
		resolve(),
		commonjs(),
		svgr(),
		typescript({
			declaration: true,
			declarationDir: 'dist',
		}),
		postcss(),
	],
}
