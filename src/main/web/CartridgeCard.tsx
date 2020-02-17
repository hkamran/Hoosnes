import * as React from "react";
import {Card} from "./core/layout/Card";
import {BppType, Color} from "../app/ppu/Palette";
import {Console} from "../app/Console";
import {Cartridge} from "../app/cartridge/Cartridge";

declare let window : any;

interface ICartridgeCardProps {
    snes: Console;
    cartridge: Cartridge;
}

interface ICartridgeCardState {
    title: string;
    mapping: string;
    checksum: number;
    compliment: number;
    version: number;
}


export class CartridgeCard extends React.Component<ICartridgeCardProps, ICartridgeCardState> {

    constructor(props : ICartridgeCardProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            title: "",
            mapping: "",
            checksum: 0,
            compliment: 0,
            version: 0,
        };
    }

    public componentDidMount(): void {
    }

    public handleChange(event) {
        let file : File = event.target.files[0];
        let promise = this.readFileDataAsBase64(file);
        promise.then((value: number[]) => {
            this.props.snes.load(value);
            this.setState({
                title: this.props.snes.cartridge.title,
                mapping: this.props.snes.cartridge.mapping.label,
                checksum: this.props.snes.cartridge.checksum,
                compliment: this.props.snes.cartridge.complement,
                version: this.props.snes.cartridge.version,
            });
        });
    }

    public readFileDataAsBase64(file : Blob) {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event : any) => {
                let str : string = event.target.result;
                window.raw = str;
                let bytes : number[] = [];
                for (let i = 0; i < str.length; ++i) {
                    let charCode = str.charCodeAt(i);
                    bytes.push(charCode & 0xFF);
                }
                resolve(bytes);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsBinaryString(file);
        });
    }

    public render() {
        return (
            <Card title="Cartridge">
                <div>
                    <input type="file" id="file" onChange={this.handleChange} />
                </div>
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Details</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Title:</span>
                                    <span>{this.state.title}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Mapping:</span>
                                    <span>{this.state.mapping}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Checksum:</span>
                                    <span>{"0x" + this.state.checksum.toString(16)}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Compliment:</span>
                                    <span>{"0x" + this.state.compliment.toString(16)}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Version:</span>
                                    <span>{"0x" + this.state.version.toString(16)}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Sram:</span>
                                    <span>{this.props.snes.cartridge ? this.props.snes.cartridge.sram.size : 0}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
