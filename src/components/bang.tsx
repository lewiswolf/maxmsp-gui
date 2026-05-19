// biome-ignore-all lint/a11y/useSemanticElements : <div> is used here to remain consistent with other exported components

// dependencies
import { type FC, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, useState } from 'react'

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
	onClick = (): void => {
		/* */
	},
}) => {
	/*
		[bang]
	*/

	// mousedown state
	const [mousedown, isMouseDown] = useState<boolean>(false)
	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (!mousedown) {
				isMouseDown(true)
				onClick()
			}
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if ((e.key === 'Enter' || e.key === ' ') && mousedown) {
			e.preventDefault()
			isMouseDown(false)
		}
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.button === 0) {
			isMouseDown(true)
			e.currentTarget.setPointerCapture(e.pointerId)
			onClick()
		}
	}
	const _onPointerUp = (e: ReactPointerEvent<HTMLDivElement>): void => {
		isMouseDown(false)
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId)
		}
	}
	const _onPointerCancel = (): void => {
		isMouseDown(false)
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
			<SVG data-state={mousedown ? 'mousedown' : 'default'} role='img' tabIndex={-1} />
		</div>
	)
}

export default Bang
