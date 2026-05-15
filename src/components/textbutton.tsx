// biome-ignore-all lint/style/noNestedTernary : if it ain't broke don't fix it
/* eslint-disable no-nested-ternary */

// dependencies
import {
	type FC,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useRef,
	useState,
} from 'react'

// src
import style from '../scss/textbutton.module.scss'

const TextButton: FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	inactive?: boolean
	mode?: boolean
	setValue?: boolean
	text?: string
	toggleText?: string
	onChange?: (b: boolean) => void
	onClick?: () => void
}> = ({
	ariaLabel = 'textbutton',
	ariaPressed = null,
	inactive = false,
	mode = false,
	setValue = false,
	text = 'Button',
	toggleText = 'Button On',
	onChange = (): void => {
		/**/
	},
	onClick = (): void => {
		/**/
	},
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
		clicked: 'rgb(150 170 172)',
		inactive: 'rgb(175 186 187)',
		neutral: 'rgb(206 229 232)',
		toggleOff: 'rgb(128 128 128)',
		toggleOffClicked: 'rgb(108 108 108)',
		toggleOffInactive: 'rgb(135 135 135)',
	}
	const BackgroundGradients: {
		hover: string
		inactive: string
		neutral: string
	} = {
		hover: 'linear-gradient(to top, rgb(51 51 51) 0%, rgb(81 81 81) 100%)',
		inactive: 'linear-gradient(to top, rgb(138 138 138) 0%, rgb(151 151 151) 100%)',
		neutral: 'linear-gradient(to top, rgb(51 51 51) 0%, rgb(76 76 76) 100%)',
	}

	// is the toggle pressed - state and prop
	const [pressed, isPressed] = useState<boolean>(mode && setValue)
	useEffect((): void => {
		isPressed(mode && setValue)
	}, [mode, setValue])
	// button interactions
	const [hover, setHover] = useState<boolean>(false)
	const [mousedown, setMousedown] = useState<boolean>(false)
	// style methods
	const display_text = ((): string => {
		if (mode) {
			if (pressed) {
				if (mousedown && hover) {
					return text
				}
				return toggleText
			}
			if (mousedown && hover) {
				return toggleText
			}
		}
		return text
	})()

	const pressButton = (new_value: boolean): void => {
		// press button
		isPressed(new_value)
		onClick()
		if (mode) {
			onChange(new_value)
		}
	}

	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (!mousedown) {
				setHover(true)
				setMousedown(true)
			}
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if ((e.key === 'Enter' || e.key === ' ') && mousedown) {
			e.preventDefault()
			setHover(false)
			setMousedown(false)
			pressButton(mode && !pressed)
		}
	}
	const _onPointerCancel = (): void => {
		setHover(false)
		setMousedown(false)
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.button === 0) {
			setHover(true)
			setMousedown(true)
		}
	}
	const _onPointerEnter = (): void => {
		setHover(true)
	}
	const _onPointerLeave = (): void => {
		setHover(false)
	}
	const _onPointerUp = (): void => {
		setHover(false)
		setMousedown(false)
		pressButton(mode && !pressed)
	}

	return (
		<div
			{...(mode &&
				!inactive && {
					'aria-checked': pressed,
				})}
			{...(!(mode || inactive) &&
				ariaPressed !== null && {
					'aria-pressed': ariaPressed,
				})}
			{...(!inactive && {
				'aria-label': ariaLabel,
				onKeyDown: _onKeyDown,
				onKeyUp: _onKeyUp,
				onPointerCancel: _onPointerCancel,
				onPointerDown: _onPointerDown,
				onPointerEnter: _onPointerEnter,
				onPointerLeave: _onPointerLeave,
				onPointerUp: _onPointerUp,
				role: mode ? 'switch' : 'button',
				tabIndex: 0,
			})}
			className={style.textbutton}
			ref={self}
			style={{
				background: inactive
					? BackgroundGradients.inactive
					: hover
						? BackgroundGradients.hover
						: BackgroundGradients.neutral,
			}}
		>
			<p
				style={{
					color: inactive
						? pressed
							? TextColours.inactive
							: mode
								? TextColours.toggleOffInactive
								: TextColours.inactive
						: mousedown && hover
							? pressed
								? mode
									? TextColours.toggleOffClicked
									: TextColours.clicked
								: TextColours.clicked
							: pressed
								? TextColours.neutral
								: mode
									? TextColours.toggleOff
									: TextColours.neutral,
				}}
				tabIndex={-1}
			>
				{display_text}
			</p>
		</div>
	)
}

export default TextButton
