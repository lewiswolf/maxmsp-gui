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

// constexpr
const _defaultVoidFunction = (): void => {
	/* */
}

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
	onChange = _defaultVoidFunction,
	onClick = _defaultVoidFunction,
}) => {
	/*
		[textbutton]
	*/

	const self = useRef<HTMLDivElement>(null)
	// is the toggle pressed - state and prop
	const [pressed, setPressed] = useState<boolean>(mode && setValue)
	useEffect((): void => {
		setPressed(mode && setValue)
	}, [mode, setValue])
	// button interactions
	const [hover, setHover] = useState<boolean>(false)
	const [mouse_down, setMouseDown] = useState<boolean>(false)
	// style methods
	const display_text = ((): string => {
		if (mode) {
			if (pressed) {
				if (mouse_down && hover) {
					return text
				}
				return toggleText
			}
			if (mouse_down && hover) {
				return toggleText
			}
		}
		return text
	})()

	const pressButton = (new_value: boolean): void => {
		// press button
		setPressed(new_value)
		onClick()
		if (mode) {
			onChange(new_value)
		}
	}

	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (!mouse_down) {
				setHover(true)
				setMouseDown(true)
			}
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if ((e.key === 'Enter' || e.key === ' ') && mouse_down) {
			e.preventDefault()
			setHover(false)
			setMouseDown(false)
			pressButton(mode && !pressed)
		}
	}
	const _onPointerCancel = (): void => {
		setHover(false)
		setMouseDown(false)
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.button === 0) {
			setHover(true)
			setMouseDown(true)
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
		setMouseDown(false)
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
			className={[
				style.textbutton,
				hover && style.hover,
				mouse_down && style.mousedown,
				pressed && style.pressed,
				mode && style.mode,
				inactive && style.inactive,
			]
				.filter(Boolean)
				.join(' ')}
			ref={self}
		>
			<p tabIndex={-1}>{display_text}</p>
		</div>
	)
}

export default TextButton
