import eslint from '@eslint/js'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: ['**/dist/**'],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			ecmaVersion: 'latest',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'react-refresh': reactRefresh,
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
