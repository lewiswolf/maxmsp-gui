// biome-ignore-all lint/a11y/noNoninteractiveElementToInteractiveRole : <ul /> and <li /> works way better than <select /> and <option />
// biome-ignore-all lint/nursery/noInlineStyles : inline styling is here used to curate a dynamic width
// biome-ignore-all lint/performance/noJsxPropsBind : prop bindings are here used in conjunction with Array.map()

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

// constexpr
const _defaultArray: string[] = []
const _defaultVoidFunction = (): void => {
	/* */
}

const Umenu: FC<{
	ariaLabel?: string
	items?: string[]
	width?: number
	setValue?: number
	onChange?: (i: number) => void
}> = ({ ariaLabel = 'umenu', items = _defaultArray, width = 100, setValue = 0, onChange = _defaultVoidFunction }) => {
	/*
		[umenu]
	*/

	const self = useRef<HTMLDivElement>(null)
	// which toggle is pressed - state and prop
	const [index_pressed, setIndexPressed] = useState<number>(setValue < items.length && setValue >= 0 ? setValue : 0)
	useEffect((): void => {
		setIndexPressed((i) => (setValue < items.length && setValue >= 0 ? setValue : i))
	}, [items, setValue])
	// is the dropdown displayed
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
	const [dropdownWidth, setDropdownWidth] = useState<string>('fit-content')
	// which index is focused
	const [index_focused, setIndexFocused] = useState<null | number>(null)
	// keyboard event specific watch state
	const [key_down, setKeyDown] = useState<boolean>(false)

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
		setDropdownVisible(!dropdownVisible)
		setIndexFocused(_focus)
		if (dropdownVisible) {
			responsiveDropdown()
			if (_focus !== null) {
				;(self.current?.childNodes[1]?.childNodes[_focus] as HTMLElement).focus()
			}
		}
	}

	// this useEffect adds global blurring and dropdown closing listeners.
	useEffect((): (() => void) => {
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
					setDropdownVisible(false)
					setIndexFocused(null)
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
					setDropdownVisible(false)
					setIndexFocused(null)
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
		return (): void => {
			if (cleanup_self) {
				window.removeEventListener('mousedown', customBlur)
				window.removeEventListener('resize', responsiveDropdown)
				window.removeEventListener('scroll', isNotInViewport)
			}
		}
	})

	const arrowKeys = (value: 1 | -1): void => {
		if (index_focused === null) {
			const f = value === -1 ? items.length - 1 : 0
			setIndexFocused(f)
			;(self.current?.childNodes[1]?.childNodes[f] as HTMLElement).focus()
		} else {
			setIndexFocused((index_focused + items.length + value) % items.length)
			;(self.current?.childNodes[1]?.childNodes[index_focused] as HTMLElement).focus()
		}
	}

	const changeSelected = (new_index: number, aria: boolean): void => {
		setIndexPressed(new_index)
		setDropdownVisible(false)
		onChange(new_index)
		if (aria) {
			self.current?.focus()
		}
	}

	// event handlers
	const _onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		switch (e.key) {
			case 'Enter':
			case ' ': {
				e.preventDefault()
				if (!key_down) {
					setKeyDown(true)
					if (dropdownVisible) {
						if (index_focused === null) {
							openDropdown(null)
						} else {
							changeSelected(index_focused, true)
						}
					} else {
						openDropdown(null)
					}
				}
				break
			}
			case 'Esc':
			case 'Escape': {
				e.preventDefault()
				setDropdownVisible(false)
				setIndexFocused(null)
				self.current?.focus()
				break
			}
			case 'Home':
			case 'End': {
				e.preventDefault()
				setIndexFocused(e.key === 'Home' ? 0 : items.length - 1)
				if (index_focused !== null) {
					;(self.current?.childNodes[1]?.childNodes[index_focused] as HTMLElement).focus()
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
					setDropdownVisible(false)
				}
				break
			}
			default:
				break
		}
	}
	const _onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
		if ((e.key === 'Enter' || e.key === ' ') && key_down) {
			e.preventDefault()
			setKeyDown(false)
		}
	}
	const _onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
		if (e.button === 0) {
			openDropdown(null)
		}
	}

	return (
		<div
			{...(items.length > 0 && {
				'aria-expanded': dropdownVisible,
				'aria-haspopup': 'listbox',
				'aria-label': `${ariaLabel}: ${items[index_pressed] ?? 'nothing'} selected`,
				onKeyDown: _onKeyDown,
				onKeyUp: _onKeyUp,
				role: 'button',
				tabIndex: 0,
			})}
			className={style.umenu}
			ref={self}
			style={{ width: `${Math.max(50, width).toString()}px` }}
		>
			<div onPointerDown={_onPointerDown} tabIndex={-1}>
				<p>{items[index_pressed]}</p>
				<UmenuSVG role='img' />
			</div>
			<ul
				className={dropdownVisible && items.length > 0 ? style.visible : ''}
				aria-label={`${ariaLabel}: ${items[index_pressed] ?? 'nothing'} selected`}
				role='listbox'
				style={{ width: dropdownWidth }}
				tabIndex={-1}
			>
				{items.map((item, i) => (
					<li
						aria-selected={i === index_pressed}
						className={index_focused === i ? style.focused : ''}
						key={item}
						onPointerEnter={(): void => {
							setIndexFocused(i)
						}}
						onPointerLeave={(): void => {
							setIndexFocused(null)
						}}
						onPointerDown={(): void => {
							setIndexFocused(i)
						}}
						onPointerUp={(): void => {
							changeSelected(i, false)
							setIndexFocused(null)
						}}
						role='option'
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
