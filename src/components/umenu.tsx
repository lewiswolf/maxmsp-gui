// biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole : <ul /> and <li /> works way better than <select /> and <option />
// biome-ignore-all lint/nursery/noJsxPropsBind : prop bindings are here used in conjunction with Array.map()

// dependencies
import {
	type FC,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useRef,
	useState,
} from 'react'

// src
import style from '../scss/umenu.module.scss'
import UmenuSVG from '../svg/umenu-arrow.svg?react'

const Umenu: FC<{
	ariaLabel?: string
	items?: string[]
	width?: number
	setValue?: number
	onChange?: (i: number) => void
}> = ({
	ariaLabel = 'umenu',
	items = [],
	width = 100,
	setValue = 0,
	onChange = () => {
		/**/
	},
}) => {
	/*
		[umenu]
	*/

	const self = useRef<HTMLDivElement>(null)
	// which toggle is pressed - state and prop
	const [index, indexPressed] = useState<number>(setValue < items.length && setValue >= 0 ? setValue : 0)
	useEffect(() => {
		indexPressed((i) => (setValue < items.length && setValue >= 0 ? setValue : i))
	}, [items, setValue])
	// is the dropdown displayed
	const [dropdownVisible, setDropdown] = useState<boolean>(false)
	const [dropdownWidth, setDropdownWidth] = useState<string>('fit-content')
	// which index is focused
	const [focus, setFocus] = useState<null | number>(null)
	// keyboard event specific watch state
	const [keydown, isKeyDown] = useState<boolean>(false)

	// methods
	const responsiveDropdown = (): void => {
		if (self.current) {
			const maxWidth =
				(self.current.parentNode as HTMLElement).getBoundingClientRect().right -
				self.current.getBoundingClientRect().left
			setDropdownWidth(`${(maxWidth - 2).toString()}px`)
		}
	}
	const openDropdown = (_focus: number | null): void => {
		setDropdown(!dropdownVisible)
		setFocus(_focus)
		if (dropdownVisible) {
			responsiveDropdown()
			if (_focus !== null) {
				;(self.current?.childNodes[1]?.childNodes[_focus] as HTMLElement).focus()
			}
		}
	}

	// this useEffect adds global blurring and dropdown closing listeners.
	useEffect(() => {
		const isNotInViewport = (): void => {
			if (dropdownVisible && self.current) {
				const umenuDim = self.current.getBoundingClientRect()
				const dropdownDim = (self.current.childNodes[1] as HTMLElement).getBoundingClientRect()
				if (
					umenuDim.top > window.innerHeight ||
					dropdownDim.bottom < 0 ||
					umenuDim.left > window.innerWidth ||
					Math.max(umenuDim.right, dropdownDim.right) < 0
				) {
					setDropdown(false)
					setFocus(null)
				}
			}
		}

		const customBlur = (e: MouseEvent): void => {
			if (self.current) {
				const umenuDim = self.current.getBoundingClientRect()
				const dropdownDim = (self.current.childNodes[1] as HTMLElement).getBoundingClientRect()
				if (
					e.clientX > umenuDim.left &&
					e.clientX < umenuDim.right &&
					e.clientY > umenuDim.top &&
					e.clientY < umenuDim.bottom
				) {
					return
				}
				if (dropdownVisible) {
					if (
						e.clientX > dropdownDim.left &&
						e.clientX < dropdownDim.right &&
						e.clientY > dropdownDim.top &&
						e.clientY < dropdownDim.bottom
					) {
						return
					}
					setDropdown(false)
					setFocus(null)
				}
				self.current.blur()
			}
		}

		if (self.current) {
			responsiveDropdown()
			window.addEventListener('resize', responsiveDropdown)
			window.addEventListener('mousedown', customBlur)
			window.addEventListener('scroll', isNotInViewport)
		}
		const cleanup_self = self.current
		return () => {
			if (cleanup_self) {
				window.removeEventListener('mousedown', customBlur)
				window.removeEventListener('resize', responsiveDropdown)
				window.removeEventListener('scroll', isNotInViewport)
			}
		}
	})

	const arrowKeys = (value: 1 | -1): void => {
		if (focus === null) {
			const f = value === -1 ? items.length - 1 : 0
			setFocus(f)
			;(self.current?.childNodes[1]?.childNodes[f] as HTMLElement).focus()
		} else {
			setFocus((focus + items.length + value) % items.length)
			;(self.current?.childNodes[1]?.childNodes[focus] as HTMLElement).focus()
		}
	}

	const changeSelected = (new_index: number, aria: boolean): void => {
		indexPressed(new_index)
		setDropdown(false)
		onChange(new_index)
		if (aria) {
			self.current?.focus()
		}
	}

	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
		switch (e.key) {
			case 'Enter':
			case ' ': {
				e.preventDefault()
				if (!keydown) {
					isKeyDown(true)
					if (dropdownVisible) {
						if (focus === null) {
							openDropdown(null)
						} else {
							changeSelected(focus, true)
						}
					} else {
						openDropdown(0)
					}
				}
				break
			}
			case 'Esc':
			case 'Escape': {
				e.preventDefault()
				setDropdown(false)
				setFocus(null)
				self.current?.focus()
				break
			}
			case 'Home':
			case 'End': {
				e.preventDefault()
				setFocus(e.key === 'Home' ? 0 : items.length - 1)
				if (focus !== null) {
					;(self.current?.childNodes[1]?.childNodes[focus] as HTMLElement).focus()
				}
				break
			}
			case 'Up':
			case 'ArrowUp': {
				e.preventDefault()
				if (dropdownVisible) {
					arrowKeys(-1)
				}
				break
			}
			case 'Down':
			case 'ArrowDown': {
				e.preventDefault()
				if (dropdownVisible) {
					arrowKeys(1)
				}
				break
			}
			case 'Tab': {
				if (dropdownVisible) {
					setDropdown(false)
				}
				break
			}
			default:
				break
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>) => {
		if ((e.key === 'Enter' || e.key === ' ') && keydown) {
			e.preventDefault()
			isKeyDown(false)
		}
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (e.button === 0) {
			openDropdown(null)
		}
	}

	return (
		<div
			className={style.umenu}
			ref={self}
			style={{ width: `${Math.max(50, width).toString()}px` }}
			{...(items.length > 0 && {
				'aria-expanded': dropdownVisible,
				'aria-haspopup': 'listbox',
				'aria-label': `${ariaLabel}: ${items[index] ?? 'nothing'} selected`,
				onKeyDown: _onKeyDown,
				onKeyUp: _onKeyUp,
				role: 'button',
				tabIndex: 0,
			})}
		>
			<div onPointerDown={_onPointerDown} tabIndex={-1}>
				<p>{items[index]}</p>
				<UmenuSVG />
			</div>
			<ul
				aria-label={`${ariaLabel}: ${items[index] ?? 'nothing'} selected`}
				role='listbox'
				style={{
					display: dropdownVisible && items.length > 0 ? 'block' : 'none',
					width: dropdownWidth,
				}}
				tabIndex={-1}
			>
				{items.map((item, i) => (
					<li
						aria-selected={i === index}
						key={i.toString()}
						onPointerEnter={() => {
							setFocus(i)
						}}
						onPointerLeave={() => {
							setFocus(null)
						}}
						onPointerDown={() => {
							setFocus(i)
						}}
						onPointerUp={() => {
							changeSelected(i, false)
							setFocus(null)
						}}
						role='option'
						style={{
							background: focus === i ? 'rgb(76, 76, 76)' : 'inherit',
						}}
						tabIndex={-1}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Umenu
