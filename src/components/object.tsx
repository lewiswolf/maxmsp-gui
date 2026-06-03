// dependencies
import type { FC } from 'react'

// src
import SVG from '../svg/inlet.svg?react'
import style from '../scss/object.module.scss'

const object: FC<{
	inactive?: boolean
	text?: string
}> = ({ inactive = false, text = '' }) => (
	<div className={[style.object, inactive && style.inactive].filter(Boolean).join(' ')}>
		{!inactive && text && <SVG role='img' />}
		<p>{text}</p>
	</div>
)

export default object
