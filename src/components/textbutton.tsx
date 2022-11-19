// dependencies
import { useEffect, useRef, useState } from 'react'

// src
import style from '../scss/textbutton.module.scss'

const TextButton: React.FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	inactive?: boolean
	mode?: boolean
	setValue?: boolean
	text?: string
	toggleText?: string
	onChange?: (b: boolean) => {}
	onClick?: () => {}
}> = ({
	ariaLabel = 'textbutton',
	ariaPressed = null,
	inactive = false,
	mode = false,
	setValue = false,
	text = 'Button',
	toggleText = 'Button On',
	onChange = () => {},
	onClick = () => {},
}) => {
	/*
		[textbutton]
	*/

	const self = useRef<HTMLDivElement>(null)

	// declare button colours
	const TextColours: {
		clicked: string
		inactive: string
		neutral: string
		toggleOff: string
		toggleOffClicked: string
		toggleOffInactive: string
	} = {
		clicked: '#96aaac',
		inactive: '#afbabb',
		neutral: '#cee5e8',
		toggleOff: '#808080',
		toggleOffClicked: '#6c6c6c',
		toggleOffInactive: '#878787',
	}
	const BackgroundGradients: {
		neutral: string
		hover: string
		inactive: string
	} = {
		neutral: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)',
		hover: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(81, 81, 81) 100%)',
		inactive: 'linear-gradient(to top, rgb(138, 138, 138) 0%, rgb(151, 151, 151) 100%)',
	}

	// is the toggle pressed - state and prop
	const [pressed, isPressed] = useState<boolean>(mode && setValue)
	useEffect(() => pressButton(mode && setValue), [mode, setValue])
	// button interactions
	const [hover, setHover] = useState<boolean>(false)
	const [mousedown, setMousedown] = useState<boolean>(false)
	const [externalMousedown, setExternalMousedown] = useState<boolean>(false)

	const pressButton = (new_value: boolean): void => {
		// press button
		if (!inactive) {
			isPressed(new_value)
			onClick()
			mode && onChange(new_value)
		}
	}

	// this useEffect adds a touch event listener used to prevent bubbling.
	// also add global mouse up and down listeners for cosmetic updates.
	useEffect(() => {
		const globalMousedown = (e: MouseEvent) => {
			if (!inactive && self.current) {
				const rect = self.current.getBoundingClientRect()
				if (
					e.clientX > rect.left &&
					e.clientX < rect.right &&
					e.clientY > rect.top &&
					e.clientY < rect.bottom
				) {
					setMousedown(true)
				} else {
					setExternalMousedown(true)
				}
			}
		}

		const globalMouseup = () => {
			setExternalMousedown(false)
			setMousedown(false)
		}

		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable && !inactive) {
				e.preventDefault()
				setHover(true)
				setMousedown(true)
			}
		}

		if (self.current !== null) {
			self.current.addEventListener('touchstart', touchstart)
		}
		window.addEventListener('mousedown', globalMousedown)
		window.addEventListener('mouseup', globalMouseup)
		return () => {
			if (self.current !== null) {
				self.current.removeEventListener('touchstart', touchstart)
			}
			window.removeEventListener('mousedown', globalMousedown)
			window.removeEventListener('mouseup', globalMouseup)
		}
	})

	return (
		<div
			className={style.textbutton}
			{...(!mode &&
				!inactive &&
				ariaPressed !== null && {
					'aria-pressed': ariaPressed,
				})}
			{...(mode &&
				!inactive && {
					'aria-checked': pressed,
				})}
			{...(!inactive && {
				onKeyDown: (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						setHover(true)
						setMousedown(true)
					}
				},
				onKeyUp: (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						setHover(false)
						setMousedown(false)
						pressButton(mode && !pressed)
					}
				},
				'aria-label': ariaLabel,
				role: mode ? 'switch' : 'button',
				tabIndex: 0,
			})}
			onClick={() => pressButton(mode && !pressed)}
			onMouseEnter={() => !inactive && setHover(true)}
			onMouseLeave={() => !inactive && setHover(false)}
			onTouchEnd={() => {
				setHover(false)
				setMousedown(false)
				pressButton(mode && !pressed)
			}}
			onTouchCancel={() => {
				setHover(false)
				setMousedown(false)
			}}
			ref={self}
			style={{
				background: !inactive
					? hover && !externalMousedown
						? BackgroundGradients.hover
						: BackgroundGradients.neutral
					: BackgroundGradients.inactive,
			}}
		>
			<p
				tabIndex={-1}
				style={{
					outline: 0,
					color: !inactive
						? mousedown && hover
							? pressed
								? mode
									? TextColours.toggleOffClicked
									: TextColours.clicked
								: TextColours.clicked
							: pressed
							? TextColours.neutral
							: mode
							? TextColours.toggleOff
							: TextColours.neutral
						: pressed
						? TextColours.inactive
						: mode
						? TextColours.toggleOffInactive
						: TextColours.inactive,
				}}
			>
				{mode
					? pressed
						? mousedown && hover
							? text
							: toggleText
						: mousedown && hover
						? toggleText
						: text
					: text}
			</p>
		</div>
	)
}

export default TextButton
