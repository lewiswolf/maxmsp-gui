// dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// src
import App from './App.jsx'
import './index.css'

const root = document.querySelector('#root')
if (root) {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}