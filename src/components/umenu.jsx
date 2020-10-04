import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/umenu-arrow.svg'
import style from '../scss/umenu.module.scss'

export default class Umenu extends Component {
    static propTypes = {
        ariaLabel: propTypes.string,
        items: propTypes.array,
        outputSymbol: propTypes.bool,
        width: propTypes.number,
        value: propTypes.number,
        onChange: propTypes.func,
    }

    static defaultProps = {
        ariaLabel: 'umenu',
        items: [],
        outputSymbol: false,
        width: 100,
        value: 0,
        onChange: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            active: this.props.value < this.props.items.length && this.props.value >= 0 ? this.props.value : 0,
            dropdownDisplay: false,
            dropdownWidth: null,
            focus: null,
            objectWidth: this.props.width >= 50 ? this.props.width : 50,
        }
        this.customBlur.bind(this)
        this.isNotInViewport.bind(this)
        this.listTouchStart.bind(this)
        this.responsiveDropdown.bind(this)
        this.toggleTouchStart.bind(this)
    }

    componentDidMount() {
        const toggle = ReactDOM.findDOMNode(this).childNodes[0]
        const list = ReactDOM.findDOMNode(this).childNodes[1]
        toggle.addEventListener('touchstart', this.toggleTouchStart)
        list.addEventListener('touchstart', this.listTouchStart)
        window.addEventListener('mousedown', this.customBlur)
        window.addEventListener('resize', this.responsiveDropdown)
        window.addEventListener('scroll', this.isNotInViewport)
    }

    componentWillUnmount() {
        const toggle = ReactDOM.findDOMNode(this).childNodes[0]
        const list = ReactDOM.findDOMNode(this).childNodes[1]
        toggle.removeEventListener('touchstart', this.toggleTouchStart)
        list.removeEventListener('touchstart', this.listTouchStart)
        window.removeEventListener('mousedown', this.customBlur)
        window.removeEventListener('resize', this.responsiveDropdown)
        window.removeEventListener('scroll', this.isNotInViewport)
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ active: this.props.value })
        }
    }

    toggleTouchStart = (e) => {
        if (e.cancelable) {
            e.preventDefault()
            this.openDropdown(null)
        }
    }

    openDropdown = (focus) =>
        this.setState(
            {
                dropdownDisplay: !this.state.dropdownDisplay,
                focus,
            },
            () => {
                if (this.state.dropdownDisplay) {
                    this.responsiveDropdown()
                    this.state.focus !== null &&
                        ReactDOM.findDOMNode(this).childNodes[1].childNodes[this.state.focus].focus()
                }
            }
        )

    isNotInViewport = () => {
        if (this.state.dropdownDisplay) {
            const umenuDim = ReactDOM.findDOMNode(this).getBoundingClientRect()
            const dropdownDim = ReactDOM.findDOMNode(this).childNodes[1].getBoundingClientRect()
            if (
                umenuDim.top > window.innerHeight ||
                dropdownDim.bottom < 0 ||
                umenuDim.left > window.innerWidth ||
                Math.max(umenuDim.right, dropdownDim.right) < 0
            ) {
                this.setState({ dropdownDisplay: false, focus: null })
            }
        }
    }

    responsiveDropdown = () => {
        if (this.state.dropdownDisplay) {
            const maxWidth =
                ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect().right -
                ReactDOM.findDOMNode(this).getBoundingClientRect().left
            const dropdown = ReactDOM.findDOMNode(this).childNodes[1]
            this.setState(
                {
                    dropdownWidth: 'fit-content',
                },
                () => {
                    if (maxWidth < dropdown.offsetWidth) {
                        this.setState({ dropdownWidth: `${maxWidth - 2}px` })
                    }
                }
            )
        }
    }

    arrowKeys = (c) => {
        if (this.state.focus !== null) {
            this.setState(
                {
                    focus: (this.state.focus + this.props.items.length + c) % this.props.items.length,
                },
                () => ReactDOM.findDOMNode(this).childNodes[1].childNodes[this.state.focus].focus()
            )
        } else {
            this.setState(
                {
                    focus: c === -1 ? this.props.items.length - 1 : 0,
                },
                () => ReactDOM.findDOMNode(this).childNodes[1].childNodes[this.state.focus].focus()
            )
        }
    }

    listTouchStart = (e) => {
        if (e.cancelable) {
            let t
            ReactDOM.findDOMNode(this).childNodes[1].childNodes.forEach((button, i) => {
                let b = button.getBoundingClientRect()
                if (e.targetTouches[0].clientY > b.top && e.targetTouches[0].clientY < b.bottom) {
                    t = i
                }
            })
            this.setState({ focus: t })
        }
    }

    changeSelected = (aria = false) =>
        this.setState(
            {
                active: this.state.focus !== null ? this.state.focus : 1,
                dropdownDisplay: false,
            },
            () => {
                this.props.onChange(this.props.outputSymbol ? this.props.items[this.state.active] : this.state.active)
                aria && ReactDOM.findDOMNode(this).focus()
            }
        )

    customBlur = (e) => {
        const umenuDim = ReactDOM.findDOMNode(this).getBoundingClientRect()
        const dropdownDim = ReactDOM.findDOMNode(this).childNodes[1].getBoundingClientRect()
        if (
            !this.state.dropdownDisplay &&
            e.clientX > umenuDim.left &&
            e.clientX < umenuDim.right &&
            e.clientY > umenuDim.top &&
            e.clientY < umenuDim.bottom
        ) {
            return
        } else if (this.state.dropdownDisplay) {
            if (
                e.clientX > umenuDim.left &&
                e.clientX < umenuDim.right &&
                e.clientY > umenuDim.top &&
                e.clientY < umenuDim.bottom
            ) {
                return
            } else if (
                e.clientX > dropdownDim.left &&
                e.clientX < dropdownDim.right &&
                e.clientY > dropdownDim.top &&
                e.clientY < dropdownDim.bottom
            ) {
                return
            } else {
                this.setState({ dropdownDisplay: false, focus: null }, () => ReactDOM.findDOMNode(this).blur())
            }
        } else {
            ReactDOM.findDOMNode(this).blur()
        }
    }

    render() {
        return (
            <div
                className={style.umenu}
                style={{ width: `${this.state.objectWidth}px` }}
                {...(this.props.items.length > 0 && {
                    'aria-label': `${this.props.ariaLabel}: ${this.props.items[this.state.active]} selected`,
                    'aria-expanded': this.state.dropdownDisplay,
                    'aria-haspopup': 'listbox',
                    role: 'button',
                    tabIndex: '0',
                    onKeyDown: (e) => {
                        switch (e.key) {
                            case 'Enter':
                                e.preventDefault()
                                this.state.dropdownDisplay
                                    ? this.state.focus !== null
                                        ? this.changeSelected(true)
                                        : this.openDropdown(null)
                                    : this.openDropdown(0)
                                break
                            case 'Esc':
                            case 'Escape':
                                e.preventDefault()
                                this.setState({
                                    dropdownDisplay: false,
                                    focus: null,
                                })
                                ReactDOM.findDOMNode(this).focus()
                                break
                            case 'Home':
                            case 'End':
                                e.preventDefault()
                                this.setState({ focus: e.key === 'Home' ? 0 : this.props.items.length - 1 }, () =>
                                    ReactDOM.findDOMNode(this).childNodes[1].childNodes[this.state.focus].focus()
                                )
                                break
                            case 'Up':
                            case 'ArrowUp':
                                e.preventDefault()
                                this.state.dropdownDisplay && this.arrowKeys(-1)
                                break
                            case 'Down':
                            case 'ArrowDown':
                                e.preventDefault()
                                this.state.dropdownDisplay && this.arrowKeys(1)
                                break
                            default:
                                break
                        }
                    },
                })}
            >
                <div tabIndex='-1' onMouseDown={(e) => e.button === 0 && this.openDropdown(null)}>
                    {this.props.items && <p>{this.props.items[this.state.active]}</p>}
                    <SVG />
                </div>
                <ul
                    aria-label={`${this.props.ariaLabel}: ${this.props.items[this.state.active]} selected`}
                    role='listbox'
                    tabIndex='-1'
                    style={{
                        display: this.state.dropdownDisplay && this.props.items.length > 0 ? 'block' : 'none',
                        width: this.state.dropdownWidth,
                        whiteSpace: this.state.dropdownWidth === 'fit-content' ? 'nowrap' : 'normal',
                    }}
                >
                    {this.props.items.map((item, i) => {
                        return (
                            <li
                                key={i}
                                {...(i === this.state.active && { 'aria-selected': true })}
                                role='option'
                                tabIndex='-1'
                                onMouseEnter={() => this.setState({ focus: i })}
                                onMouseLeave={() => this.setState({ focus: null })}
                                onClick={() => this.changeSelected()}
                                onTouchEnd={() =>
                                    this.setState({
                                        focus: null,
                                    })
                                }
                                style={{
                                    background: this.state.focus === i ? '#4c4c4c' : 'inherit',
                                    outline: 0,
                                }}
                            >
                                {item}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
