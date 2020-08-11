import React, { Component } from 'react'
import propTypes from 'prop-types'
import style from '../scss/message.module.scss'

export default class Message extends Component {
    static propTypes = {
        text: propTypes.string,
        onClick: propTypes.func,
    }

    static defaultProps = {
        text: '',
    }

    render() {
        return (
            <div
                className={style.message}
                onMouseDown={() => this.props.onClick && this.props.onClick()}
            >
                <p>{this.props.text}</p>
            </div>
        )
    }
}
