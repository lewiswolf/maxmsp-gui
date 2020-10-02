import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/radiogroup-row.svg'
import style from '../scss/radiogroup.module.scss'

export default class RadioGroup extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        items: propTypes.array,
        spacing: propTypes.number,
        value: propTypes.number,
        onClick: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'radiogroup',
        items: ['', ''],
        spacing: 20,
        value: 0,
        onClick: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            focus: 1,
            index: this.props.value,
        }
        this.touchstart.bind(this)
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).addEventListener('touchstart', this.touchstart)
    }

    componentWillUnmount() {
        ReactDOM.findDOMNode(this).removeEventListener('touchstart', this.touchstart)
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                index: this.props.value,
            })
        }
    }

    touchstart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            let t
            ReactDOM.findDOMNode(this).childNodes.forEach((button, i) => {
                let b = button.getBoundingClientRect()
                if (e.targetTouches[0].clientY > b.top && e.targetTouches[0].clientY < b.bottom) {
                    t = i + 1
                }
            })
            this.togglePressed(t)
        }
    }

    togglePressed = (i) => {
        this.setState(
            {
                index: i !== this.state.index ? i : 0,
            },
            () => this.props.onClick(this.state.index)
        )
    }

    render() {
        return (
            <div className={style.radiogroup} role='radiogroup' aria-label={this.props.ariaLabel} tabIndex='0'>
                {this.props.items.map((item, i) => {
                    i++
                    return (
                        <div
                            key={i}
                            {...(item !== '' && { 'aria-label': item })}
                            aria-checked={i === this.state.index}
                            role='radio'
                            tabIndex={i === 1 ? '0' : '-1'}
                            onMouseDown={(e) => e.button === 0 && this.togglePressed(i)}
                            onKeyDown={(e) => {
                                switch (e.key) {
                                    case 'Enter':
                                    case ' ':
                                        e.preventDefault()
                                        this.togglePressed(i)
                                        break
                                    case 'Up':
                                    case 'ArrowUp':
                                    case 'Down':
                                    case 'ArrowDown':
                                        e.preventDefault()
                                        let newFocus =
                                            this.state.focus + (e.key === 'Up' || e.key === 'ArrowUp' ? -1 : 1)
                                        if (newFocus === this.props.items.length) {
                                            newFocus = 0
                                        } else if (newFocus < 0) {
                                            newFocus = this.props.items.length - 1
                                        }
                                        ReactDOM.findDOMNode(this).childNodes[newFocus].focus()
                                        break
                                    default:
                                        break
                                }
                            }}
                            onFocus={() =>
                                this.setState({
                                    focus: i - 1,
                                })
                            }
                            style={{
                                height: this.props.spacing > 16 ? `${this.props.spacing}px` : '16px',
                            }}
                        >
                            {item && (
                                <p
                                    tabIndex='-1'
                                    style={{
                                        lineHeight: this.props.spacing > 16 ? `${this.props.spacing}px` : '16px',
                                        paddingRight: item ? '10px' : 0,
                                        outline: 0,
                                    }}
                                >
                                    {item}
                                </p>
                            )}
                            <div
                                tabIndex='-1'
                                style={{
                                    background:
                                        i === this.state.index
                                            ? 'radial-gradient(18px circle at center,#cee5e8 50%,#333333 50%)'
                                            : 'radial-gradient(18px circle at center,#595959 50%,#333333 50%)',
                                    outline: 0,
                                }}
                            >
                                <SVG />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
