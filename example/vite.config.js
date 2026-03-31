import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/maxmsp-gui',
	build: {
		rolldownOptions: {
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
		compression({
			algorithms: ['gzip'],
			include: /\.(?:js|map|mjs|json|css|svg)$/iu,
		}),
		react(),
	],
})
