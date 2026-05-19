// dependencies
import {
	type FC,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useState,
} from 'react'

// src
import style from '../scss/toggle.module.scss'
import SVG from '../svg/toggle.svg?react'

const Toggle: FC<{
	ariaLabel?: string
	setValue?: boolean
	onClick?: (b: boolean) => void
}> = ({
	ariaLabel = 'toggle',
	setValue = false,
	onClick = (): void => {
		/**/
	},
}) => {
	/*
		[toggle]
	*/

	// is the toggle pressed - state and prop
	const [pressed, isPressed] = useState<boolean>(setValue)
	useEffect((): void => {
		isPressed(setValue)
	}, [setValue])
	// keyboard event specific watch state
	const [keydown, isKeyDown] = useState<boolean>(false)
	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (!keydown) {
				isKeyDown(true)
				isPressed(!pressed)
				onClick(pressed)
			}
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if ((e.key === 'Enter' || e.key === ' ') && keydown) {
			e.preventDefault()
			isKeyDown(false)
		}
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.button === 0) {
			isPressed(!pressed)
			e.currentTarget.setPointerCapture(e.pointerId)
			onClick(pressed)
		}
	}
	const _onPointerUp = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId)
		}
	}

	return (
		<div
			aria-checked={pressed}
			aria-label={ariaLabel}
			className={style.toggle}
			onKeyDown={_onKeyDown}
			onKeyUp={_onKeyUp}
			onPointerDown={_onPointerDown}
			onPointerUp={_onPointerUp}
			role='switch'
			tabIndex={0}
		>
			<SVG role='img' tabIndex={-1} />
		</div>
	)
}

export default Toggle
