// dependencies
import { createElement, useEffect, useRef, useState } from 'react'

// src
import style from '../scss/playbar.module.scss'
import PauseButtonSVG from '../svg/playbar-pause.svg?react'
import PlayButtonSVG from '../svg/playbar-play.svg?react'

const PlaybarToggle: React.FC<{
	ariaLabel?: string
	inactive?: boolean
	setPlaying?: boolean
	onPlay?: (b: boolean) => void
}> = ({ ariaLabel, inactive, setPlaying, onPlay }): JSX.Element => {
	/*
		The toggle element of the playbar.
	*/
	const self = useRef<HTMLDivElement>(null)
	// is the toggle pressed - state and prop
	const [playing, isPlaying] = useState<boolean>(setPlaying ?? false)
	useEffect(() => {
		if (setPlaying !== undefined) {
			isPlaying(setPlaying)
		}
	}, [setPlaying])
	// click event with prop
	const toggle = (): void => {
		isMouseDown(true)
		if (!inactive) {
			isPlaying(!playing)
			onPlay && onPlay(!playing) // this shouldn't need a logical not, but I think it is because it is nested
		}
	}
	// mousedown state
	const [mousedown, isMouseDown] = useState<boolean>(false)
	// this useEffect adds a global mouse up to allow for press and hover,
	// and a touchstart event used to prevent event bubbling.
	useEffect(() => {
		const mouseup = (): void => {
			isMouseDown(false)
		}
		const touchstart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				toggle()
			}
		}
		window.addEventListener('mouseup', mouseup)
		if (self.current) {
			self.current.addEventListener('touchstart', touchstart)
		}
		const cleanup_self = self.current
		return () => {
			window.removeEventListener('mouseup', mouseup)
			if (cleanup_self) {
				cleanup_self.removeEventListener('touchstart', touchstart)
			}
		}
	})

	return (
		<div
			aria-checked={playing}
			aria-disabled={inactive}
			aria-label={`${ariaLabel}: play button`}
			className='playbutton'
			ref={self}
			role='switch'
			style={{
				fill: !inactive ? '#cee5e8' : '#808080',
				background: mousedown ? 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)' : 'inherit',
			}}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key == ' ' || e.key == 'Enter') {
					e.preventDefault()
					toggle()
				}
			}}
			onKeyUp={() => {
				isMouseDown(false)
			}}
			onMouseDown={(e) => {
				if (e.button === 0) {
					toggle()
				}
			}}
			onTouchCancel={() => {
				isMouseDown(false)
			}}
			onTouchEnd={() => {
				isMouseDown(false)
			}}
		>
			<div style={{ outline: 0 }} tabIndex={-1}>
				{createElement(!inactive && playing ? PauseButtonSVG : PlayButtonSVG, {
					tabIndex: -1,
				})}
			</div>
		</div>
	)
}

