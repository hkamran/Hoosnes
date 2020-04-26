import * as React from "react";
import {Console} from "../../app/Console";
import {BackgroundsCard} from "./ppu/BackgroundsCard";
import {PaletteCard} from "./ppu/PaletteCard";
import {SpriteCard} from "./ppu/SpriteCard";
import {TileCard} from "./ppu/TileCard";
import {PpuCard} from "./ppu/PpuCard";

interface IDebuggerTabPpuProps {
    snes: Console;
}

export class DebuggerTabPpu extends React.Component<IDebuggerTabPpuProps, any> {

    public render() {
        return (
            <div className="debugger block" style={{display: "flex", flexDirection: "row"}}>
                <PpuCard snes={this.props.snes} />
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <SpriteCard snes={this.props.snes}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <BackgroundsCard snes={this.props.snes}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <TileCard snes={this.props.snes}/>
                        <PaletteCard snes={this.props.snes}/>
                    </div>
                </div>
            </div>
        );
    }
}