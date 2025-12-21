import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/maxmsp-gui',
	build: { target: 'ESNext' },
	esbuild: { legalComments: 'none' },
	plugins: [
		compression({
			algorithms: ['gzip'],
			include: /\.(js|mjs|json|css|svg)$/i,
		}),
		react(),
	],
})
