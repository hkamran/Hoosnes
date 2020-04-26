import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Console} from "../../../app/Console";

interface ICartridgeCardProps {
    snes: Console;
}

export class CartridgeCard extends React.Component<ICartridgeCardProps, any> {

    constructor(props : ICartridgeCardProps) {
        super(props);
    }

    public render() {
        let snes = this.props.snes;
        return (
            <Card title="Cartridge">
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1, width: "300px"}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Title:</span>
                                    <span>{snes.cartridge && snes.cartridge.title ? snes.cartridge.title : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Mapping:</span>
                                    <span>{snes.cartridge && snes.cartridge.mapping ? snes.cartridge.mapping.label : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Checksum:</span>
                                    <span>{snes.cartridge && snes.cartridge.checksum ? "0x" + snes.cartridge.checksum.toString(16).toUpperCase() : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Compliment:</span>
                                    <span>{snes.cartridge && snes.cartridge.complement ? "0x" + snes.cartridge.complement.toString(16).toUpperCase() : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Version:</span>
                                    <span>{snes.cartridge && snes.cartridge.version ? "0x" + snes.cartridge.version : "0"}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Sram:</span>
                                    <span>{snes.cartridge && snes.cartridge.sram ? snes.cartridge.sram.size : ""}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
