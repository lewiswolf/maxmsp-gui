import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as PauseButton } from '../svg/playbar-pause.svg'
import { ReactComponent as PlayButton } from '../svg/playbar-play.svg'
import style from '../css/playbar.module.scss'

export default class Playbar extends Component {
    static propTypes = {
        inactive: propTypes.bool,
        width: propTypes.number,
        value: propTypes.number,
        setPlaying: propTypes.bool,
        isPlaying: propTypes.func,
        onChange: propTypes.func,
    }

    static defaultProps = {
        inactive: false,
        width: 200,
        value: 0,
        setPlaying: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            isPlaying: this.props.setPlaying,
            playMouseDown: false,
            sliderMouseDown: false,
            width: this.props.width >= 100 ? this.props.width : 100,
        }
        this.globalMouseUp = this.globalMouseUp.bind(this)
        this.resize = this.resize.bind(this)
    }

    componentDidUpdate(prevProps) {
        this.props.value !== prevProps.value &&
            this.setState({
                value: this.props.value,
            })

        this.props.setPlaying !== prevProps.setPlaying &&
            this.setState(
                {
                    isPlaying: this.props.setPlaying,
                },
                () =>
                    !this.props.inactive &&
                    this.props.isPlaying &&
                    this.props.isPlaying(this.state.isPlaying)
            )
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.globalMouseUp)
        window.addEventListener('touchend', this.globalMouseUp)
        window.addEventListener('resize', this.resize)
        this.resize()
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.globalMouseUp)
        window.removeEventListener('touchend', this.globalMouseUp)
        window.removeEventListener('resize', this.resize)
    }

    globalMouseUp = () => {
        ;(this.state.playMouseDown || this.state.sliderMouseDown) &&
            this.setState({ playMouseDown: false, sliderMouseDown: false })
    }

    resize = () => {
        const computedWidth = ReactDOM.findDOMNode(
            this
        ).parentNode.getBoundingClientRect().width
        const idealWidth = this.props.width
        this.setState({
            width: computedWidth < idealWidth ? computedWidth : idealWidth,
        })
    }

    playButtonMouseDown = () => {
        !this.state.playMouseDown &&
            this.setState(
                {
                    isPlaying: !this.state.isPlaying,
                    playMouseDown: true,
                },
                () =>
                    !this.props.inactive &&
                    this.props.isPlaying &&
                    this.props.isPlaying(this.state.isPlaying)
            )
    }

    render() {
        return (
            <div
                className={style.playbar}
                style={{
                    width: this.state.width,
                }}
            >
                {React.createElement(
                    !this.props.inactive && this.state.isPlaying
                        ? PauseButton
                        : PlayButton,
                    {
                        style: {
                            fill: !this.props.inactive ? '#cee5e8' : '#808080',
                            background: this.state.playMouseDown
                                ? 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)'
                                : 'inherit',
                        },
                        onMouseDown: () => this.playButtonMouseDown(),
                        onTouchStart: () => this.playButtonMouseDown(),
                    }
                )}
                {/* <SVG
					style={{
						fill: !this.props.inactive ? '#cee5e8' : '#808080',
						background: this.state.playMouseDown
							? 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)'
							: 'inherit',
					}}
					src={require(`../svg/playbar-${
						!this.props.inactive && this.state.isPlaying ? 'pause' : 'play'
					}.svg`)}
					onMouseDown={() => this.playButtonMouseDown()}
					onTouchStart={() => this.playButtonMouseDown()}
				/> */}
                <hr />
                <svg
                    version='1.1'
                    x='0px'
                    y='0px'
                    viewBox='0 0 84 84'
                    xmlSpace='preserve'
                    style={{
                        enableBackground: 'new 0 0 84 84',
                        left: `${
                            (this.state.width - 37) * (this.state.value / 100) +
                            16
                        }px`,
                    }}
                >
                    <g>
                        <path
                            style={{
                                fill: !this.props.inactive
                                    ? '#cee5e8'
                                    : '#808080',
                            }}
                            d='M42.13,67.02C28.24,67.05,16.97,55.8,16.98,41.93C17,28.19,28.21,16.98,41.98,16.94
		c13.89-0.03,25.17,11.22,25.15,25.08C67.1,55.78,55.89,66.99,42.13,67.02z M42.14,25.02c-9.35-0.03-17.07,7.62-17.07,16.94
		c-0.01,9.23,7.57,16.91,16.77,16.99c9.37,0.08,17.14-7.51,17.2-16.81C59.1,32.78,51.47,25.05,42.14,25.02z'
                        />
                        <path
                            style={{
                                fill: this.state.sliderMouseDown
                                    ? !this.props.inactive
                                        ? '#cee5e8'
                                        : '#808080'
                                    : 'none',
                                opacity: 0.5,
                            }}
                            d='M42.14,25.02c9.33,0.03,16.96,7.76,16.9,17.11c-0.06,9.3-7.83,16.9-17.2,16.81c-9.2-0.08-16.78-7.76-16.77-16.99
		C25.08,32.64,32.8,24.98,42.14,25.02z'
                        />
                    </g>
                </svg>
                <input
                    type='range'
                    min='0'
                    max='100'
                    value={this.state.value}
                    onMouseDown={() =>
                        this.setState({
                            sliderMouseDown: true,
                        })
                    }
                    onTouchStart={() =>
                        this.setState({
                            sliderMouseDown: true,
                        })
                    }
                    onChange={(e) =>
                        this.setState(
                            { value: parseInt(e.target.value) },
                            () =>
                                this.props.onChange &&
                                this.props.onChange(this.state.value)
                        )
                    }
                />
            </div>
        )
    }
}
