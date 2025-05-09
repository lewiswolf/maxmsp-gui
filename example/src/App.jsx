// dependencies
import { useEffect, useRef, useState } from 'react'
import * as MaxMSP from 'maxmsp-gui'

export default function App() {
	// handle iframe styles
	const iframe = window !== window.top

	// example playbar animation
	const [playbar, setPlaybar] = useState(0)
	const [playing, setPlaying] = useState(false)
	const interval = useRef(null)
	useEffect(() => {
		if (playing) {
			interval.current = window.setInterval(() => {
				if (playbar <= 0.995) {
					setPlaybar(playbar + 0.005)
				} else {
					setPlaybar(0)
					setPlaying(false)
					return () => {
						window.clearInterval(interval.current)
					}
				}
			}, 10)
		}
		return () => {
			window.clearInterval(interval.current)
		}
	}, [playing, playbar])

	// render page
	return (
		<>
			{!iframe && <h2>React component library for stylised Max MSP GUI</h2>}
			<MaxMSP.Bang />
			<MaxMSP.Ezdac />
			<MaxMSP.Message text='text' />
			<MaxMSP.Object text='text' />
			<MaxMSP.Playbar
				setPlaying={playing}
				setValue={playbar}
				onChange={(x) => {
					setPlaybar(x)
				}}
				onPlay={(bool) => {
					setPlaying(bool)
				}}
			/>
			<MaxMSP.RadioGroup />
			<MaxMSP.Slider />
			<div className='textbuttons'>
				<MaxMSP.TextButton mode={false} />
				<MaxMSP.TextButton mode={true} />
			</div>
			<MaxMSP.Toggle />
			<MaxMSP.Umenu items={['foo', 'bar']} />
		</>
	)
}
