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
	const [clicked, isClicked] = useState<boolean>(false)

	const buttonPressed = (): void => {
		isClicked(true)
		onClick()
	}

	useEffect(() => {
		/*
			This useEffect is used to handle the event listeners when the component mounts and unmounts.
			The event listeners are a simple global mouse up, and touchstart that prevents bubbling.
		*/
		const buttonFreed = (): void => isClicked(false)
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				buttonPressed()
			}
		}
		// add and remove event listeners
		if (self.current !== null) {
			window.addEventListener('mouseup', buttonFreed)
			self.current.addEventListener('touchstart', touchstart)
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
					isClicked(false)
				}
			}}
			onTouchCancel={() => isClicked(false)}
			onTouchEnd={() => isClicked(false)}
		>
			<p
				style={{
					outline: 0,
					padding: clicked ? '6px 4px 4px 6px' : '5px 5px',
				}}
				tabIndex={-1}
			>
				{text}
			</p>
		</div>
	)
}

export default Message
