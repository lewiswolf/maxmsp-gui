import react from '@vitejs/plugin-react'
// biome-ignore lint/correctness/noNodejsModules: This script is ran by NodeJS.
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		copyPublicDir: false,
		lib: {
			entry: resolve(import.meta.dirname, 'src/index.ts'),
			fileName: () => 'index.js',
			formats: ['es'],
		},
		rolldownOptions: {
			external: ['react', 'react/jsx-runtime'],
			output: {
				comments: {
					annotation: false,
					jsdoc: false,
					legal: false,
				},
			},
		},
		target: 'baseline-widely-available',
	},
	plugins: [
		cssInjectedByJsPlugin(),
		dts({
			entryRoot: 'src',
			include: ['src'],
		}),
		react(),
		svgr(),
	],
})
