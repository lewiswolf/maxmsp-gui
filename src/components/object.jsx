import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/inlet.svg'
import style from '../scss/object.module.scss'

export default class Object extends Component {
    static propTypes = {
        inactive: propTypes.bool,
        text: propTypes.string,
    }

    static defaultProps = {
        inactive: false,
        text: '',
    }

    render() {
        return (
            <div
                className={style.object}
                style={{
                    background: this.props.inactive ? '#b49d7c' : '#808080',
                }}
            >
                {!this.props.inactive && <SVG />}
                <p
                    style={{
                        background: this.props.inactive ? '#977e6d' : '#333333',
                    }}
                >
                    {this.props.text}
                </p>
            </div>
        )
    }
}
