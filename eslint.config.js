import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: ['**/dist/**', '**/unused/**'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			'react-hooks': reactHooks,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		extends: [tseslint.configs.disableTypeChecked],
	},
)
