// dependencies
import { useEffect, useRef, useState } from 'react'

// src
import style from '../scss/umenu.module.scss'
import UmenuSVG from '../svg/umenu-arrow.svg?react'

const Umenu: React.FC<{
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

	// this useEffect adds a touch event listener used to prevent bubbling.
	useEffect(() => {
		const listTouchStart = (e: TouchEvent) => {
			if (e.cancelable && self.current) {
				let t = null
				self.current.childNodes[1]?.childNodes.forEach((button, i) => {
					const b = (button as HTMLElement).getBoundingClientRect()
					if (
						e.targetTouches[0] &&
						e.targetTouches[0].clientY > b.top &&
						e.targetTouches[0].clientY < b.bottom
					) {
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
					!dropdownVisible &&
					e.clientX > umenuDim.left &&
					e.clientX < umenuDim.right &&
					e.clientY > umenuDim.top &&
					e.clientY < umenuDim.bottom
				) {
					return
				} else if (dropdownVisible) {
					if (
						e.clientX > umenuDim.left &&
						e.clientX < umenuDim.right &&
						e.clientY > umenuDim.top &&
						e.clientY < umenuDim.bottom
					) {
						return
					} else if (
						e.clientX > dropdownDim.left &&
						e.clientX < dropdownDim.right &&
						e.clientY > dropdownDim.top &&
						e.clientY < dropdownDim.bottom
					) {
						return
					} else {
						setDropdown(false)
						setFocus(null)
						self.current.blur()
					}
				} else {
					self.current.blur()
				}
			}
		}

		if (self.current) {
			const toggle = self.current.childNodes[0] as HTMLElement
			const list = self.current.childNodes[1] as HTMLElement
			toggle.addEventListener('touchstart', toggleTouchStart)
			list.addEventListener('touchstart', listTouchStart)
			window.addEventListener('resize', responsiveDropdown)
			window.addEventListener('mousedown', customBlur)
			window.addEventListener('scroll', isNotInViewport)
		}
		const cleanup_self = self.current
		return () => {
			if (cleanup_self) {
				const toggle = cleanup_self.childNodes[0] as HTMLElement
				const list = cleanup_self.childNodes[1] as HTMLElement
				toggle.removeEventListener('touchstart', toggleTouchStart)
				list.removeEventListener('touchstart', listTouchStart)
				window.removeEventListener('mousedown', customBlur)
				window.removeEventListener('resize', responsiveDropdown)
				window.removeEventListener('scroll', isNotInViewport)
			}
		}
	})

	const openDropdown = (focus: number | null): void => {
		setDropdown(!dropdownVisible)
		setFocus(focus)
		if (dropdownVisible) {
			responsiveDropdown()
			if (focus !== null && self.current?.childNodes[1]?.childNodes[focus]) {
				const c = self.current.childNodes[1].childNodes[focus] as HTMLElement
				c.focus()
			}
		}
	}

	const responsiveDropdown = (): void => {
		if (self.current) {
			const maxWidth =
				(self.current.parentNode as HTMLElement).getBoundingClientRect().right -
				self.current.getBoundingClientRect().left
			setDropdownWidth('fit-content')
			if (maxWidth < (self.current.childNodes[1] as HTMLElement).offsetWidth) {
				setDropdownWidth((maxWidth - 2).toString() + 'px')
			}
		}
	}

	const arrowKeys = (value: 1 | -1): void => {
		if (focus !== null) {
			setFocus((focus + items.length + value) % items.length)
			if (self.current?.childNodes[1]?.childNodes[focus]) {
				const c = self.current.childNodes[1].childNodes[focus] as HTMLElement
				c.focus()
			}
		} else {
			const f = value === -1 ? items.length - 1 : 0
			setFocus(f)
			if (self.current?.childNodes[1]?.childNodes[f]) {
				const c = self.current.childNodes[1].childNodes[f] as HTMLElement
				c.focus()
			}
		}
	}

	const changeSelected = (new_index: number, aria: boolean): void => {
		indexPressed(new_index)
		setDropdown(false)
		onChange(new_index)
		aria && self.current?.focus()
	}

	return (
		<div
			className={style.umenu}
			ref={self}
			style={{ width: Math.max(50, width).toString() + 'px' }}
			{...(items.length > 0 && {
				'aria-label': `${ariaLabel}: ${items[index] ?? 'nothing'} selected`,
				'aria-expanded': dropdownVisible,
				'aria-haspopup': 'listbox',
				role: 'button',
				tabIndex: 0,
				onKeyDown: (e) => {
					switch (e.key) {
						case 'Enter':
						case ' ':
							e.preventDefault()
							dropdownVisible
								? focus !== null
									? changeSelected(focus, true)
									: openDropdown(null)
								: openDropdown(0)
							break
						case 'Esc':
						case 'Escape':
							e.preventDefault()
							setDropdown(false)
							setFocus(null)
							self.current && self.current.focus()
							break
						case 'Home':
						case 'End':
							e.preventDefault()
							setFocus(e.key === 'Home' ? 0 : items.length - 1)
							if (focus !== null && self.current?.childNodes[1]?.childNodes[focus]) {
								const c = self.current.childNodes[1].childNodes[focus] as HTMLElement
								c.focus()
							}
							break
						case 'Up':
						case 'ArrowUp':
							e.preventDefault()
							dropdownVisible && arrowKeys(-1)
							break
						case 'Down':
						case 'ArrowDown':
							e.preventDefault()
							dropdownVisible && arrowKeys(1)
							break
						case 'Tab':
							dropdownVisible && setDropdown(false)
							break
						default:
							break
					}
				},
			})}
		>
			<div
				tabIndex={-1}
				onMouseDown={(e) => {
					e.button === 0 && openDropdown(null)
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
				{items.map((item, i) => {
					return (
						<li
							key={i}
							{...(i === index && { 'aria-selected': true })}
							role='option'
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
							style={{
								background: focus === i ? '#4c4c4c' : 'inherit',
								outline: 0,
							}}
						>
							{item}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Umenu
