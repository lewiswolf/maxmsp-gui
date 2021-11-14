// dependencies
import React from 'react'
// src
import SVG from '../svg/inlet.svg'
import style from '../scss/object.module.scss'

interface Props {
	inactive?: boolean
	text?: string
}

export default function Object(props: Props): JSX.Element {
	/* */

	const { inactive = false, text = '' } = props
	return (
		<div
			className={style.object}
			style={{
				background: inactive ? '#b49d7c' : '#808080',
			}}
		>
			{!inactive && <SVG />}
			<p style={{ background: inactive ? '#977e6d' : '#333333' }}>{text}</p>
		</div>
	)
}
