// dependencies
import { type FC, useEffect, useRef, useState } from 'react'

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

	// this useEffect adds a touch event listener used to prevent bubbling.
	useEffect(() => {
		const listTouchStart = (e: TouchEvent) => {
			if (e.cancelable && self.current) {
				let t: number | null = null
				self.current.childNodes[1]?.childNodes.forEach((button, i) => {
					const b = (button as HTMLElement).getBoundingClientRect()
					if (e.targetTouches[0] && e.targetTouches[0].clientY > b.top && e.targetTouches[0].clientY < b.bottom) {
						t = i
					}
				})
				setFocus(t)
			}
		}
		const toggleTouchStart = (e: TouchEvent): void => {
			if (e.cancelable) {
				e.preventDefault()
				openDropdown(null)
			}
		}

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
			;(self.current.childNodes[0] as HTMLElement).addEventListener('touchstart', toggleTouchStart)
			;(self.current.childNodes[1] as HTMLElement).addEventListener('touchstart', listTouchStart)
			window.addEventListener('resize', responsiveDropdown)
			window.addEventListener('mousedown', customBlur)
			window.addEventListener('scroll', isNotInViewport)
		}
		const cleanup_self = self.current
		return () => {
			if (cleanup_self) {
				;(cleanup_self.childNodes[0] as HTMLElement).removeEventListener('touchstart', toggleTouchStart)
				;(cleanup_self.childNodes[1] as HTMLElement).removeEventListener('touchstart', listTouchStart)
				window.removeEventListener('mousedown', customBlur)
				window.removeEventListener('resize', responsiveDropdown)
				window.removeEventListener('scroll', isNotInViewport)
			}
		}
	})

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

	const responsiveDropdown = (): void => {
		if (self.current) {
			const maxWidth =
				(self.current.parentNode as HTMLElement).getBoundingClientRect().right -
				self.current.getBoundingClientRect().left
			setDropdownWidth(
				maxWidth <= (self.current.childNodes[1] as HTMLElement).offsetWidth
					? `${(maxWidth - 2).toString()}px`
					: 'fit-content',
			)
		}
	}

	const arrowKeys = (value: 1 | -1): void => {
		if (focus !== null) {
			setFocus((focus + items.length + value) % items.length)
			;(self.current?.childNodes[1]?.childNodes[focus] as HTMLElement).focus()
		} else {
			const f = value === -1 ? items.length - 1 : 0
			setFocus(f)
			;(self.current?.childNodes[1]?.childNodes[f] as HTMLElement).focus()
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

	return (
		<div
			className={style.umenu}
			ref={self}
			style={{ width: `${Math.max(50, width).toString()}px` }}
			{...(items.length > 0 && {
				'aria-expanded': dropdownVisible,
				'aria-haspopup': 'listbox',
				'aria-label': `${ariaLabel}: ${items[index] ?? 'nothing'} selected`,
				role: 'button',
				tabIndex: 0,
				onKeyDown: (e) => {
					switch (e.key) {
						case 'Enter':
						case ' ': {
							e.preventDefault()
							if (!keydown) {
								isKeyDown(true)
								if (dropdownVisible) {
									if (focus !== null) {
										changeSelected(focus, true)
									} else {
										openDropdown(null)
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
				},
				onKeyUp: (e) => {
					if ((e.key === 'Enter' || e.key === ' ') && keydown) {
						e.preventDefault()
						isKeyDown(false)
					}
				},
			})}
		>
			<div
				tabIndex={-1}
				onMouseDown={(e) => {
					if (e.button === 0) {
						openDropdown(null)
					}
				}}
			>
				<p>{items[index]}</p>
				<UmenuSVG />
			</div>
			<ul
				aria-label={`${ariaLabel}: ${items[index] ?? 'nothing'} selected`}
				role='listbox'
				tabIndex={-1}
				style={{
					display: dropdownVisible && items.length > 0 ? 'block' : 'none',
					width: dropdownWidth || 'fit-content',
					whiteSpace: dropdownWidth !== 'fit-content' ? 'normal' : 'nowrap',
				}}
			>
				{items.map((item, i) => (
					<li
						aria-selected={i === index}
						key={i.toString()}
						role='option'
						style={{
							background: focus === i ? '#4c4c4c' : 'inherit',
						}}
						tabIndex={-1}
						onMouseEnter={() => {
							setFocus(i)
						}}
						onMouseLeave={() => {
							setFocus(null)
						}}
						onClick={() => {
							changeSelected(i, false)
						}}
						onTouchEnd={() => {
							setFocus(null)
						}}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Umenu
