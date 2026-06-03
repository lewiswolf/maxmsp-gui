// biome-ignore-all lint/nursery/noInlineStyles : inline styling is here used to curate a dynamic width

// dependencies
import {
	type FC,
	type ChangeEvent,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	type TouchEvent as ReactTouchEvent,
	createElement,
	useEffect,
	useRef,
	useState,
} from 'react'

// src
import style from '../scss/playbar.module.scss'
import PauseButtonSVG from '../svg/playbar-pause.svg?react'
import PlayButtonSVG from '../svg/playbar-play.svg?react'
import PlaySliderSVG from '../svg/playbar-slider.svg?react'

const PlaybarToggle: FC<{
	ariaLabel: string
	inactive: boolean
	setPlaying: boolean
	onPlay: (b: boolean) => void
}> = ({ ariaLabel, inactive, setPlaying, onPlay }) => {
	/*
		The toggle element of the playbar.
	*/

	// is the toggle pressed - state and prop
	const [playing, isPlaying] = useState<boolean>(setPlaying)
	useEffect((): void => {
		isPlaying(setPlaying)
	}, [setPlaying])
	// mousedown state
	const [mousedown, isMouseDown] = useState<boolean>(false)
	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (!mousedown) {
				isMouseDown(true)
				if (!inactive) {
					isPlaying(!playing)
					onPlay(!playing)
				}
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
			if (!inactive) {
				isPlaying(!playing)
				e.currentTarget.setPointerCapture(e.pointerId)
				onPlay(!playing)
			}
		}
	}
	const _onPointerUp = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			isMouseDown(false)
			e.currentTarget.releasePointerCapture(e.pointerId)
		}
	}
	const _onPointerCancel = (): void => {
		isMouseDown(false)
	}

	return (
		<div
			aria-checked={playing}
			aria-disabled={inactive}
			aria-label={`${ariaLabel}: play button`}
			className='playbutton'
			data-state={mousedown ? 'mousedown' : 'default'}
			onKeyDown={_onKeyDown}
			onKeyUp={_onKeyUp}
			onPointerCancel={_onPointerCancel}
			onPointerDown={_onPointerDown}
			onPointerUp={_onPointerUp}
			role='switch'
			tabIndex={0}
		>
			<div tabIndex={-1}>
				{createElement(!inactive && playing ? PauseButtonSVG : PlayButtonSVG, {
					role: 'img',
					tabIndex: -1,
				})}
			</div>
		</div>
	)
}

const PlaybarSlider: FC<{
	ariaLabel: string
	inactive: boolean
	setValue: number
	width: number
	onChange: (x: number) => void
}> = ({ ariaLabel, inactive, setValue, width, onChange }) => {
	/*
		The slider element of the playbar.
	*/
	const fidelity = 10000
	const self = useRef<HTMLDivElement>(null)
	// dynamic width - state and prop
	// this maintains that the svg is always positioned within the slider
	const [stateWidth, updateWidth] = useState<number>(width)
	useEffect((): (() => void) => {
		const computeWidth = (): void => {
			if (self.current?.parentElement) {
				updateWidth(Math.min(width, self.current.parentElement.getBoundingClientRect().width))
			}
		}
		window.addEventListener('resize', computeWidth)
		computeWidth()
		return (): void => {
			window.removeEventListener('resize', computeWidth)
		}
	}, [width])
	// mousedown state
	const [mousedown, isMouseDown] = useState<boolean>(false)
	// slider value - state and prop
	const [value, updateValue] = useState<number>(Math.max(Math.min(setValue, 1), 0) * fidelity)
	useEffect((): void => {
		if (!mousedown) {
			updateValue(Math.max(Math.min(setValue, 1), 0) * fidelity)
		}
	}, [mousedown, setValue])
	// onChange event with prop
	const changeSlider = (v: number): void => {
		updateValue(v)
		onChange(v / fidelity)
	}
	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		switch (e.key) {
			case 'Up':
			case 'ArrowUp':
			case 'Right':
			case 'ArrowRight': {
				e.preventDefault()
				changeSlider(Math.min(Math.round(value + fidelity * 0.01), fidelity))
				break
			}
			case 'Down':
			case 'ArrowDown':
			case 'Left':
			case 'ArrowLeft':
				e.preventDefault()
				changeSlider(Math.max(Math.round(value - fidelity * 0.01), 0))
				break
			case 'PageUp': {
				e.preventDefault()
				changeSlider(Math.min(Math.round(value + fidelity * 0.1), fidelity))
				break
			}
			case 'PageDown': {
				e.preventDefault()
				changeSlider(Math.max(Math.round(value - fidelity * 0.1), 0))
				break
			}
			default:
				break
		}
	}
	const _onPointerDown = (): void => {
		isMouseDown(true)
	}
	const _onPointerUp = (): void => {
		isMouseDown(false)
	}
	const _onPointerCancel = (): void => {
		isMouseDown(false)
	}
	const _onTouchMove = (e: ReactTouchEvent<HTMLInputElement>): void => {
		e.preventDefault()
		if (self.current && e.targetTouches[0]) {
			const rect = self.current.getBoundingClientRect()
			changeSlider(
				Math.max(
					Math.min(
						Math.round((e.targetTouches[0].clientX - (rect.x + 5)) / ((rect.width - 10) / fidelity)),
						fidelity,
					),
					0,
				),
			)
		}
	}
	const _onChange = (e: ChangeEvent<HTMLInputElement>): void => {
		changeSlider(Number(e.target.value))
	}

	return (
		<>
			<hr />
			<div
				aria-disabled={inactive}
				aria-label={`${ariaLabel}: slider`}
				aria-orientation='horizontal'
				aria-valuemax={fidelity}
				aria-valuemin={0}
				aria-valuenow={value}
				data-state={mousedown ? 'mousedown' : 'default'}
				onKeyDown={_onKeyDown}
				ref={self}
				role='slider'
				tabIndex={0}
			>
				<div tabIndex={-1}>
					<input
						aria-disabled={inactive}
						aria-label={`${ariaLabel}: slider`}
						aria-orientation='horizontal'
						aria-valuemax={fidelity}
						aria-valuemin={0}
						aria-valuenow={value}
						max={fidelity}
						min='0'
						onChange={_onChange}
						onPointerCancel={_onPointerCancel}
						onPointerDown={_onPointerDown}
						onPointerUp={_onPointerUp}
						onTouchMove={_onTouchMove}
						tabIndex={-1}
						type='range'
						value={value}
					/>
				</div>
			</div>
			<PlaySliderSVG
				role='img'
				style={{
					left: `${((stateWidth - 37) * (value / fidelity) + 16).toString()}px`,
				}}
			/>
		</>
	)
}

const Playbar: FC<{
	ariaLabel?: string
	inactive?: boolean
	setPlaying?: boolean
	setValue?: number
	width?: number
	onChange?: (x: number) => void
	onPlay?: (b: boolean) => void
}> = ({
	ariaLabel = 'playbar',
	inactive = false,
	setPlaying = false,
	setValue = 0,
	width = 200,
	onChange = (): void => {
		/**/
	},
	onPlay = (): void => {
		/**/
	},
}) => (
	<div className={style.playbar} style={{ width: Math.max(width, 100) }}>
		<PlaybarToggle ariaLabel={ariaLabel} inactive={inactive} setPlaying={setPlaying} onPlay={onPlay} />
		<PlaybarSlider
			ariaLabel={ariaLabel}
			inactive={inactive}
			setValue={setValue}
			width={Math.max(width, 100)}
			onChange={onChange}
		/>
	</div>
)

export default Playbar
