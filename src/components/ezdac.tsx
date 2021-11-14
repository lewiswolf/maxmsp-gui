// dependencies
import React from 'react'
// src
import style from '../scss/ezdac.module.scss'
import SVG from '../svg/ezdac.svg'

interface Props {
	ariaLabel?: string
	value?: boolean
	onClick?: (b: boolean) => any
}

interface State {
	toggle: boolean
}

export default class Ezdac extends React.Component<Props, State> {
	/* */

	private self: React.RefObject<HTMLDivElement>

	static defaultProps = {
		ariaLabel: 'ezdac',
		onClick: (b: boolean) => {},
		value: false,
	}

	constructor(props: Props) {
		super(props)
		this.state = {
			toggle: this.props.value || false,
		}
		this.self = React.createRef()
		this.touchstart = this.touchstart.bind(this)
	}

	componentDidMount(): void {
		this.self.current!.addEventListener('touchstart', this.touchstart)
	}

	componentWillUnmount(): void {
		this.self.current!.removeEventListener('touchstart', this.touchstart)
	}

	componentDidUpdate(prevProps: Props): void {
		prevProps.value !== this.props.value &&
			this.setState({
				toggle: this.props.value || this.state.toggle,
			})
	}

	touchstart = (e: TouchEvent): void => {
		if (e.cancelable) {
			e.preventDefault()
			this.togglePressed()
		}
	}

	togglePressed = (): void =>
		this.setState(
			{
				toggle: !this.state.toggle,
			},
			(): void => this.props.onClick?.(this.state.toggle)
		)

	render(): JSX.Element {
		return (
			<div
				ref={this.self}
				className={style.ezdac}
				aria-label={this.props.ariaLabel}
				aria-checked={this.state.toggle}
				role='switch'
				tabIndex={0}
				onMouseDown={(e: React.MouseEvent): void => {
					if (e.button === 0) {
						this.togglePressed()
					}
				}}
				onKeyDown={(e: React.KeyboardEvent): void => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						this.togglePressed()
					}
				}}
			>
				<SVG
					tabIndex={-1}
					style={{
						outline: 0,
						background: this.state.toggle
							? 'radial-gradient(40px circle at center,#cee5e8 50%,#333333 50%)'
							: '#595959',
					}}
				/>
			</div>
		)
	}
}
