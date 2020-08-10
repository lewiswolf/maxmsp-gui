import React, { Component } from 'react';
import propTypes from 'prop-types';
import style from '../css/textbutton.module.scss';

const textColours = {
	neutral: '#CEE5E8',
	clicked: '#96AAAC',
	inactive: '#AFBABB',
};

const bgGradients = {
	neutral: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)',
	hover: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(81, 81, 81) 100%)',
	inactive: 'linear-gradient(to top, rgb(121, 121, 121) 0%, rgb(151, 151, 151) 100%)',
};

export default class TextButton extends Component {
	static propTypes = {
		inactive: propTypes.bool,
		text: propTypes.string,
		onClick: propTypes.func,
	};

	static defaultProps = {
		inactive: false,
		text: 'Button',
	};

	constructor(props) {
		super(props);
		this.state = {
			mouseDown: false,
			active: !this.props.inactive,
			bg: !this.props.inactive ? bgGradients.neutral : bgGradients.inactive,
			text: !this.props.inactive ? textColours.neutral : textColours.inactive,
		};
		this.globalMouseUp = this.globalMouseUp.bind(this);
	}

	componentDidUpdate(prevProps) {
		this.props.inactive !== prevProps.inactive &&
			this.setState({
				active: !this.props.inactive,
				bg: !this.props.inactive ? bgGradients.neutral : bgGradients.inactive,
				text: !this.props.inactive ? textColours.neutral : textColours.inactive,
			});
	}

	componentDidMount() {
		window.addEventListener('mouseup', this.globalMouseUp);
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.globalMouseUp);
	}

	globalMouseUp = () => {
		this.state.mouseDown && this.setState({ mouseDown: false });
	};

	render() {
		return (
			<div
				className={style.textbutton}
				style={{
					color: this.state.text,
					background: this.state.bg,
				}}
				onClick={this.state.active && this.props.onClick}
				onMouseEnter={() =>
					this.state.active &&
					this.setState({
						bg: this.state.mouseDown ? bgGradients.neutral : bgGradients.hover,
						text: this.state.mouseDown ? textColours.clicked : textColours.neutral,
					})
				}
				onMouseLeave={() =>
					this.state.active &&
					this.setState({
						bg: bgGradients.neutral,
						text: textColours.neutral,
					})
				}
				onMouseDown={() =>
					this.state.active &&
					this.setState({
						bg: bgGradients.neutral,
						text: textColours.clicked,
						mouseDown: true,
					})
				}
				onMouseUp={() =>
					this.state.active &&
					this.setState({
						bg: bgGradients.hover,
						text: textColours.neutral,
						mouseDown: false,
					})
				}
			>
				{this.props.text}
			</div>
		);
	}
}
