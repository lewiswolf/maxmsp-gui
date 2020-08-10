import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../css/slider.module.scss'

/*
	- could have an orientation option... 
		props would be 
			length (to replace width): {n-px} default 200
			orientation: { true for horizontal and false for vertical } default true
*/

const sliderColors = {
    positive: '#CEE5E8',
    negative: '#595959',
    off: '#818D8F',
}

export default class Slider extends Component {
    static propTypes = {
        value: propTypes.number,
        length: propTypes.number,
        onChange: propTypes.func,
    }

    static defaultProps = {
        value: 0,
        length: 200,
    }

    state = {
        value:
            this.props.value <= 100 && this.props.value >= 0
                ? this.props.value
                : 0,
        background: `linear-gradient(90deg, 
			${sliderColors.off}, 
			${sliderColors.off} 6px,
			${sliderColors.negative} 6px)`,
    }

    componentDidUpdate(prevProps) {
        this.props.value !== prevProps.value &&
            this.props.value <= 100 &&
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
                        (sliderWidth - 6) * (value / 100) - 1
                    }px, 
                        ${sliderColors.negative} ${
                        (sliderWidth - 6) * (value / 100) - 1
                    }px,
                        ${sliderColors.negative} ${
                        (sliderWidth - 6) * (value / 100)
                    }px,
                        ${sliderColors.positive} ${
                        (sliderWidth - 6) * (value / 100)
                    }px,
                        ${sliderColors.positive} ${
                        (sliderWidth - 6) * (value / 100) + 6
                    }px,
                        ${sliderColors.negative} ${
                        (sliderWidth - 6) * (value / 100) + 6
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
        if (
            touch.clientX < rect.x + (rect.width - 5) &&
            touch.clientX > rect.x + 5
        ) {
            this.colourAndValue(
                Math.round(
                    (touch.clientX - (rect.x + 5)) / ((rect.width - 10) / 100)
                )
            )
        }
    }

    render() {
        return (
            <div className={style.slider}>
                <input
                    type='range'
                    min='0'
                    max='100'
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
