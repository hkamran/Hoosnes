import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import Console from './../app/Console';

let console = new Console();

ReactDOM.render(
    <Core console={console} />,
    document.getElementById('main'),
);
