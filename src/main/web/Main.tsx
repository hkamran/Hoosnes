import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import Console from './../app/Console';
import {ScreenCard} from "./ScreenCard";
import {PaletteCard} from "./PaletteCard";
import {CartridgeCard} from "./CartridgeCard";
import {SpriteCard} from "./SpriteCards";
import {CpuCard} from "./CpuCard";

declare let window : any;
window.snes = new Console();

ReactDOM.render(
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <ScreenCard snes={window.snes}/>
            <PaletteCard snes={window.snes} />
            <SpriteCard snes={window.snes} />
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <CartridgeCard snes={window.snes} cartridge={window.snes.cartridge} />
            <CpuCard snes={window.snes} />
        </div>
    </div>,
    document.getElementById('main'),
);
