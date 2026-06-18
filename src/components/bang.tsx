// biome-ignore-all lint/a11y/useSemanticElements : <div> is used here to remain consistent with other exported components

// dependencies
import { type FC, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, useState } from 'react'

// src
import style from '../scss/bang.module.scss'
import SVG from '../svg/bang.svg?react'

// constexpr
const _defaultVoidFunction = (): void => {
	/* */
}

const Bang: FC<{
	ariaLabel?: string
	ariaPressed?: boolean | null
	onClick?: () => void
}> = ({ ariaLabel = 'bang', ariaPressed = null, onClick = _defaultVoidFunction }) => {
	/*
		[bang]
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
			className={style.bang}
			onKeyDown={_onKeyDown}
			onKeyUp={_onKeyUp}
			onPointerCancel={_onPointerCancel}
			onPointerDown={_onPointerDown}
			onPointerUp={_onPointerUp}
			role='button'
			tabIndex={0}
		>
			<SVG className={mouse_down ? style.mousedown : ''} role='img' tabIndex={-1} />
		</div>
	)
}

export default Bang
