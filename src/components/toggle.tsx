// dependencies
import { useEffect, useRef, useState } from 'react'

// src
import style from '../scss/toggle.module.scss'
import SVG from '../svg/toggle.svg?react'

const Toggle: React.FC<{
	ariaLabel?: string
	setValue?: boolean
	onClick?: (b: boolean) => void
}> = ({
	ariaLabel = 'toggle',
	setValue = false,
	onClick = () => {
		/**/
	},
}) => {
	/*
		[toggle]
	*/

	const self = useRef<HTMLDivElement>(null)
	// is the toggle pressed - state and prop
	const [pressed, isPressed] = useState<boolean>(setValue)
	useEffect(() => {
		isPressed(setValue)
	}, [setValue])
	// click event with prop
	const togglePressed = (): void => {
		isPressed(!pressed)
		onClick(pressed)
	}
	// this useEffect adds a touch event listener used to prevent bubbling.
	useEffect(() => {
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				togglePressed()
			}
		}
		if (self.current) {
			self.current.addEventListener('touchstart', touchstart)
		}
		const cleanup_self = self.current
		return () => {
			if (cleanup_self) {
				cleanup_self.removeEventListener('touchstart', touchstart)
			}
		}
	})

	return (
		<div
			aria-checked={pressed}
			aria-label={ariaLabel}
			className={style.toggle}
			ref={self}
			role='switch'
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					togglePressed()
				}
			}}
			onMouseDown={(e) => {
				if (e.button === 0) {
					togglePressed()
				}
			}}
		>
			<SVG
				style={{
					outline: 0,
					background: pressed ? 'radial-gradient(40px circle at center,#cee5e8 50%,#333333 50%)' : '#595959',
				}}
				tabIndex={-1}
			/>
		</div>
	)
}

export default Toggle
