import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/toggle.svg'
import style from '../scss/toggle.module.scss'

export default class Toggle extends Component {
    static propTypes = {
        value: propTypes.bool,
        onClick: propTypes.func,
    }

    static defaultProps = {
        value: false,
    }

    state = {
        toggle: this.props.value,
    }

    componentDidUpdate(prevProps) {
        prevProps.value !== this.props.value &&
            this.setState({
                toggle: this.props.value,
            })
    }

    render() {
        return (
            <div
                className={style.toggle}
                aria-label='toggle'
                role='button'
                aria-pressed={this.state.toggle}
                onMouseDown={() => {
                    this.setState(
                        {
                            toggle: !this.state.toggle,
                        },
                        () =>
                            this.props.onClick &&
                            this.props.onClick(this.state.toggle)
                    )
                }}
            >
                <SVG
                    style={{
                        background: this.state.toggle
                            ? 'radial-gradient(22px circle at center,#cee5e8 50%,#333333 50%)'
                            : '#595959',
                    }}
                />
            </div>
        )
    }
}
