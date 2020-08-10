import React, { Component } from 'react'
import propTypes from 'prop-types'
import { ReactComponent as SVG } from '../svg/bang.svg'
import style from '../css/bang.module.scss'

export default class Bang extends Component {
  static propTypes = {
    onClick: propTypes.func
  }

  render() {
    return (
      <div className={style.bang} onMouseDown={this.props.onClick}>
        <SVG />
      </div>
    )
  }
}
