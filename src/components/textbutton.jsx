import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import style from '../scss/textbutton.module.scss'

const textColours = {
    neutral: '#CEE5E8',
    clicked: '#96AAAC',
    inactive: '#AFBABB',
    toggleOff: '#808080',
    toggleOffClicked: '#6C6C6C',
    toggleOffInactive: '#878787',
}

const bgGradients = {
    neutral:
        'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(76, 76, 76) 100%)',
    hover: 'linear-gradient(to top, rgb(51, 51, 51) 0%, rgb(81, 81, 81) 100%)',
    inactive:
        'linear-gradient(to top, rgb(138, 138, 138) 0%, rgb(151, 151, 151) 100%)',
}

export default class TextButton extends Component {
    static propTypes = {
        inactive: propTypes.bool,
        mode: propTypes.bool,
        value: propTypes.bool,
        text: propTypes.string,
        toggleText: propTypes.string,
        onClick: propTypes.func,
    }

    static defaultProps = {
        inactive: false,
        mode: false,
        value: false,
        text: 'Button',
        toggleText: 'Button On',
    }

    constructor(props) {
        super(props)
        this.state = {
            externMouseDown: false,
            mouseDown: false,
            hover: false,
            toggle: this.props.mode && this.props.value,
        }
        this.globalMouseDown = this.globalMouseDown.bind(this)
        this.globalMouseUp = this.globalMouseUp.bind(this)
    }

    componentDidUpdate(prevProps) {
        this.props.value !== prevProps.value &&
            this.setState({
                toggle: this.props.mode && this.props.value,
            })
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.globalMouseDown)
        window.addEventListener('mouseup', this.globalMouseUp)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.globalMouseDown)
        window.removeEventListener('mouseup', this.globalMouseUp)
    }

    globalMouseDown = (e) => {
        if (!this.props.inactive) {
            const rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
            if (
                e.clientX > rect.left &&
                e.clientX < rect.right &&
                e.clientY > rect.top &&
                e.clientY < rect.bottom
            ) {
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

    globalMouseUp = () => {
        this.setState({ externMouseDown: false, mouseDown: false })
    }

    render() {
        return (
            <div
                className={style.textbutton}
                aria-label='textbutton'
                role='button'
                {...(this.props.mode && {
                    'aria-pressed': this.state.toggle,
                })}
                style={{
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
                    background: !this.props.inactive
                        ? this.state.hover && !this.state.externMouseDown
                            ? bgGradients.hover
                            : bgGradients.neutral
                        : bgGradients.inactive,
                }}
                onClick={() =>
                    !this.props.inactive &&
                    this.setState(
                        {
                            toggle: this.props.mode
                                ? !this.state.toggle
                                : false,
                        },
                        () => {
                            if (this.props.onClick) {
                                this.props.mode
                                    ? this.props.onClick(this.state.toggle)
                                    : this.props.onClick()
                            }
                        }
                    )
                }
                onMouseEnter={() =>
                    !this.props.inactive &&
                    this.setState({
                        hover: true,
                    })
                }
                onMouseLeave={() =>
                    !this.props.inactive &&
                    this.setState({
                        hover: false,
                    })
                }
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
            </div>
        )
    }
}
