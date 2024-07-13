import react from '@vitejs/plugin-react-swc'
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
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es'],
		},
		minify: 'esbuild',
		rollupOptions: {
			external: ['react', 'react/jsx-runtime'],
			output: { entryFileNames: '[name].js', manualChunks: undefined },
		},
		target: 'ESNext',
	},
	esbuild: { legalComments: 'none' },
	plugins: [cssInjectedByJsPlugin(), dts({ include: ['src'] }), react(), svgr()],
})
