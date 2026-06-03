// biome-ignore-all lint/nursery/noInlineStyles : inline styling is here used to curate a dynamic width

// dependencies
import {
	type FC,
	type ChangeEvent,
	type KeyboardEvent as ReactKeyboardEvent,
	type TouchEvent as ReactTouchEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

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
	onChange = (): void => {
		/* */
	},
}) => {
	/*
		[slider]
	*/

	// decalre slider parameters
	const fidelity = 10000
	const SliderColors = useMemo<{
		positive: string
		negative: string
		off: string
	}>(
		() => ({
			negative: 'rgb(89 89 89)',
			off: 'rgb(129 141 143)',
			positive: 'rgb(206 229 232)',
		}),
		[],
	)
	const default_background = `linear-gradient(90deg, ${SliderColors.off}, ${SliderColors.off} 6px, ${SliderColors.negative} 6px)`

	// component states
	const self = useRef<HTMLDivElement>(null)
	const [value, updateValue] = useState<number>(Math.max(Math.min(setValue, 1), 0) * fidelity)
	const [background, setBackground] = useState<string>(default_background)
	// declare slider colour update function
	const colourAndState = useCallback(
		(new_value: number): void => {
			if (new_value === 0) {
				setBackground(default_background)
				updateValue(0)
			} else if (self.current) {
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
		},
		[default_background, SliderColors],
	)
	// what is the value - prop
	useEffect((): void => {
		colourAndState(Math.max(Math.min(setValue, 1), 0) * fidelity)
	}, [setValue, colourAndState])

	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		switch (e.key) {
			case 'Up':
			case 'ArrowUp':
			case 'Right':
			case 'ArrowRight': {
				e.preventDefault()
				const new_val = Math.min(Math.round(value + fidelity * 0.01), fidelity)
				colourAndState(new_val)
				onChange(new_val / fidelity)
				break
			}
			case 'Down':
			case 'ArrowDown':
			case 'Left':
			case 'ArrowLeft': {
				e.preventDefault()
				const new_val = Math.max(Math.round(value - fidelity * 0.01), 0)
				colourAndState(new_val)
				onChange(new_val / fidelity)
				break
			}
			case 'PageUp': {
				e.preventDefault()
				const new_val = Math.min(Math.round(value + fidelity * 0.1), fidelity)
				colourAndState(new_val)
				onChange(new_val / fidelity)
				break
			}
			case 'PageDown': {
				e.preventDefault()
				const new_val = Math.max(Math.round(value - fidelity * 0.1), 0)
				colourAndState(new_val)
				onChange(new_val / fidelity)
				break
			}
			default:
				break
		}
	}
	const _onPointerUp = (): void => {
		onChange(value / fidelity)
	}
	const _onTouchMove = (e: ReactTouchEvent<HTMLInputElement>): void => {
		e.preventDefault()
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
	const _onChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const new_val = Number(e.target.value)
		colourAndState(new_val)
		onChange(new_val / fidelity)
	}

	return (
		<div
			aria-label={ariaLabel}
			aria-orientation='horizontal'
			aria-valuemax={fidelity}
			aria-valuemin={0}
			aria-valuenow={value}
			className={style.slider}
			onKeyDown={_onKeyDown}
			ref={self}
			role='slider'
			tabIndex={0}
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
					onChange={_onChange}
					onPointerUp={_onPointerUp}
					onTouchMove={_onTouchMove}
					style={{ background, width }}
					tabIndex={-1}
					type='range'
					value={value}
				/>
			</div>
		</div>
	)
}

export default Slider
