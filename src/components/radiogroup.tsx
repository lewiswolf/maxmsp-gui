// biome-ignore-all lint/a11y/useSemanticElements : <div> is used instead of <input type=radio /> to have more control over styling and interaction
// biome-ignore-all lint/nursery/noInlineStyles : inline styling is here used to curate a dynamic composition
// biome-ignore-all lint/performance/noJsxPropsBind : here prop bindings are used alongside Aray.map()

// dependencies
import { type FC, type JSX, useEffect, useRef, useState } from 'react'

// src
import style from '../scss/radiogroup.module.scss'
import RadioGroupSVG from '../svg/radiogroup-row.svg?react'

// constexpr
const _defaultArray: string[] = ['', '']
const _defaultVoidFunction = (): void => {
	/* */
}

const RadioGroup: FC<{
	ariaLabel?: string
	items?: string[]
	spacing?: number
	setValue?: number
	onClick?: (i: number) => void
}> = ({ ariaLabel = 'radiogroup', items = _defaultArray, spacing = 20, setValue = 0, onClick = _defaultVoidFunction }) => {
	/*
		[radiogroup]
	*/

	const self = useRef<HTMLDivElement>(null)
	// which toggle is pressed - state and prop
	const [index_pressed, setIndexPressed] = useState<number>(setValue)
	useEffect((): void => {
		setIndexPressed(setValue)
	}, [setValue])
	// click event with prop
	const togglePressed = (i: number): void => {
		setIndexPressed(i === index_pressed ? 0 : i)
		onClick(i === index_pressed ? 0 : i)
	}
	// keyboard event specific watch state
	const [key_down, setKeyDown] = useState<boolean>(false)
	// which toggle is focused
	const [index_focused, setIndexFocused] = useState<number>(setValue)
	// focus method
	const toggleFocused = (i: number): void => {
		setIndexFocused(i)
		;(self.current?.childNodes[i] as HTMLElement).focus()
	}

	return (
		<div aria-label={ariaLabel} className={style.radiogroup} ref={self} role='radiogroup'>
			{items.map((item: string, i: number): JSX.Element => {
				const _i = i + 1
				return (
					<div
						aria-checked={_i === index_pressed}
						aria-label={item ? item : `${ariaLabel} button ${_i.toString()}`}
						key={_i.toString()}
						role='radio'
						style={{ height: spacing > 16 ? `${spacing.toString()}px` : '16px' }}
						tabIndex={_i === Math.max(index_pressed, 1) ? 0 : -1}
						onFocus={(): void => {
							setIndexFocused(i)
						}}
						onKeyDown={(e): void => {
							switch (e.key) {
								case 'Enter':
								case ' ': {
									e.preventDefault()
									if (!key_down) {
										setKeyDown(true)
										togglePressed(_i)
									}
									break
								}
								case 'Up':
								case 'ArrowUp': {
									e.preventDefault()
									toggleFocused(index_focused < 1 ? items.length - 1 : index_focused - 1)
									break
								}
								case 'Down':
								case 'ArrowDown': {
									e.preventDefault()
									toggleFocused((index_focused + 1) % items.length)
									break
								}
								default:
									break
							}
						}}
						onKeyUp={(e): void => {
							if ((e.key === 'Enter' || e.key === ' ') && key_down) {
								e.preventDefault()
								setKeyDown(false)
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
						<div className={_i === index_pressed ? style.clicked : ''} tabIndex={-1}>
							<RadioGroupSVG role='img' />
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default RadioGroup
