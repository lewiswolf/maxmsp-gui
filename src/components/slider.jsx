import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../scss/slider.module.scss'

const sliderColors = {
    positive: '#CEE5E8',
    negative: '#595959',
    off: '#818D8F',
}

export default class Slider extends Component {
    static propTypes = {
        value: propTypes.number,
        fidelity: propTypes.number,
        length: propTypes.number,
        onChange: propTypes.func,
    }

    static defaultProps = {
        value: 0,
        fidelity: 100,
        length: 200,
    }

    state = {
        value:
            this.props.value <= this.props.fidelity && this.props.value >= 0
                ? this.props.value
                : 0,
        background: `linear-gradient(90deg, 
			${sliderColors.off}, 
			${sliderColors.off} 6px,
			${sliderColors.negative} 6px)`,
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
        const sliderWidth =
            ReactDOM.findDOMNode(this).getBoundingClientRect().width - 10
        if (value !== 0) {
            this.setState(
                {
                    value: value,
                    background: `linear-gradient(90deg,
                        ${sliderColors.negative}, 
                        ${sliderColors.negative} 0px, 
                        ${sliderColors.positive} 0px, 
                        ${sliderColors.positive} ${
                        (sliderWidth - 6) * (value / this.props.fidelity) - 1
                    }px, 
                        ${sliderColors.negative} ${
                        (sliderWidth - 6) * (value / this.props.fidelity) - 1
                    }px,
                        ${sliderColors.negative} ${
                        (sliderWidth - 6) * (value / this.props.fidelity)
                    }px,
                        ${sliderColors.positive} ${
                        (sliderWidth - 6) * (value / this.props.fidelity)
                    }px,
                        ${sliderColors.positive} ${
                        (sliderWidth - 6) * (value / this.props.fidelity) + 6
                    }px,
                        ${sliderColors.negative} ${
                        (sliderWidth - 6) * (value / this.props.fidelity) + 6
                    }px
                    )`,
                },
                () => {
                    this.props.onChange && this.props.onChange(this.state.value)
                }
            )
        } else {
            this.setState(
                {
                    value: 0,
                    background: `linear-gradient(90deg, ${sliderColors.off}, ${sliderColors.off} 6px, ${sliderColors.negative} 6px)`,
                },
                () => {
                    this.props.onChange && this.props.onChange(this.state.value)
                }
            )
        }
    }

    ios = (e) => {
        const rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
        const touch = e.targetTouches[0]
        if (touch.clientX < rect.right - 5 && touch.clientX > rect.left + 5) {
            this.colourAndValue(
                Math.round(
                    (touch.clientX - (rect.x + 5)) /
                        ((rect.width - 10) / this.props.fidelity)
                )
            )
        }
    }

    render() {
        return (
            <div className={style.slider}>
                <input
                    type='range'
                    aria-label='slider'
                    min='0'
                    max={this.props.fidelity}
                    value={this.state.value}
                    onChange={(e) =>
                        this.colourAndValue(parseInt(e.target.value))
                    }
                    onTouchMove={(e) => this.ios(e)}
                    style={{
                        background: this.state.background,
                        width: this.props.length,
                    }}
                />
            </div>
        )
    }
}
