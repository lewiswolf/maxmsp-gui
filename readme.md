# maxmsp-gui

## by Lewis Wolf

> React component library for stylised Max MSP GUI.

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
                setValue={true || false} // set the current state
                onClick={(b: boolean) => console.log(b)}
            />

            <MaxMSP.Message
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                ariaPressed={true || false} // default null
                text='What does the message say?'
                onClick={() => console.log('bang')}
            />

            <MaxMSP.Object
                inactive={true || false} // default false
                text='What is the object called?'
            />

            <MaxMSP.Playbar
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                fidelity={100} // max output of slider
                inactive={true || false} // disable user interaction, default false
                setPlaying={true || false} // set onPlay externally
                setValue={0} // initial/updated state, 0 to props.fidelity
                width={200} // width of the slider in pixels
                onPlay={(b: boolean) => console.log(b)}
                onChange={(x: number) => console.log(`My value is ${x}`)} // 0 - props.fidelity
            />

            <MaxMSP.RadioGroup
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                items={['array', 'of', 'items']} // this sets the amount of radiobuttons, strings create text alongside each button
                spacing={24} // the height of each button in pixels
                setValue={0} // this.props.items[i]
                onClick={(i: number) => console.log(`My value is ${i}`)}
            />

            <MaxMSP.Slider
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                fidelity={100} // max output of slider, default 100
                length={200} // width of the slider in pixels, default 200
                value={0} // initial/updated state, 0 to this.props.fidelity
                onChange={(x: number) => console.log(`My value is ${x}`)} // 0 - this.props.fidelity
            />

            <MaxMSP.TextButton
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                ariaPressed={true || false} // default null, for mode 'false' only
                inactive={true || false} // disable user interaction, default false
                mode={true || false} // true for toggle, false for bang, default false
                text='What does the textbutton say?'
                toggleText='What does the toggled textbutton say?'
                value={true || false} // default false, for mode 'true' only
                // mode 0 onClick
                onClick={() => console.log('bang')}
                // mode 1 onClick
                onClick={(b: boolean) => console.log(b)}
            />

            <MaxMSP.Toggle
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                setValue={true || false} // set the current state
                onClick={(b: boolean) => console.log(b)}
            />

            <MaxMSP.Umenu
                ariaLabel='Set the aria-label tag.' // defaults to the object name
                items={['array', 'of', 'items']}
                outputSymbol={true || false} // true for symbol false for int, default false
                setValue={0} // this.props.items[i], default 0
                width={100} // width of the umenu in pixels, default 100
                onChange={(value: number | string) => console.log(`My index/item is ${i}`)}
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

## Dev

```bash
$ npm install --dev
$ npm start 
$ npm run example
$ npm run lint
$ npm run build
```