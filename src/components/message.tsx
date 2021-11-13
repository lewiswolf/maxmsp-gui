// dependencies
import React from 'react'
// src
import style from '../scss/message.module.scss'

interface Props {
	ariaLabel?: string
	ariaPressed?: boolean | null
	text?: string
	onClick?: () => any
}

interface State {
	clicked: boolean
}

export default class Message extends React.Component<Props, State> {
	/* */

	private self: React.RefObject<HTMLDivElement>

	static defaultProps = {
		ariaPressed: null,
		ariaLabel: 'message',
		text: '',
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

	touchstart = (e: TouchEvent): void => {
		if (e.cancelable) {
			e.preventDefault()
			this.buttonPressed()
		}
	}

	buttonPressed = (): void => this.setState({ clicked: true }, (): void => this.props.onClick?.())

	buttonFreed = (): void => this.setState({ clicked: false })

	render() {
		return (
			<div
				ref={this.self}
				className={style.message}
				aria-label={this.props.ariaLabel}
				{...(this.props.ariaPressed !== null && {
					'aria-pressed': this.props.ariaPressed,
				})}
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
				<p
					tabIndex={-1}
					style={{
						outline: 0,
						padding: this.state.clicked ? '6px 4px 4px 6px' : '5px 5px',
					}}
				>
					{this.props.text}
				</p>
			</div>
		)
	}
}
