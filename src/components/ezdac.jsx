import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/ezdac.svg'
import style from '../scss/ezdac.module.scss'

export default class Ezdac extends Component {
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
                className={style.ezdac}
                aria-label='ezdac'
                role='button'
                aria-pressed={this.state.toggle}
                onMouseDown={() =>
                    this.setState(
                        { toggle: !this.state.toggle },
                        () =>
                            this.props.onClick &&
                            this.props.onClick(this.state.toggle)
                    )
                }
            >
                <SVG
                    style={{
                        background: this.state.toggle ? '#CEE5E8' : '#595959',
                    }}
                />
            </div>
        )
    }
}
