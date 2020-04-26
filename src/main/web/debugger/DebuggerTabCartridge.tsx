import * as React from "react";
import {Console} from "../../app/Console";
import {BackgroundsCard} from "./ppu/BackgroundsCard";
import {PaletteCard} from "./ppu/PaletteCard";
import {SpriteCard} from "./ppu/SpriteCard";
import {TileCard} from "./ppu/TileCard";
import {PpuCard} from "./ppu/PpuCard";
import {CartridgeCard} from "./cartridge/CartridgeCard";

interface IDebuggerTabCartridgeProps {
    snes: Console;
}

export class DebuggerTabCartridge extends React.Component<IDebuggerTabCartridgeProps, any> {

    public render() {
        return (
            <div className="debugger block" style={{display: "flex", flexDirection: "row"}}>
                <CartridgeCard snes={this.props.snes} />
            </div>
        );
    }
}