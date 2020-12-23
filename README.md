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

```jsx
import React from 'react'

import * as MaxMSP from 'maxmsp-gui'
import 'maxmsp-gui/dist/index.css'

export default function App() {
    return (
        <React.Fragment>

            <MaxMSP.Bang 
                ariaLabel='set the aria-label tag' // defaults to the object name
                ariaPressed={true || false} // default null
                onClick={() => console.log('bang')} 
            />

            <MaxMSP.Ezdac
                ariaLabel='set the aria-label tag' // defaults to the object name
                value={true || false} // default false
                onClick={(bool) => console.log(bool)} // true or false
            />

            <MaxMSP.Message
                ariaLabel='set the aria-label tag' // defaults to the object name
                ariaPressed={true || false} // default null
                text='What does the message say?'
                onClick={() => console.log('bang')}
            />

            <MaxMSP.Object
                inactive={true || false} // default false
                text='What is the object called?'
            />

            <MaxMSP.Playbar
                ariaLabel='set the aria-label tag' // defaults to the object name
                fidelity={100} // max output of slider, default 100
                inactive={true || false} // diable user interaction, default false
                setPlaying={true || false} // set isPlaying externally
                value={50} // inital/updated state, 0 to this.props.fidelity, default 0
                width={200} // width of the slider in pixels, default 200
                isPlaying={(bool) => console.log(bool)}
                onChange={(i) => console.log(`My value is ${i}`)} // 0 - this.props.fidelity
            />

            <MaxMSP.RadioGroup
                ariaLabel='set the aria-label tag' // defaults to the object name
                items={['array', 'of', 'items']} // this sets the amount of radiobuttons, strings create text alongside each button
                spacing={24} // the height of each button in pixels, defualt 20
                value={i} // this.props.items[i], default 0
                onClick={(i) => console.log(`My value is ${i}`)}
            />

            <MaxMSP.Slider
                ariaLabel='set the aria-label tag' // defaults to the object name
                fidelity={100} // max output of slider, default 100
                length={200} // width of the slider in pixels, default 200
                value={50} // inital/updated state, 0 to this.props.fidelity, default 0
                onChange={(i) => console.log(`My value is ${i}`)} // 0 - this.props.fidelity
            />

            <MaxMSP.TextButton
                ariaLabel='set the aria-label tag' // defaults to the object name
                ariaPressed={true || false} // default null, for mode 'false' only
                inactive={true || false} // diable user interaction, default false
                mode={true || false} // true for toggle, false for bang, default false
                text='What does the textbutton say?'
                toggleText='What does the toggled textbutton say?'
                value={true || false} // default false, for mode 'true' only
                // mode 0 onClick
                onClick={() => console.log('bang')}
                // mode 1 onClick
                onClick={(bool) => console.log(bool)}
            />

            <MaxMSP.Toggle
                ariaLabel='set the aria-label tag' // defaults to the object name
                value={true || false} // default false
                onClick={(bool) => console.log(bool)}
            />

            <MaxMSP.Umenu
                ariaLabel='set the aria-label tag' // defaults to the object name
                items={['array', 'of', 'items']}
                outputSymbol={true || false} // true for symbol false for int, default false
                value={i} // this.props.items[i], default 0
                width={200} // width of the umenu in pixels, default 100
                onChange={(x) => console.log(`My index/item is ${x}`)}
            />

        </React.Fragment>
    )
}
```

All components return a div, and so the css can be accessed/overwritten in the following way:

```css
.wrapper div:nth-of-type(n) {
    // css goes here
}
```

This package was made with `npx create-react-library`
