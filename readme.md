# maxmsp-gui

## by Lewis Wolf

> React component library for a stylised Max GUI.

[![NPM](https://img.shields.io/npm/v/maxmsp-gui.svg)](https://www.npmjs.com/package/maxmsp-gui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### [Demo](https://lewiswolf.github.io/maxmsp-gui/)

## Install

```bash
npm i maxmsp-gui
```

## Usage

```tsx
import * as MaxMSP from 'maxmsp-gui'

export default function App() {
	return (
		<>
			<MaxMSP.Bang
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				ariaPressed={true || false} // default null
				onClick={() => console.log('bang')}
			/>

			<MaxMSP.Ezdac
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				onClick={(b: boolean) => console.log(b)}
				setValue={true || false} // set the current state
			/>

			<MaxMSP.Message
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				ariaPressed={true || false} // default null
				onClick={() => console.log('bang')}
				text='What does the message say?'
			/>

			<MaxMSP.Object
				inactive={true || false} // default false
				text='What is the object called?'
			/>

			<MaxMSP.Playbar
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				inactive={true || false} // disable user interaction, default false
				isPlaying={true || false} // set onPlay externally
				onChange={(x: number) => console.log(`My value is ${x}`)} // 0. - 1.
				onPlay={(b: boolean) => console.log(b)}
				setValue={0} // initial/updated state, 0. - 1.
				width={200} // width of the slider in pixels
			/>

			<MaxMSP.RadioGroup
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				items={['array', 'of', 'items']} // this sets the amount of radio buttons, strings create text alongside each button
				onClick={(i: number) => console.log(`My index is ${i}`)}
				setValue={0} // props.items[i]
				spacing={24} // the height of each button in pixels
			/>

			<MaxMSP.Slider
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				onChange={(x: number) => console.log(`My value is ${x}`)} // 0. - 1.
				setValue={0} // initial/updated state, 0. - 1.
				width={200} // width of the slider in pixels
			/>

			<MaxMSP.TextButton
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				ariaPressed={true || false} // default null, for button mode only
				inactive={true || false} // disable user interaction, default false
				mode={true || false} // true for toggle, false for bang, default false
				onChange={(b: boolean) => console.log(b)} // toggle mode only
				onClick={() => console.log('bang')}
				setValue={true || false} // default false, for toggle mode only
				text='What does the textbutton say?'
				toggleText='What does the toggled textbutton say?'
			/>

			<MaxMSP.Toggle
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				onClick={(b: boolean) => console.log(b)}
				setValue={true || false} // set the current state
			/>

			<MaxMSP.Umenu
				ariaLabel='Set the aria-label tag.' // defaults to the object name
				items={['array', 'of', 'items']}
				onChange={(i: number) => console.log(`My index is ${i}`)}
				setValue={0} // props.items[i]
				width={100} // width of the umenu in pixels
			/>
		</>
	)
}
```

All components return a div, and so the css can be accessed/overwritten in the following way:

```css
.wrapper div:nth-of-type(n) {
    // css goes here
}
```

## Development

### Install

```bash
git clone ...
bun install
```

### Run

```bash
bun run build
bun run example
```

### Test

```bash
bun run dev
bun run format
bun run test
```
