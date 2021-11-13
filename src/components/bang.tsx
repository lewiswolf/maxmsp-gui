// dependencies
import React from 'react'
// src
import style from '../scss/bang.module.scss'
import SVG from '../svg/bang.svg'

interface Props {
	ariaLabel?: string
	ariaPressed?: boolean | null
	onClick?: () => any
}

interface State {
	clicked: boolean
}

export default class Bang extends React.Component<Props, State> {
	/* */

	private self: React.RefObject<HTMLDivElement>

	static defaultProps = {
		ariaLabel: 'bang',
		ariaPressed: null,
		onClick: () => {},
	}

	constructor(props: Props) {
		super(props)
		this.state = {
			clicked: false,
		}
		this.self = React.createRef()
		this.buttonFreed = this.buttonFreed.bind(this)
		this.touchstart = this.touchstart.bind(this)
	}

	componentDidMount(): void {
		this.self.current!.addEventListener('touchstart', this.touchstart)
		window.addEventListener('mouseup', this.buttonFreed)
	}

	componentWillUnmount(): void {
		this.self.current!.removeEventListener('touchstart', this.touchstart)
		window.removeEventListener('mouseup', this.buttonFreed)
	}

	buttonFreed = (): void => this.setState({ clicked: false })

	buttonPressed = (): void => this.setState({ clicked: true }, (): void => this.props.onClick?.())

	touchstart = (e: TouchEvent): void => {
		if (e.cancelable) {
			e.preventDefault()
			this.buttonPressed()
		}
	}

	render(): JSX.Element {
		return (
			<div
				{...(this.props.ariaPressed !== null && {
					'aria-pressed': this.props.ariaPressed,
				})}
				aria-label={this.props.ariaLabel}
				className={style.bang}
				ref={this.self}
				role='button'
				tabIndex={0}
				onMouseDown={(e: React.MouseEvent): void => {
					if (e.button === 0) {
						this.buttonPressed()
					}
				}}
				onKeyDown={(e: React.KeyboardEvent): void => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						this.buttonPressed()
					}
				}}
				onKeyUp={(e: React.KeyboardEvent): void => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						this.buttonFreed()
					}
				}}
				onTouchEnd={(): void => this.buttonFreed()}
				onTouchCancel={(): void => this.buttonFreed()}
			>
				<SVG
					style={{
						outline: 0,
						background: this.state.clicked
							? 'radial-gradient(10px circle at center, #cee5e8 50%, #333333 50%)'
							: '#333333',
					}}
					tabIndex={-1}
				/>
			</div>
		)
	}
}
