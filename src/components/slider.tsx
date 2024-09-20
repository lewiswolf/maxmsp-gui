// dependencies
import { type FC, type TouchEvent as ReactTouchEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// src
import style from '../scss/slider.module.scss'

const Slider: FC<{
	ariaLabel?: string
	setValue?: number
	width?: number
	onChange?: (x: number) => void
}> = ({
	ariaLabel = 'slider',
	setValue = 0,
	width = 200,
	onChange = () => {
		/**/
	},
}) => {
	/*
		[slider]
	*/

	const fidelity = 10000
	const self = useRef<HTMLDivElement>(null)

	// decalre slider colors
	const SliderColors = useMemo<{
		positive: string
		negative: string
		off: string
	}>(() => {
		return {
			positive: '#cee5e8',
			negative: '#595959',
			off: '#818d8f',
		}
	}, [])

	// declare slider colour update function
	const colourAndState = useCallback(
		(new_value: number): void => {
			if (new_value !== 0) {
				if (self.current) {
					const sliderWidth = self.current.getBoundingClientRect().width - 10
					const position = ((sliderWidth - 6) * new_value) / fidelity
					setBackground(`linear-gradient(90deg,
					${SliderColors.negative}, 
					${SliderColors.negative} 0px, 
					${SliderColors.positive} 0px, 
					${SliderColors.positive} ${(position - 1).toString()}px, 
					${SliderColors.negative} ${(position - 1).toString()}px,
					${SliderColors.negative} ${position.toString()}px,
					${SliderColors.positive} ${position.toString()}px,
					${SliderColors.positive} ${(position + 6).toString()}px,
					${SliderColors.negative} ${(position + 6).toString()}px
					)`)
					updateValue(new_value)
				}
			} else {
				setBackground(
					`linear-gradient(90deg, ${SliderColors.off}, ${SliderColors.off} 6px, ${SliderColors.negative} 6px)`,
				)
				updateValue(0)
			}
		},
		[SliderColors],
	)

	// what is the value - state and prop
	const [value, updateValue] = useState<number>(Math.max(Math.min(setValue, 1), 0) * fidelity)
	useEffect(() => {
		colourAndState(Math.max(Math.min(setValue, 1), 0) * fidelity)
	}, [setValue, colourAndState])

	// background gradient / colour
	const [background, setBackground] = useState<string>(
		`linear-gradient(90deg, ${SliderColors.off}, ${SliderColors.off} 6px, ${SliderColors.negative} 6px)`,
	)

	// this useEffect adds a touch event listener used to prevent bubbling.
	useEffect(() => {
		const touchstart = (e: TouchEvent) => {
			if (e.cancelable) {
				e.preventDefault()
				touchmove(e)
			}
		}
		self.current?.addEventListener('touchstart', touchstart)
		const cleanup_self = self.current
		return () => {
			cleanup_self?.removeEventListener('touchstart', touchstart)
		}
	})

	const touchmove = (e: ReactTouchEvent | TouchEvent) => {
		if (self.current && e.targetTouches[0]) {
			const rect = self.current.getBoundingClientRect()
			const new_val = Math.max(
				Math.min(Math.round((e.targetTouches[0].clientX - (rect.x + 5)) / ((rect.width - 10) / fidelity)), fidelity),
				0,
			)
			colourAndState(new_val)
			onChange(new_val / fidelity)
		}
	}

	return (
		<div
			className={style.slider}
			aria-label={ariaLabel}
			aria-orientation='horizontal'
			aria-valuemax={fidelity}
			aria-valuemin={0}
			aria-valuenow={value}
			ref={self}
			role='slider'
			tabIndex={0}
			onKeyDown={(e) => {
				let new_val: number
				switch (e.key) {
					case 'Up':
					case 'ArrowUp':
					case 'Right':
					case 'ArrowRight': {
						e.preventDefault()
						new_val = Math.min(Math.round(value + fidelity / 100), fidelity)
						colourAndState(new_val)
						onChange(new_val / fidelity)
						break
					}
					case 'Down':
					case 'ArrowDown':
					case 'Left':
					case 'ArrowLeft': {
						e.preventDefault()
						new_val = Math.max(Math.round(value - fidelity / 100), 0)
						colourAndState(new_val)
						onChange(new_val / fidelity)
						break
					}
					case 'PageUp': {
						e.preventDefault()
						new_val = Math.min(Math.round(value + fidelity / 10), fidelity)
						colourAndState(new_val)
						onChange(new_val / fidelity)
						break
					}
					case 'PageDown': {
						e.preventDefault()
						new_val = Math.max(Math.round(value - fidelity / 10), 0)
						colourAndState(new_val)
						onChange(new_val / fidelity)
						break
					}
					default:
						break
				}
			}}
		>
			<div tabIndex={-1}>
				<input
					aria-label={ariaLabel}
					aria-orientation='horizontal'
					aria-valuemax={fidelity}
					aria-valuemin={0}
					aria-valuenow={value}
					max={fidelity}
					min={0}
					style={{ background, width }}
					tabIndex={-1}
					type='range'
					value={value}
					onChange={(e) => {
						const new_val = +e.target.value
						colourAndState(new_val)
						onChange(new_val / fidelity)
					}}
					onTouchMove={(e) => {
						touchmove(e)
					}}
				/>
			</div>
		</div>
	)
}

export default Slider
