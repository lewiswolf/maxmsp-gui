// dependencies
import { useEffect, useRef, useState } from 'react'

// src
import style from '../scss/radiogroup.module.scss'
import RadioGroupSVG from '../svg/radiogroup-row.svg?react'

const RadioGroup: React.FC<{
	ariaLabel?: string
	items?: string[]
	spacing?: number
	setValue?: number
	onClick?: (i: number) => void
}> = ({
	ariaLabel = 'radiogroup',
	items = ['', ''],
	spacing = 20,
	setValue = 0,
	onClick = () => {
		/**/
	},
}) => {
	/*
		[radiogroup]
	*/

	const self = useRef<HTMLDivElement>(null)
	// which toggle is pressed - state and prop
	const [index, indexPressed] = useState<number>(setValue)
	useEffect(() => {
		indexPressed(setValue)
	}, [setValue])
	// click event with prop
	const togglePressed = (i: number): void => {
		i = i === index ? 0 : i
		indexPressed(i)
		onClick(i)
	}
	// which toggle is focused
	const [focus, indexFocused] = useState<number>(setValue)
	// focus method
	const toggleFocused = (i: number) => {
		indexFocused(i)
		if (self.current?.childNodes[i]) {
			const c = self.current.childNodes[i] as HTMLElement
			c.focus()
		}
	}
	// this useEffect adds a touch event listener used to prevent bubbling.
	useEffect(() => {
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable && self.current && e.targetTouches[0]) {
				e.preventDefault()
				let t: number | null = null
				for (let i = 0; i < self.current.childNodes.length; i++) {
					const b = (self.current.childNodes[i] as HTMLElement).getBoundingClientRect()
					if (e.targetTouches[0].clientY > b.top && e.targetTouches[0].clientY < b.bottom) {
						t = i + 1
						break
					}
				}
				if (t !== null) {
					togglePressed(t)
				}
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
		<div aria-label={ariaLabel} className={style.radiogroup} ref={self} role='radiogroup'>
			{items.map((item: string, i: number) => {
				i++
				return (
					<div
						aria-checked={i === index}
						aria-label={item ? item : `${ariaLabel} button ${i}`}
						key={i}
						role='radio'
						style={{ height: spacing > 16 ? `${spacing}px` : '16px' }}
						tabIndex={i === Math.max(index, 1) ? 0 : -1}
						onFocus={() => {
							indexFocused(i - 1)
						}}
						onKeyDown={(e) => {
							switch (e.key) {
								case 'Enter':
								case ' ':
									e.preventDefault()
									togglePressed(i)
									break
								case 'Up':
								case 'ArrowUp':
									e.preventDefault()
									toggleFocused(focus < 1 ? items.length - 1 : focus - 1)
									break
								case 'Down':
								case 'ArrowDown':
									e.preventDefault()
									toggleFocused((focus + 1) % items.length)
									break
								default:
									break
							}
						}}
						onMouseDown={(e) => {
							if (e.button === 0) {
								togglePressed(i)
							}
						}}
					>
						{item && (
							<p
								tabIndex={-1}
								style={{
									lineHeight: spacing > 16 ? `${spacing}px` : '16px',
									paddingRight: item ? '10px' : 0,
									outline: 0,
								}}
							>
								{item}
							</p>
						)}
						<div
							style={{
								background:
									i === index
										? 'radial-gradient(18px circle at center,#cee5e8 50%,#333333 50%)'
										: 'radial-gradient(18px circle at center,#595959 50%,#333333 50%)',
								outline: 0,
							}}
							tabIndex={-1}
						>
							<RadioGroupSVG />
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default RadioGroup
