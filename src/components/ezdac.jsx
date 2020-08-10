import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/ezdac.svg'
import style from '../css/ezdac.module.scss'

export default class Ezdac extends Component {
    static propTypes = {
        initial: propTypes.bool,
        onClick: propTypes.func,
    }

    static defaultProps = {
        initial: false,
    }

    state = {
        toggle: this.props.initial,
    }

    handleClick = () => {
        this.setState(
            { toggle: !this.state.toggle },
            () => this.props.onClick && this.props.onClick(this.state.toggle)
        )
    }

    render() {
        return (
            <div className={style.ezdac} onMouseDown={() => this.handleClick()}>
                <SVG
                    style={{
                        background: this.state.toggle ? '#CEE5E8' : '#595959',
                    }}
                />
            </div>
        )
    }
}
