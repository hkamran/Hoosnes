import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import Console from './../app/Console';

declare let window : any;
window.snes = new Console();

ReactDOM.render(
    <div></div>,
    document.getElementById('main'),
);
