import * as React from "react";
import {Card} from "./core/layout/Card";
import {PaletteBppType, PaletteColor} from "../app/ppu/Palette";
import Console from "../app/Console";
import {Loader} from "./Loader";

declare let window : any;

interface ICartridgeCardProps {
    snes: Console;
}

export class CartridgeCard extends React.Component<ICartridgeCardProps, any> {


    constructor(props : ICartridgeCardProps) {
        super(props);
    }

    public componentDidMount(): void {
    }


    public render() {
        return (
            <Card title="Cartridge">
                <div>
                    <Loader snes={window.snes} />
                </div>
                <div>
                </div>
            </Card>
        );
    }

}
