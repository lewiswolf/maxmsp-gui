// biome-ignore-all lint/a11y/useSemanticElements : <div> is used here to remain consistent with other exported components

// dependencies
import { type FC, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, useState } from 'react'

// src
import style from '../scss/message.module.scss'

// constexpr
const _defaultVoidFunction = (): void => {
	/* */
}

const Message: FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	text?: string
	onClick?: () => void
}> = ({ ariaLabel = 'message', ariaPressed = null, text = '', onClick = _defaultVoidFunction }) => {
	/*
		[message]
	*/

	// mousedown state
	const [mouse_down, setMouseDown] = useState<boolean>(false)
	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (!mouse_down) {
				setMouseDown(true)
				onClick()
			}
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if ((e.key === 'Enter' || e.key === ' ') && mouse_down) {
			e.preventDefault()
			setMouseDown(false)
		}
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.button === 0) {
			setMouseDown(true)
			e.currentTarget.setPointerCapture(e.pointerId)
			onClick()
		}
	}
	const _onPointerUp = (e: ReactPointerEvent<HTMLDivElement>): void => {
		setMouseDown(false)
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId)
		}
	}
	const _onPointerCancel = (): void => {
		setMouseDown(false)
	}

	return (
		<div
			aria-label={ariaLabel}
			{...(ariaPressed !== null && {
				'aria-pressed': ariaPressed,
			})}
			className={style.message}
			onKeyDown={_onKeyDown}
			onKeyUp={_onKeyUp}
			onPointerCancel={_onPointerCancel}
			onPointerDown={_onPointerDown}
			onPointerUp={_onPointerUp}
			role='button'
			tabIndex={0}
		>
			<p className={mouse_down ? style.mousedown : ''} tabIndex={-1}>
				{text}
			</p>
		</div>
	)
}

export default Message
