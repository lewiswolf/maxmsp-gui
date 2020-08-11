# maxmsp-gui

## by Lewis Wolf

> React component library for stylised Max MSP GUI.

[![NPM](https://img.shields.io/npm/v/maxmsp-gui.svg)](https://www.npmjs.com/package/maxmsp-gui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm i maxmsp-gui
```

## Usage

```jsx
import React from 'react'

import * as MaxMSP from 'maxmsp-gui'
import 'maxmsp-gui/dist/index.css'

export default function main() => {
    return (
        <MaxMSP.Bang
            onClick={() => console.log('bang')}
        />

        <MaxMSP.Ezdac
            initial={true || false} // default false
            onClick={(bool) => console.log(bool)} // true or false
        />

        <MaxMSP.Message
            text={'What does the message say?'}
            onClick={() => console.log('bang')}
        />

        <MaxMSP.Object
            inactive={true || false} // default false
            text={'What is the object called?'}
        />

        <MaxMSP.Playbar
            inactive={true || false} // diable user interaction, default false
            width={200} // width of the slider in pixels, default 200
            value={50} // inital/updated state, 0 to 100, default 0
            setPlaying={true || false} // set isPlaying externally, once the component has mounted this will also trigger the isPlaying callback
            isPlaying={(bool) => console.log(bool)}
            onChange={(i) => console.log(`My value is ${i}`)}
        />

        <MaxMSP.RadioGroup
            items={['array', 'of', 'items']} // this sets the amount of radiobuttons, an array of empty strings will make just the buttons
            inital={i} // this.props.items[i], default 0
            spacing={24} // the height of each button in pixels, defualt 20
            onClick={(i) => console.log(`My value is ${i}`)}
        />

        <MaxMSP.Slider
            value={50} // inital/updated state, 0 to 100, default 0
            length={200} // width of the slider in pixels, default 200
            onChange={(i) => console.log(`My value is ${i}`)} // 0 - 100
        />

        <MaxMSP.TextButton
            text={'What does the textbutton say?'}
            inactive={true || false} // diable user interaction, default false
            onClick={() => console.log('bang')}
        />

        <MaxMSP.Toggle
            initial={true || false} // default false
            onClick={(bool) => console.log(bool)} // 0 or 1
        />

        <MaxMSP.Umenu
            width={200} // width of the umenu in pixels, default 100
            items={['array', 'of', 'items']}
            inital={i} // this.props.items[i], default 0
            outputSymbol={true || false} // true for symbol false for int, default false
            onChange={(x) => console.log(`My index/item is ${x}`)}
        />
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
