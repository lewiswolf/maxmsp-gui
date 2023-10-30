import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [cssInjectedByJsPlugin(), dts({ include: ['src'] }), react(), svgr()],
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
	},
})
