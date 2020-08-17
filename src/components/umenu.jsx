import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/umenu-arrow.svg'
import style from '../scss/umenu.module.scss'

export default class Umenu extends Component {
    static propTypes = {
        items: propTypes.array,
        width: propTypes.number,
        initial: propTypes.number,
        outputSymbol: propTypes.bool,
        onChange: propTypes.func,
    }

    static defaultProps = {
        items: [],
        width: 100,
        initial: 0,
        outputSymbol: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            active:
                this.props.initial < this.props.items.length &&
                this.props.initial >= 0
                    ? this.props.initial
                    : 0,
            dropdownDisplay: false,
            focus: null,
            objectWidth: this.props.width >= 50 ? this.props.width : 50,
            dropdownWidth: null,
        }
        this.isNotInViewport.bind(this)
        this.responsiveDropdown.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.isNotInViewport)
        window.addEventListener('resize', this.responsiveDropdown)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.isNotInViewport)
        window.removeEventListener('resize', this.responsiveDropdown)
    }

    isNotInViewport = () => {
        if (this.state.dropdownDisplay) {
            const umenuDim = ReactDOM.findDOMNode(this).getBoundingClientRect()
            const dropdownDim = ReactDOM.findDOMNode(
                this
            ).children[2].getBoundingClientRect()
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
                ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect()
                    .right -
                ReactDOM.findDOMNode(this).getBoundingClientRect().left
            const dropdown = ReactDOM.findDOMNode(this).children[2]
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

    changeSelected = () => {
        if (this.state.active !== this.state.focus) {
            this.setState(
                {
                    active: this.state.focus,
                    dropdownDisplay: false,
                },
                () => {
                    this.props.onChange &&
                        this.props.onChange(
                            this.props.outputSymbol
                                ? this.props.items[this.state.active]
                                : this.state.active
                        )
                }
            )
        } else {
            this.setState({
                dropdownDisplay: false,
            })
        }
    }

    render() {
        console.log(this.state)
        return (
            <div
                className={style.umenu}
                style={{ width: `${this.state.objectWidth}px` }}
                {...(this.props.items.length > 0 && {
                    'aria-label': 'umenu',
                    role: 'button',
                    'aria-pressed': this.state.dropdownDisplay,
                    onMouseDown: () =>
                        this.setState(
                            {
                                dropdownDisplay: !this.state.dropdownDisplay,
                                focus: null,
                            },
                            () => this.responsiveDropdown()
                        ),
                    onKeyDown: (e) => {
                        if (this.state.dropdownDisplay) {
                            switch (e.keyCode) {
                                case 9: // tab
                                    e.preventDefault()
                                    break
                                case 13: // return
                                    e.preventDefault()
                                    this.changeSelected()
                                    break
                                case 27: // escape
                                    e.preventDefault()
                                    this.setState({
                                        dropdownDisplay: false,
                                        focus: null,
                                    })
                                    break
                                case 38: // up
                                case 40: // down
                                    e.preventDefault()
                                    if (this.state.focus !== null) {
                                        this.setState({
                                            focus:
                                                (this.state.focus +
                                                    this.props.items.length +
                                                    (e.keyCode === 38
                                                        ? -1
                                                        : 1)) %
                                                this.props.items.length,
                                        })
                                    } else {
                                        this.setState({
                                            focus:
                                                e.keyCode === 38
                                                    ? this.props.items.length -
                                                      1
                                                    : 1,
                                        })
                                    }
                                    break
                                default:
                                    break
                            }
                        }
                    },
                    onBlur: () => {
                        if (this.state.dropdownDisplay) {
                            this.setState({
                                dropdownDisplay: false,
                                focus: null,
                            })
                        }
                    },
                    tabIndex: '0',
                })}
            >
                <p>{this.props.items && this.props.items[this.state.active]}</p>
                <SVG />
                <div
                    className={style.umenudropdown}
                    style={{
                        display:
                            this.state.dropdownDisplay &&
                            this.props.items.length > 0
                                ? 'block'
                                : 'none',
                        width: this.state.dropdownWidth,
                        whiteSpace:
                            this.state.dropdownWidth === 'fit-content'
                                ? 'nowrap'
                                : 'normal',
                    }}
                >
                    <ul>
                        {this.props.items.map((item, i) => {
                            return (
                                <li
                                    key={i}
                                    aria-label='umenu list item'
                                    role='button'
                                    aria-pressed={
                                        this.props.items[this.state.active] ===
                                        item
                                    }
                                    style={{
                                        background:
                                            this.state.focus === i
                                                ? '#4c4c4c'
                                                : 'inherit',
                                    }}
                                    onMouseEnter={() =>
                                        this.setState({ focus: i })
                                    }
                                    onMouseLeave={() =>
                                        this.setState({ focus: null })
                                    }
                                    onMouseDown={() => this.changeSelected()}
                                >
                                    {item}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}
