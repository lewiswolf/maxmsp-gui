// dependencies
import { type FC, useEffect, useRef, useState } from 'react'

// src
import style from '../scss/bang.module.scss'
import SVG from '../svg/bang.svg?react'

const Bang: FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	onClick?: () => void
}> = ({
	ariaLabel = 'bang',
	ariaPressed = null,
	onClick = () => {
		/* */
	},
}) => {
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
		const buttonFreed = (): void => {
			isMouseDown(false)
		}
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				isMouseDown(true)
				onClick()
			}
		}
		if (self.current) {
			window.addEventListener('mouseup', buttonFreed)
			self.current.addEventListener('touchstart', touchstart)
		}
		const cleanup_self = self.current
		return () => {
			if (cleanup_self) {
				cleanup_self.removeEventListener('touchstart', touchstart)
				window.removeEventListener('mouseup', buttonFreed)
			}
		}
	}, [onClick])

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
				if ((e.key === 'Enter' || e.key === ' ') && !mousedown) {
					e.preventDefault()
					buttonPressed()
				}
			}}
			onKeyUp={(e) => {
				if ((e.key === 'Enter' || e.key === ' ') && mousedown) {
					e.preventDefault()
					isMouseDown(false)
				}
			}}
			onMouseDown={(e) => {
				if (e.button === 0) {
					buttonPressed()
				}
			}}
			onTouchCancel={() => {
				isMouseDown(false)
			}}
			onTouchEnd={() => {
				isMouseDown(false)
			}}
		>
			<SVG
				style={{
					background: mousedown ? 'radial-gradient(10px circle at center, #cee5e8 50%, #333333 50%)' : '#333333',
				}}
				tabIndex={-1}
			/>
		</div>
	)
}

export default Bang
