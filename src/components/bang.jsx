import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/bang.svg'
import style from '../scss/bang.module.scss'

export default class Bang extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        onClick: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'bang',
        onClick: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            clicked: false,
        }
        this.touchstart.bind(this)
        this.touchend.bind(this)
        this.buttonFreed.bind(this)
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
                className={style.bang}
                aria-label={this.props.ariaLabel}
                role='button'
                tabIndex='0'
                onMouseDown={(e) => e.button === 0 && this.buttonPressed()}
                onKeyDown={(e) => e.key === 'Enter' && this.buttonPressed()}
                onKeyUp={(e) => e.key === 'Enter' && this.buttonFreed()}
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
