import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as PauseButton } from '../svg/playbar-pause.svg'
import { ReactComponent as PlayButton } from '../svg/playbar-play.svg'
import style from '../scss/playbar.module.scss'

export default class Playbar extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        fidelity: propTypes.number,
        inactive: propTypes.bool,
        setPlaying: propTypes.bool,
        value: propTypes.number,
        width: propTypes.number,
        isPlaying: propTypes.func,
        onChange: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'playbar',
        fidelity: 100,
        inactive: false,
        setPlaying: false,
        value: 0,
        width: 200,
        isPlaying: () => {},
        onChange: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            isPlaying: this.props.setPlaying,
            playMouseDown: false,
            sliderMouseDown: false,
            value: this.props.value,
            width: this.props.width >= 100 ? this.props.width : 100,
        }
        this.globalMouseUp.bind(this)
        this.playButtonTouchStart.bind(this)
        this.resize.bind(this)
        this.sliderTouchStart.bind(this)
    }

    componentDidMount() {
        const playButton = ReactDOM.findDOMNode(this).childNodes[0]
        const slider = ReactDOM.findDOMNode(this).childNodes[3].childNodes[0].childNodes[0]
        playButton.addEventListener('touchstart', this.playButtonTouchStart)
        slider.addEventListener('touchstart', this.sliderTouchStart)
        window.addEventListener('mouseup', this.globalMouseUp)
        window.addEventListener('resize', this.resize)
        this.resize()
    }

    componentWillUnmount() {
        const playButton = ReactDOM.findDOMNode(this).childNodes[0]
        const slider = ReactDOM.findDOMNode(this).childNodes[3].childNodes[0].childNodes[0]
        playButton.removeEventListener('touchstart', this.playButtonTouchStart)
        slider.removeEventListener('touchstart', this.sliderTouchStart)
        window.removeEventListener('mouseup', this.globalMouseUp)
        window.removeEventListener('resize', this.resize)
    }

    componentDidUpdate(prevProps) {
        this.props.value !== prevProps.value &&
            this.setState({
                value: this.props.value > 100 ? 100 : this.props.value,
            })

        this.props.setPlaying !== prevProps.setPlaying &&
            this.setState({
                isPlaying: this.props.setPlaying,
            })
    }

    resize = () => {
        const computedWidth = ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect().width
        this.setState({
            width: computedWidth < this.props.width ? computedWidth : this.props.width,
        })
    }

    playButtonTouchStart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            this.playButtonMouseDown()
        }
    }

    playButtonMouseDown = () =>
        this.setState(
            {
                isPlaying: !this.props.inactive && !this.state.isPlaying,
                playMouseDown: true,
            },
            () => !this.props.inactive && this.props.isPlaying(this.state.isPlaying)
        )

    globalMouseUp = () =>
        (this.state.playMouseDown || this.state.sliderMouseDown) &&
        this.setState({ playMouseDown: false, sliderMouseDown: false })

    sliderTouchStart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            this.sliderTouchMove(e)
        }
    }

    sliderTouchMove = (e) => {
        const rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
        const touch = e.targetTouches[0]
        const newVal = Math.round((touch.clientX - (rect.x + 5)) / ((rect.width - 10) / this.props.fidelity))
        this.onChange(newVal > this.props.fidelity ? this.props.fidelity : newVal < 0 ? 0 : newVal)
    }

    onChange = (value) =>
        value !== this.state.value &&
        this.setState({ value, sliderMouseDown: true }, () => this.props.onChange(this.state.value))

    render() {
        return (
            <div
                className={style.playbar}
                style={{
                    width: this.state.width,
                }}
                onTouchEnd={() => this.globalMouseUp()}
                onTouchCancel={() => this.globalMouseUp()}
            >
                <div
                    aria-label={`${this.props.ariaLabel}: play button`}
                    aria-checked={this.state.isPlaying}
                    aria-disabled={this.props.inactive}
                    aria-readonly={this.props.inactive}
                    role='switch'
                    tabIndex='0'
                    onMouseDown={(e) => e.button === 0 && this.playButtonMouseDown()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            this.playButtonMouseDown()
                        }
                    }}
                    onKeyUp={() => this.globalMouseUp()}
                    style={{
                        fill: !this.props.inactive ? '#cee5e8' : '#808080',
                        background: this.state.playMouseDown
                            ? 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)'
                            : 'inherit',
                    }}
                >
                    <div tabIndex='-1' style={{ outline: 0 }}>
                        {React.createElement(!this.props.inactive && this.state.isPlaying ? PauseButton : PlayButton, {
                            tabIndex: '-1',
                        })}
                    </div>
                </div>
                <hr />
                <svg
                    version='1.1'
                    x='0px'
                    y='0px'
                    viewBox='0 0 84 84'
                    xmlSpace='preserve'
                    style={{
                        enableBackground: 'new 0 0 84 84',
                        left: `${(this.state.width - 37) * (this.state.value / this.props.fidelity) + 16}px`,
                    }}
                >
                    <g>
                        <path
                            style={{
                                fill: !this.props.inactive ? '#cee5e8' : '#808080',
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
                <div
                    aria-label={`${this.props.ariaLabel}: slider`}
                    aria-orientation='horizontal'
                    aria-valuemin='0'
                    aria-valuemax={this.props.fidelity}
                    aria-valuenow={this.state.value}
                    aria-disabled={this.props.inactive}
                    aria-readonly={this.props.inactive}
                    role='slider'
                    tabIndex='0'
                    onKeyDown={(e) => {
                        let newVal
                        switch (e.key) {
                            case 'Up':
                            case 'ArrowUp':
                                e.preventDefault()
                            case 'Right':
                            case 'ArrowRight':
                                newVal = this.state.value + Math.round(this.props.fidelity / 100)
                                newVal <= this.props.fidelity && this.onChange(newVal)
                                break
                            case 'Down':
                            case 'ArrowDown':
                                e.preventDefault()
                            case 'Left':
                            case 'ArrowLeft':
                                newVal = this.state.value - Math.round(this.props.fidelity / 100)
                                newVal >= 0 && this.onChange(newVal)
                                break
                            case 'PageUp':
                                e.preventDefault()
                                newVal = this.state.value + Math.round(this.props.fidelity / 10)
                                if (newVal > this.props.fidelity) {
                                    newVal = this.props.fidelity
                                }
                                this.onChange(newVal)
                                break
                            case 'PageDown':
                                e.preventDefault()
                                newVal = this.state.value - Math.round(this.props.fidelity / 10)
                                if (newVal < 0) {
                                    newVal = 0
                                }
                                this.onChange(newVal)
                                break
                            default:
                                break
                        }
                    }}
                    onKeyUp={() => this.globalMouseUp()}
                >
                    <div
                        tabIndex='-1'
                        style={{
                            outline: 0,
                        }}
                    >
                        <input
                            aria-label={`${this.props.ariaLabel}: slider`}
                            aria-orientation='horizontal'
                            aria-valuemin='0'
                            aria-valuemax={this.props.fidelity}
                            aria-valuenow={this.state.value}
                            aria-disabled={this.props.inactive}
                            aria-readonly={this.props.inactive}
                            role='slider'
                            tabIndex='-1'
                            type='range'
                            min='0'
                            max={this.props.fidelity}
                            value={this.state.value}
                            onMouseDown={() =>
                                this.setState({
                                    sliderMouseDown: true,
                                })
                            }
                            onChange={(e) => this.onChange(parseInt(e.target.value))}
                            onTouchMove={(e) => this.sliderTouchMove(e)}
                            style={{
                                background: this.state.background,
                                width: this.props.length,
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
