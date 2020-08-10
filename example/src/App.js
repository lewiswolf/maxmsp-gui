import React from 'react'

import * as MaxMSP from 'maxmsp-gui'
import 'maxmsp-gui/dist/index.css'

export default function App() {
  return (<React.Fragment>
    <h2>React component library for stylised Max MSP GUI</h2>
    <MaxMSP.Bang />
    <MaxMSP.Ezdac />
    <MaxMSP.Message text={'text'} />
    <MaxMSP.Object text={'text'} />
    <MaxMSP.RadioGroup />
    <MaxMSP.Slider />
    <MaxMSP.TextButton />
    <MaxMSP.Toggle />
    <MaxMSP.Umenu />
  </React.Fragment>
  )
}
