import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/toggle.svg'
import style from '../scss/toggle.module.scss'

export default class Toggle extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        value: propTypes.bool,
        onClick: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'toggle',
        value: false,
        onClick: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            toggle: this.props.value,
        }
        this.touchstart.bind(this)
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).addEventListener(
            'touchstart',
            this.touchstart
        )
    }

    componentWillUnmount() {
        ReactDOM.findDOMNode(this).removeEventListener(
            'touchstart',
            this.touchstart
        )
    }

    componentDidUpdate(prevProps) {
        prevProps.value !== this.props.value &&
            this.setState({
                toggle: this.props.value,
            })
    }

    touchstart = (e) => {
        e.preventDefault()
        this.togglePressed()
    }

    togglePressed = () =>
        this.setState(
            {
                toggle: !this.state.toggle,
            },
            () => this.props.onClick(this.state.toggle)
        )

    render() {
        return (
            <div
                className={style.toggle}
                aria-label={this.props.ariaLabel}
                role='switch'
                aria-checked={this.state.toggle}
                tabIndex='0'
                onMouseDown={(e) => e.button === 0 && this.togglePressed()}
                onKeyDown={(e) => e.key === 'Enter' && this.togglePressed()}
            >
                <SVG
                    tabIndex='-1'
                    style={{
                        outline: 0,
                        background: this.state.toggle
                            ? 'radial-gradient(22px circle at center,#cee5e8 50%,#333333 50%)'
                            : '#595959',
                    }}
                />
            </div>
        )
    }
}
