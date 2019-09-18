import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import Console from './../app/Console';
import {Loader} from "./Loader";
import {Screen} from "./Screen";

declare let window : any;
window.snes = new Console();

ReactDOM.render(
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <Screen snes={window.snes}/>
        <Loader snes={window.snes} />
    </div>,
    document.getElementById('main'),
);
