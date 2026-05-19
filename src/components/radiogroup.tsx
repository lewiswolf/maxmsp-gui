// biome-ignore-all lint/a11y/useSemanticElements : <div> is used instead of <input type=radio /> to have more control over styling and interaction
// biome-ignore-all lint/nursery/noJsxPropsBind : here prop bindings are used alongside Aray.map()

// dependencies
import { type FC, type JSX, useEffect, useRef, useState } from 'react'

// src
import style from '../scss/radiogroup.module.scss'
import RadioGroupSVG from '../svg/radiogroup-row.svg?react'

const RadioGroup: FC<{
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
	onClick = (): void => {
		/**/
	},
}) => {
	/*
		[radiogroup]
	*/

	const self = useRef<HTMLDivElement>(null)
	// which toggle is pressed - state and prop
	const [index, indexPressed] = useState<number>(setValue)
	useEffect((): void => {
		indexPressed(setValue)
	}, [setValue])
	// click event with prop
	const togglePressed = (i: number): void => {
		indexPressed(i === index ? 0 : i)
		onClick(i === index ? 0 : i)
	}
	// keyboard event specific watch state
	const [keydown, isKeyDown] = useState<boolean>(false)
	// which toggle is focused
	const [focus, indexFocused] = useState<number>(setValue)
	// focus method
	const toggleFocused = (i: number): void => {
		indexFocused(i)
		;(self.current?.childNodes[i] as HTMLElement).focus()
	}

	return (
		<div aria-label={ariaLabel} className={style.radiogroup} ref={self} role='radiogroup'>
			{items.map((item: string, i: number): JSX.Element => {
				const _i = i + 1
				return (
					<div
						aria-checked={_i === index}
						aria-label={item ? item : `${ariaLabel} button ${_i.toString()}`}
						key={_i.toString()}
						role='radio'
						style={{ height: spacing > 16 ? `${spacing.toString()}px` : '16px' }}
						tabIndex={_i === Math.max(index, 1) ? 0 : -1}
						onFocus={(): void => {
							indexFocused(i)
						}}
						onKeyDown={(e): void => {
							switch (e.key) {
								case 'Enter':
								case ' ': {
									e.preventDefault()
									if (!keydown) {
										isKeyDown(true)
										togglePressed(_i)
									}
									break
								}
								case 'Up':
								case 'ArrowUp': {
									e.preventDefault()
									toggleFocused(focus < 1 ? items.length - 1 : focus - 1)
									break
								}
								case 'Down':
								case 'ArrowDown': {
									e.preventDefault()
									toggleFocused((focus + 1) % items.length)
									break
								}
								default:
									break
							}
						}}
						onKeyUp={(e): void => {
							if ((e.key === 'Enter' || e.key === ' ') && keydown) {
								e.preventDefault()
								isKeyDown(false)
							}
						}}
						onPointerDown={(e): void => {
							if (e.button === 0) {
								togglePressed(_i)
							}
						}}
					>
						{Boolean(item) && (
							<p
								style={{
									lineHeight: spacing > 16 ? `${spacing.toString()}px` : '16px',
									paddingRight: item ? '10px' : 0,
								}}
								tabIndex={-1}
							>
								{item}
							</p>
						)}
						<div
							style={{
								background:
									_i === index
										? 'radial-gradient(18px circle at center, rgb(206, 229, 232) 50%, rgb(51, 51, 51) 50%)'
										: 'radial-gradient(18px circle at center, rgb(89, 89, 89) 50%, rgb(51, 51, 51) 50%)',
							}}
							tabIndex={-1}
						>
							<RadioGroupSVG role='img' />
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default RadioGroup
