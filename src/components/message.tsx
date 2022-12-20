// dependencies
import { useEffect, useRef, useState } from 'react'

// src
import style from '../scss/message.module.scss'

const Message: React.FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	text?: string
	onClick?: () => any
}> = ({ ariaPressed = null, ariaLabel = 'message', text = '', onClick = () => {} }) => {
	/*
		[message]
	*/

	const self = useRef<HTMLDivElement>(null)
	// click event with prop
	const buttonPressed = (): void => {
		isMouseDown(true)
		onClick()
	}
	// mousedown state
	const [mousedown, isMouseDown] = useState<boolean>(false)
	// this useEffect adds a global mouse up to allow for press and hover,
	// and a touchstart event used to prevent event bubbling.
	useEffect(() => {
		const buttonFreed = (): void => isMouseDown(false)
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				buttonPressed()
			}
		}
		if (self.current !== null) {
			window.addEventListener('mouseup', buttonFreed)
			self.current.addEventListener('touchstart', touchstart, { passive: true })
		}
		return () => {
			if (self.current !== null) {
				self.current.removeEventListener('touchstart', touchstart)
				window.removeEventListener('mouseup', buttonFreed)
			}
		}
	}, [])

	return (
		<div
			aria-label={ariaLabel}
			{...(ariaPressed !== null && {
				'aria-pressed': ariaPressed,
			})}
			className={style.message}
			ref={self}
			role='button'
			tabIndex={0}
			onMouseDown={(e) => {
				if (e.button === 0) {
					buttonPressed()
				}
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					buttonPressed()
				}
			}}
			onKeyUp={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					isMouseDown(false)
				}
			}}
			onTouchCancel={() => isMouseDown(false)}
			onTouchEnd={() => isMouseDown(false)}
		>
			<p
				style={{
					outline: 0,
					padding: mousedown ? '6px 4px 4px 6px' : '5px 5px',
				}}
				tabIndex={-1}
			>
				{text}
			</p>
		</div>
	)
}

export default Message
