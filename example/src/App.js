// dependencies
import * as MaxMSP from 'maxmsp-gui'

const App = () => {
	const iframe = window !== window.top
	if (!iframe) {
		document.body.style.background = 'transparent'
	}

	return (
		<main>
			{!iframe && <h2>React component library for stylised Max MSP GUI</h2>}
			<MaxMSP.Bang />
			{/* <MaxMSP.Ezdac onClick={(b) => console.log(b)} value={this.state.toggle} />
				<MaxMSP.Message text='text' onClick={() => this.setState({ toggle: !this.state.toggle })} />
				<MaxMSP.Object text='text' inactive={true} /> */}
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
				/> */}
			{/* // 					<MaxMSP.RadioGroup />
				<MaxMSP.Slider /> */}
			{/* // 				<div className='textbuttons'>
 					<MaxMSP.TextButton mode={false} />
 					<MaxMSP.TextButton mode={true} />
 				</div>
 				<MaxMSP.Toggle />
 				<MaxMSP.Umenu items={['foo', 'bar']} /> */}
		</main>
	)
}

export default App
