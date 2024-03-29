// dependencies
import { useEffect, useMemo, useRef, useState } from 'react'

// src
import style from '../scss/slider.module.scss'

const Slider: React.FC<{
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

	// what is the value - state and prop
	const [value, updateValue] = useState<number>(Math.max(Math.min(setValue, 1), 0) * fidelity)
	useEffect(() => {
		const new_value = Math.max(Math.min(setValue, 1), 0) * fidelity
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
	}, [SliderColors, setValue])

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

	const colourAndValue = (new_value: number, allowCallback: boolean): void => {
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
				allowCallback && onChange(new_value / fidelity)
			}
		} else {
			setBackground(
				`linear-gradient(90deg, ${SliderColors.off}, ${SliderColors.off} 6px, ${SliderColors.negative} 6px)`,
			)
			updateValue(0)
			allowCallback && onChange(new_value / fidelity)
		}
	}

	const touchmove = (e: React.TouchEvent | TouchEvent) => {
		if (self.current && e.targetTouches[0]) {
			const rect = self.current.getBoundingClientRect()
			const new_val = Math.round((e.targetTouches[0].clientX - (rect.x + 5)) / ((rect.width - 10) / fidelity))
			colourAndValue(new_val > fidelity ? fidelity : new_val < 0 ? 0 : new_val, true)
		}
	}

	return (
		<div
			className={style.slider}
			aria-label={ariaLabel}
			aria-orientation='horizontal'
			aria-valuemin={0}
			aria-valuemax={fidelity}
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
					case 'ArrowRight':
						e.preventDefault()
						new_val = Math.round(value + fidelity / 100)
						new_val <= fidelity && colourAndValue(new_val, true)
						break
					case 'Down':
					case 'ArrowDown':
					case 'Left':
					case 'ArrowLeft':
						e.preventDefault()
						new_val = Math.round(value - fidelity / 100)
						new_val >= 0 && colourAndValue(new_val, true)
						break
					case 'PageUp':
						e.preventDefault()
						new_val = Math.round(value + fidelity / 10)
						if (new_val > fidelity) {
							new_val = fidelity
						}
						colourAndValue(new_val, true)
						break
					case 'PageDown':
						e.preventDefault()
						new_val = Math.round(value - fidelity / 10)
						if (new_val < 0) {
							new_val = 0
						}
						colourAndValue(new_val, true)
						break
					default:
						break
				}
			}}
		>
			<div tabIndex={-1} style={{ outline: 0 }}>
				<input
					aria-label={ariaLabel}
					aria-orientation='horizontal'
					aria-valuemin={0}
					aria-valuemax={fidelity}
					aria-valuenow={value}
					role='slider'
					tabIndex={-1}
					type='range'
					min={0}
					max={fidelity}
					value={value}
					onChange={(e) => {
						colourAndValue(+e.target.value, true)
					}}
					onTouchMove={(e) => {
						touchmove(e)
					}}
					style={{
						background: background,
						width: width,
					}}
				/>
			</div>
		</div>
	)
}

export default Slider
