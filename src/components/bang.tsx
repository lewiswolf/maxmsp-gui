// dependencies
import { useEffect, useRef, useState } from 'react'

// src
import style from '../scss/bang.module.scss'
import SVG from '../svg/bang.svg'

const Bang: React.FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	onClick?: () => any
}> = ({ ariaLabel = 'bang', ariaPressed = null, onClick = () => {} }) => {
	/*
		[bang]
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
			className={style.bang}
			ref={self}
			role='button'
			tabIndex={0}
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
			onMouseDown={(e) => {
				if (e.button === 0) {
					buttonPressed()
				}
			}}
			onTouchCancel={() => isMouseDown(false)}
			onTouchEnd={() => isMouseDown(false)}
		>
			<SVG
				style={{
					outline: 0,
					background: mousedown
						? 'radial-gradient(10px circle at center, #cee5e8 50%, #333333 50%)'
						: '#333333',
				}}
				tabIndex={-1}
			/>
		</div>
	)
}

export default Bang
