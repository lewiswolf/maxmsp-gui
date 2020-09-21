import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../scss/message.module.scss'

export default class Message extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        ariaPressed: propTypes.bool,
        text: propTypes.string,
        onClick: propTypes.func,
    }

    static defaultProps = {
        ariaPressed: null,
        ariaLabel: 'message',
        text: '',
        onClick: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            clicked: false,
        }
        this.buttonFreed.bind(this)
        this.touchstart.bind(this)
        this.touchend.bind(this)
    }

    componentDidMount() {
        const button = ReactDOM.findDOMNode(this)
        button.addEventListener('touchstart', this.touchstart)
        button.addEventListener('touchend', this.touchend)
        button.addEventListener('touchcancel', this.touchend)
        window.addEventListener('mouseup', this.buttonFreed)
    }

    componentWillUnmount() {
        const button = ReactDOM.findDOMNode(this)
        button.removeEventListener('touchstart', this.touchstart)
        button.removeEventListener('touchend', this.touchend)
        button.removeEventListener('touchcancel', this.touchend)
        window.removeEventListener('mouseup', this.buttonFreed)
    }

    touchstart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            this.buttonPressed()
        }
    }

    touchend = (e) => {
        e.preventDefault()
        this.buttonFreed()
    }

    buttonPressed = () =>
        this.setState({ clicked: true }, () => this.props.onClick())

    buttonFreed = () => this.setState({ clicked: false })

    render() {
        return (
            <div
                className={style.message}
                aria-label={this.props.ariaLabel}
                {...(this.props.ariaPressed !== null && {
                    'aria-pressed': this.props.ariaPressed,
                })}
                role='button'
                tabIndex='0'
                onMouseDown={(e) => e.button === 0 && this.buttonPressed()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        this.buttonPressed()
                    }
                }}
                onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        this.buttonFreed()
                    }
                }}
            >
                <p
                    tabIndex='-1'
                    style={{
                        outline: 0,
                        padding: this.state.clicked
                            ? '6px 4px 4px 6px'
                            : '5px 5px',
                    }}
                >
                    {this.props.text}
                </p>
            </div>
        )
    }
}
