// dependencies
import React from 'react'
// src
import SVG from '../svg/inlet.svg'
import style from '../scss/object.module.scss'

interface Props {
	inactive?: boolean
	text?: string
}

export default function Object(
	props: Props = {
		inactive: false,
		text: '',
	}
): JSX.Element {
	/* */

	return (
		<div
			className={style.object}
			style={{
				background: props.inactive ? '#b49d7c' : '#808080',
			}}
		>
			{!props.inactive && <SVG />}
			<p style={{ background: props.inactive ? '#977e6d' : '#333333' }}>{props.text}</p>
		</div>
	)
}