const PlaybarSlider: React.FC<{
	ariaLabel: string
	inactive: boolean
	setValue: number
	width: number
	onChange: (v: number) => void
}> = ({ ariaLabel, inactive, setValue, width, onChange }): JSX.Element => {
	/*
		The slider element of the playbar.
	*/
	const fidelity = 10000
	const self = useRef<HTMLDivElement>(null)
	// mousedown state
	const [mousedown, isMouseDown] = useState<boolean>(false)
	// slider value - state and prop
	const [value, updateValue] = useState<number>(inactive ? 0 : Math.max(Math.min(setValue, 1), 0) * fidelity)
	useEffect(() => {
		updateValue(inactive ? 0 : Math.max(Math.min(setValue, 1), 0) * fidelity)
	}, [inactive, setValue])
	// dynamic width - state and prop
	// this maintains that the svg is always positioned within the slider
	const [stateWidth, updateWidth] = useState<number>(width)
	useEffect(() => {
		const computeWidth = () => {
			if (self.current?.parentElement) {
				updateWidth(Math.min(width, self.current.parentElement.getBoundingClientRect().width))
			}
		}
		window.addEventListener('resize', computeWidth)
		computeWidth()
		return () => {
			window.removeEventListener('resize', computeWidth)
		}
	}, [width])
	// this useEffect adds a global mouse up to allow for press and hover,
	useEffect(() => {
		const mouseup = (): void => {
			isMouseDown(false)
		}
		window.addEventListener('mouseup', mouseup)
		return () => {
			window.removeEventListener('mouseup', mouseup)
		}
	}, [])
	// onChange event with prop
	const changeSlider = (v: number) => {
		updateValue(v)
		onChange(v / fidelity)
	}

	return (
		<>
			<hr />
			<svg
				style={{
					left: `${(stateWidth - 37) * (value / fidelity) + 16}px`,
				}}
				version='1.1'
				viewBox='0 0 84 84'
				xmlSpace='preserve'
				x='0px'
				y='0px'
			>
				<g>
					<path
						style={{
							fill: !inactive ? '#cee5e8' : '#808080',
						}}
						d='M42.13,67.02C28.24,67.05,16.97,55.8,16.98,41.93C17,28.19,28.21,16.98,41.98,16.94 c13.89-0.03,25.17,11.22,25.15,25.08C67.1,55.78,55.89,66.99,42.13,67.02z M42.14,25.02c-9.35-0.03-17.07,7.62-17.07,16.94 c-0.01,9.23,7.57,16.91,16.77,16.99c9.37,0.08,17.14-7.51,17.2-16.81C59.1,32.78,51.47,25.05,42.14,25.02z'
					/>
					<path
						style={{
							fill: mousedown ? (!inactive ? '#cee5e8' : '#808080') : 'none',
							opacity: 0.4,
						}}
						d='M42.14,25.02c9.33,0.03,16.96,7.76,16.9,17.11c-0.06,9.3-7.83,16.9-17.2,16.81c-9.2-0.08-16.78-7.76-16.77-16.99 C25.08,32.64,32.8,24.98,42.14,25.02z'
					/>
				</g>
			</svg>
			<div
				aria-label={`${ariaLabel}: slider`}
				aria-orientation='horizontal'
				aria-valuemin={0}
				aria-valuemax={fidelity}
				aria-valuenow={value}
				aria-disabled={inactive}
				ref={self}
				role='slider'
				tabIndex={0}
				onKeyDown={(e) => {
					let newVal: number
					switch (e.key) {
						case 'Up':
						case 'ArrowUp':
						case 'Right':
						case 'ArrowRight':
							e.preventDefault()
							newVal = Math.round(value + fidelity / 100)
							changeSlider(newVal < fidelity ? newVal : fidelity)
							break
						case 'Down':
						case 'ArrowDown':
						case 'Left':
						case 'ArrowLeft':
							e.preventDefault()
							newVal = Math.round(value - fidelity / 100)
							changeSlider(newVal > 0 ? newVal : 0)
							break
						case 'PageUp':
							e.preventDefault()
							newVal = Math.round(value + fidelity / 10)
							changeSlider(newVal < fidelity ? newVal : fidelity)
							break
						case 'PageDown':
							e.preventDefault()
							newVal = Math.round(value - fidelity / 10)
							changeSlider(newVal > 0 ? newVal : 0)
							break
						default:
							break
					}
				}}
			>
				<div style={{ outline: 0 }} tabIndex={-1}>
					<input
						aria-label={`${ariaLabel}: slider`}
						aria-orientation='horizontal'
						aria-valuemin={0}
						aria-valuemax={fidelity}
						aria-valuenow={value}
						aria-disabled={inactive}
						min='0'
						max={fidelity}
						role='slider'
						tabIndex={-1}
						type='range'
						value={value}
						onChange={(e) => {
							changeSlider(+e.target.value)
						}}
						onMouseDown={() => {
							isMouseDown(true)
						}}
						onTouchCancel={() => {
							isMouseDown(false)
						}}
						onTouchEnd={() => {
							isMouseDown(false)
						}}
						onTouchMove={(e) => {
							if (self.current && e.targetTouches[0]) {
								const rect = self.current.getBoundingClientRect()
								const new_val = Math.round(
									(e.targetTouches[0].clientX - (rect.x + 5)) / ((rect.width - 10) / fidelity),
								)
								changeSlider(new_val > fidelity ? fidelity : new_val < 0 ? 0 : new_val)
							}
						}}
						onTouchStart={() => {
							isMouseDown(true)
						}}
					/>
				</div>
			</div>
		</>
	)
}

const Playbar: React.FC<{
	ariaLabel?: string
	inactive?: boolean
	setPlaying?: boolean
	setValue?: number
	width?: number
	onChange?: (v: number) => void
	onPlay?: (b: boolean) => void
}> = ({
	ariaLabel = 'playbar',
	inactive = false,
	setPlaying = false,
	setValue = 0,
	width = 200,
	onChange = () => {
		/**/
	},
	onPlay = () => {
		/**/
	},
}): JSX.Element => {
	/*
		[playbar]
	*/

	width = Math.max(width, 100)

	return (
		<div className={style.playbar} style={{ width: width }}>
			<PlaybarToggle ariaLabel={ariaLabel} inactive={inactive} setPlaying={setPlaying} onPlay={onPlay} />
			<PlaybarSlider
				ariaLabel={ariaLabel}
				inactive={inactive}
				setValue={setValue}
				width={width}
				onChange={onChange}
			/>
		</div>
	)
}

export default Playbar
