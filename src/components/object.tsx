// dependencies
import React from 'react'

// src
import SVG from '../svg/inlet.svg'
import style from '../scss/object.module.scss'

type Props = {
	inactive?: boolean
	text?: string
}

const Object: React.FC<Props> = ({ inactive = false, text = '' }): JSX.Element => {
	/* 
		[]
	*/

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

export default Object
