import eslint from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	reactHooks.configs['recommended-latest'],
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: ['**/dist/**', '**/unused/**'],
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
