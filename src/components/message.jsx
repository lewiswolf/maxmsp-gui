import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../scss/message.module.scss'

export default class Message extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        text: propTypes.string,
        onClick: propTypes.func,
    }

    static defaultProps = {
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
        window.addEventListener('mouseup', this.buttonFreed)
    }

    componentWillUnmount() {
        const button = ReactDOM.findDOMNode(this)
        button.removeEventListener('touchstart', this.touchstart)
        button.removeEventListener('touchend', this.touchend)
        window.removeEventListener('mouseup', this.buttonFreed)
    }

    touchstart = (e) => {
        e.preventDefault()
        this.buttonPressed()
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
                role='button'
                tabIndex='0'
                onMouseDown={(e) => e.button === 0 && this.buttonPressed()}
                onKeyDown={(e) => e.key === 'Enter' && this.buttonPressed()}
                onKeyUp={(e) => e.key === 'Enter' && this.buttonFreed()}
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