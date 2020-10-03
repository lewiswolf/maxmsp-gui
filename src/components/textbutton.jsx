import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../scss/textbutton.module.scss'

const textColours = {
    neutral: '#cee5e8',
    clicked: '#96aaac',
    inactive: '#afbabb',
    toggleOff: '#808080',
    toggleOffClicked: '#6c6c6c',
    toggleOffInactive: '#878787',
}

const bgGradients = {
    neutral: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)',
    hover: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(81, 81, 81) 100%)',
    inactive: 'linear-gradient(to top, rgb(138, 138, 138) 0%, rgb(151, 151, 151) 100%)',
}

export default class TextButton extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        ariaPressed: propTypes.bool,
        inactive: propTypes.bool,
        mode: propTypes.bool,
        text: propTypes.string,
        toggleText: propTypes.string,
        value: propTypes.bool,
        onClick: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'textbutton',
        ariaPressed: null,
        inactive: false,
        mode: false,
        text: 'Button',
        toggleText: 'Button On',
        value: false,
        onClick: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            externMouseDown: false,
            mouseDown: false,
            hover: false,
            toggle: this.props.mode && this.props.value,
        }
        this.globalMouseDown.bind(this)
        this.globalMouseUp.bind(this)
        this.touchstart.bind(this)
    }

    componentDidMount() {
        const button = ReactDOM.findDOMNode(this)
        window.addEventListener('mousedown', this.globalMouseDown)
        window.addEventListener('mouseup', this.globalMouseUp)
        button.addEventListener('touchstart', this.touchstart)
    }

    componentWillUnmount() {
        const button = ReactDOM.findDOMNode(this)
        window.removeEventListener('mousedown', this.globalMouseDown)
        window.removeEventListener('mouseup', this.globalMouseUp)
        button.removeEventListener('touchstart', this.touchstart)
    }

    componentDidUpdate(prevProps) {
        this.props.value !== prevProps.value &&
            this.setState({
                toggle: this.props.mode && this.props.value,
            })
    }

    globalMouseDown = (e) => {
        if (!this.props.inactive) {
            const rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
            if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                this.setState({
                    mouseDown: true,
                })
            } else {
                this.setState({
                    externMouseDown: true,
                })
            }
        }
    }

    globalMouseUp = () => this.setState({ externMouseDown: false, mouseDown: false })

    mouseHover = (bool) =>
        !this.props.inactive &&
        this.setState({
            hover: bool,
        })

    touchstart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            this.setState({
                hover: true,
                mouseDown: true,
            })
        }
    }

    touchend = () => {
        !this.props.inactive &&
            this.setState(
                {
                    mouseDown: false,
                    hover: false,
                    toggle: this.props.mode ? !this.state.toggle : false,
                },
                () => (this.props.mode ? this.props.onClick(this.state.toggle) : this.props.onClick())
            )
    }

    render() {
        return (
            <div
                className={style.textbutton}
                aria-label={this.props.ariaLabel}
                {...(!this.props.mode &&
                    this.props.ariaPressed !== null && {
                        'aria-pressed': this.props.ariaPressed,
                    })}
                {...(this.props.mode && {
                    'aria-checked': this.state.toggle,
                })}
                aria-disabled={this.props.inactive}
                aria-readonly={this.props.inactive}
                role={this.props.mode ? 'switch' : 'button'}
                tabIndex='0'
                onClick={() =>
                    !this.props.inactive &&
                    this.setState(
                        {
                            toggle: this.props.mode ? !this.state.toggle : false,
                        },
                        () => (this.props.mode ? this.props.onClick(this.state.toggle) : this.props.onClick())
                    )
                }
                onMouseEnter={() => this.mouseHover(true)}
                onMouseLeave={() => this.mouseHover(false)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        this.setState({
                            hover: true,
                            mouseDown: true,
                        })
                    }
                }}
                onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        this.setState(
                            {
                                hover: false,
                                mouseDown: false,
                                toggle: this.props.mode ? !this.state.toggle : false,
                            },
                            () => (this.props.mode ? this.props.onClick(this.state.toggle) : this.props.onClick())
                        )
                    }
                }}
                onTouchEnd={() => this.touchend()}
                onTouchCancel={() => this.touchend()}
                style={{
                    background: !this.props.inactive
                        ? this.state.hover && !this.state.externMouseDown
                            ? bgGradients.hover
                            : bgGradients.neutral
                        : bgGradients.inactive,
                }}
            >
                <p
                    tabIndex='-1'
                    style={{
                        outline: 0,
                        color: !this.props.inactive
                            ? this.state.mouseDown && this.state.hover
                                ? this.state.toggle
                                    ? this.props.mode
                                        ? textColours.toggleOffClicked
                                        : textColours.clicked
                                    : textColours.clicked
                                : this.state.toggle
                                ? textColours.neutral
                                : this.props.mode
                                ? textColours.toggleOff
                                : textColours.neutral
                            : this.state.toggle
                            ? textColours.inactive
                            : this.props.mode
                            ? textColours.toggleOffInactive
                            : textColours.inactive,
                    }}
                >
                    {this.props.mode
                        ? this.state.toggle
                            ? this.state.mouseDown && this.state.hover
                                ? this.props.text
                                : this.props.toggleText
                            : this.state.mouseDown && this.state.hover
                            ? this.props.toggleText
                            : this.props.text
                        : this.props.text}
                </p>
            </div>
        )
    }
}
