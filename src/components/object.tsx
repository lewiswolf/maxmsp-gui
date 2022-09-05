// src
import SVG from '../svg/inlet.svg'
import style from '../scss/object.module.scss'

const object: React.FC<{
	inactive?: boolean
	text?: string
}> = ({ inactive = false, text = '' }) => {
	/* 
		[]
	*/

	return (
		<div className={style.object} style={{ background: inactive ? '#b49d7c' : '#808080' }}>
			{!inactive && text && <SVG />}
			<p style={{ background: inactive ? '#977e6d' : '#333333' }}>{text}</p>
		</div>
	)
}

export default object