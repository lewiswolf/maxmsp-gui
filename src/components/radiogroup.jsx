import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/radiogroup-row.svg'
import style from '../scss/radiogroup.module.scss'

export default class RadioGroup extends Component {
    static propTypes = {
        items: propTypes.array,
        value: propTypes.number,
        spacing: propTypes.number,
        onClick: propTypes.func,
    }

    static defaultProps = {
        items: ['', ''],
        value: 0,
        spacing: 20,
    }

    state = {
        index: this.props.value,
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                index: this.props.value,
            })
        }
    }

    render() {
        return (
            <div className={style.radiogroup}>
                {this.props.items.map((item, i) => {
                    i++
                    return (
                        <li
                            key={i}
                            onMouseDown={() => {
                                this.setState(
                                    {
                                        index: i !== this.state.index ? i : 0,
                                    },
                                    () => {
                                        this.props.onClick &&
                                            this.props.onClick(this.state.index)
                                    }
                                )
                            }}
                            style={{
                                height:
                                    this.props.spacing > 16
                                        ? `${this.props.spacing}px`
                                        : '16px',
                            }}
                        >
                            <p
                                style={{
                                    paddingRight: item ? '10px' : 0,
                                    lineHeight:
                                        this.props.spacing > 16
                                            ? `${this.props.spacing}px`
                                            : '16px',
                                }}
                            >
                                {item}
                            </p>
                            <div>
                                <SVG
                                    style={{
                                        background:
                                            i === this.state.index
                                                ? 'radial-gradient(18px circle at center,#cee5e8 50%,#333333 50%)'
                                                : 'radial-gradient(18px circle at center,#595959 50%,#333333 50%)',
                                    }}
                                />
                            </div>
                        </li>
                    )
                })}
            </div>
        )
    }
}
