import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import Console from './../app/Console';
import {Loader} from "./Loader";

declare let window : any;
window.snes = new Console();

window.loader = function(e) {
    console.log(e);
};

ReactDOM.render(
    <div>
        <Loader snes={window.snes} />
    </div>,
    document.getElementById('main'),
);
