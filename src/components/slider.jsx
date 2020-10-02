import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../scss/slider.module.scss'

const sliderColors = {
    positive: '#cee5e8',
    negative: '#595959',
    off: '#818d8f',
}

export default class Slider extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        fidelity: propTypes.number,
        length: propTypes.number,
        value: propTypes.number,
        onChange: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'slider',
        fidelity: 100,
        length: 200,
        value: 0,
        onChange: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            background: `linear-gradient(90deg, 
                ${sliderColors.off}, 
                ${sliderColors.off} 6px,
                ${sliderColors.negative} 6px)`,
            value: this.props.value <= this.props.fidelity && this.props.value >= 0 ? this.props.value : 0,
        }
    }

    componentDidUpdate(prevProps) {
        this.props.value !== prevProps.value &&
            this.props.value <= this.props.fidelity &&
            this.props.value >= 0 &&
            this.setState({
                value: this.props.value,
            })
    }

    colourAndValue = (value) => {
        const sliderWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width - 10
        if (value !== 0) {
            this.setState(
                {
                    value: value,
                    background: `linear-gradient(90deg,
                        ${sliderColors.negative}, 
                        ${sliderColors.negative} 0px, 
                        ${sliderColors.positive} 0px, 
                        ${sliderColors.positive} ${(sliderWidth - 6) * (value / this.props.fidelity) - 1}px, 
                        ${sliderColors.negative} ${(sliderWidth - 6) * (value / this.props.fidelity) - 1}px,
                        ${sliderColors.negative} ${(sliderWidth - 6) * (value / this.props.fidelity)}px,
                        ${sliderColors.positive} ${(sliderWidth - 6) * (value / this.props.fidelity)}px,
                        ${sliderColors.positive} ${(sliderWidth - 6) * (value / this.props.fidelity) + 6}px,
                        ${sliderColors.negative} ${(sliderWidth - 6) * (value / this.props.fidelity) + 6}px
                    )`,
                },
                () => this.props.onChange(this.state.value)
            )
        } else {
            this.setState(
                {
                    value: 0,
                    background: `linear-gradient(90deg, ${sliderColors.off}, ${sliderColors.off} 6px, ${sliderColors.negative} 6px)`,
                },
                () => this.props.onChange(this.state.value)
            )
        }
    }

    ios = (e) => {
        const rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
        const touch = e.targetTouches[0]
        if (touch.clientX < rect.right - 5 && touch.clientX > rect.left + 5) {
            this.colourAndValue(Math.round((touch.clientX - (rect.x + 5)) / ((rect.width - 10) / this.props.fidelity)))
        }
    }

    render() {
        return (
            <div
                className={style.slider}
                aria-label={this.props.ariaLabel}
                aria-orientation='horizontal'
                aria-valuemin='0'
                aria-valuemax={this.props.fidelity}
                aria-valuenow={this.state.value}
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
                            newVal <= this.props.fidelity && this.colourAndValue(newVal)
                            break
                        case 'Down':
                        case 'ArrowDown':
                            e.preventDefault()
                        case 'Left':
                        case 'ArrowLeft':
                            newVal = this.state.value - Math.round(this.props.fidelity / 100)
                            newVal >= 0 && this.colourAndValue(newVal)
                            break
                        case 'PageUp':
                            e.preventDefault()
                            newVal = this.state.value + Math.round(this.props.fidelity / 10)
                            if (newVal > this.props.fidelity) {
                                newVal = this.props.fidelity
                            }
                            this.colourAndValue(newVal)
                            break
                        case 'PageDown':
                            e.preventDefault()
                            newVal = this.state.value - Math.round(this.props.fidelity / 10)
                            if (newVal < 0) {
                                newVal = 0
                            }
                            this.colourAndValue(newVal)
                            break
                        default:
                            break
                    }
                }}
            >
                <div
                    tabIndex='-1'
                    style={{
                        outline: 0,
                    }}
                >
                    <input
                        aria-label={this.props.ariaLabel}
                        role='complementary'
                        type='range'
                        min='0'
                        max={this.props.fidelity}
                        value={this.state.value}
                        onChange={(e) => this.colourAndValue(parseInt(e.target.value))}
                        onTouchMove={(e) => this.ios(e)}
                        style={{
                            background: this.state.background,
                            width: this.props.length,
                        }}
                    />
                </div>
            </div>
        )
    }
}
