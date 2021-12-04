// dependencies
import React from 'react'

// src
import style from '../scss/bang.module.scss'
import SVG from '../svg/bang.svg'

type Props = {
	ariaLabel?: string
	ariaPressed?: boolean | null
	onClick?: () => any
}

const Bang: React.FC<Props> = ({
	ariaLabel = 'bang',
	ariaPressed = null,
	onClick = () => {},
}): JSX.Element => {
	/*
		[bang].
	*/

	const self = React.useRef<HTMLDivElement>(null)
	const [clicked, isClicked] = React.useState<boolean>(false)

	const buttonPressed = (): void => {
		isClicked(true)
		onClick()
	}

	React.useEffect(() => {
		/*
			This useEffect is used to handle the event listeners when the component mounts and unmounts.
			The event listeners are a simple global mouse up, and touchstart that prevents bubbling.
		*/
		const buttonFreed = (): void => isClicked(false)
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				buttonPressed()
			}
		}
		// add and remove event listeners
		if (self.current !== null) {
			window.addEventListener('mouseup', buttonFreed)
			self.current.addEventListener('touchstart', touchstart)
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
					isClicked(false)
				}
			}}
			onMouseDown={(e) => {
				if (e.button === 0) {
					buttonPressed()
				}
			}}
			onTouchCancel={() => isClicked(false)}
			onTouchEnd={() => isClicked(false)}
		>
			<SVG
				style={{
					outline: 0,
					background: clicked
						? 'radial-gradient(10px circle at center, #cee5e8 50%, #333333 50%)'
						: '#333333',
				}}
				tabIndex={-1}
			/>
		</div>
	)
}

export default Bang
