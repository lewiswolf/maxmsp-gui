// biome-ignore-all lint/performance/noJsxPropsBind : this example file doesn't require this design pattern
// biome-ignore-all lint/performance/noNamespaceImport : allowed here for clarity of example
// biome-ignore-all lint/style/noJsxLiterals : template literals are used for the production website

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
					setPlaying(false)
					setPlaybar(0)
					window.clearInterval(interval.current)
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
				isPlaying={playing}
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
			<div>
				<MaxMSP.TextButton mode={false} />
				<MaxMSP.TextButton mode={true} />
			</div>
			<MaxMSP.Toggle />
			<MaxMSP.Umenu items={['foo', 'bar']} />
		</>
	)
}
