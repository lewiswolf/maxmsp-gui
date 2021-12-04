import React, { Component } from 'react';
import iframeResizer from 'iframe-resizer/js/iframeResizer.contentWindow.js';
import * as MaxMSP from 'maxmsp-gui'

window.iframeResizer = iframeResizer;

export default class App extends Component {
	state = {
		playing: false,
		playbar: 0,
		iframe: window !== window.top,
	}

	render() {
		return (
			<main>
				{!this.state.iframe && <h2>React component library for stylised Max MSP GUI</h2>}
				<MaxMSP.Bang />
				{/* <MaxMSP.Ezdac />
				<MaxMSP.Message text='text' />
				<MaxMSP.Object text='text' /> */}
				{/* <MaxMSP.Playbar
					isPlaying={(bool) => {
						if (bool) {
							this.interval = setInterval(() => {
								if (this.state.playbar + 100 / 500 <= 100) {
									this.setState({ playbar: this.state.playbar + 100 / 500, playing: true })
								} else {
									clearInterval(this.interval)
									this.setState({
										playbar: 0,
										playing: false,
									})
								}
							}, 10)
						} else {
							clearInterval(this.interval)
							this.setState({ playing: bool })
						}
					}}
					setPlaying={this.state.playing}
					value={this.state.playbar}
					onChange={(i) => this.setState({ playbar: i })}
				/>
				<MaxMSP.RadioGroup />
				<MaxMSP.Slider />
				<div className='textbuttons'>
					<MaxMSP.TextButton mode={false} />
					<MaxMSP.TextButton mode={true} />
				</div> */}
				{/* <MaxMSP.Toggle /> */}
				{/* <MaxMSP.Umenu items={['foo', 'bar']} /> */}
			</main>
		)
	}
}
