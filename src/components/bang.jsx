import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/bang.svg'
import style from '../scss/bang.module.scss'

export default class Bang extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        ariaPressed: propTypes.bool,
        onClick: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'bang',
        ariaPressed: null,
        onClick: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            clicked: false,
        }
        this.touchstart.bind(this)
        this.buttonFreed.bind(this)
    }

    componentDidMount() {
        const button = ReactDOM.findDOMNode(this)
        button.addEventListener('touchstart', this.touchstart)
        window.addEventListener('mouseup', this.buttonFreed)
    }

    componentWillUnmount() {
        const button = ReactDOM.findDOMNode(this)
        button.removeEventListener('touchstart', this.touchstart)
        window.removeEventListener('mouseup', this.buttonFreed)
    }

    touchstart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            this.buttonPressed()
        }
    }

    buttonPressed = () => this.setState({ clicked: true }, () => this.props.onClick())

    buttonFreed = () => this.setState({ clicked: false })

    render() {
        return (
            <div
                className={style.bang}
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
                onTouchEnd={() => this.buttonFreed()}
                onTouchCancel={() => this.buttonFreed()}
            >
                <SVG
                    tabIndex='-1'
                    style={{
                        outline: 0,
                        background: this.state.clicked
                            ? 'radial-gradient(10px circle at center, #cee5e8 50%, #333333 50%)'
                            : '#333333',
                    }}
                />
            </div>
        )
    }
}
