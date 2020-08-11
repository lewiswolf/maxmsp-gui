import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/radiogroup-row.svg'
import style from '../scss/radiogroup.module.scss'

export default class RadioGroup extends Component {
    static propTypes = {
        items: propTypes.array,
        initial: propTypes.number,
        spacing: propTypes.number,
        onClick: propTypes.func,
    }

    static defaultProps = {
        items: ['', ''],
        initial: 0,
        spacing: 20,
    }

    state = {
        index: this.props.initial,
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
                                                ? '#CEE5E8'
                                                : '#595959',
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
