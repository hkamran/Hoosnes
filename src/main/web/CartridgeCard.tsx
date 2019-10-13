import * as React from "react";
import {Card} from "./core/layout/Card";
import {PaletteBppType, PaletteColor} from "../app/ppu/Palette";
import Console from "../app/Console";
import {Cartridge} from "../app/cartridge/Cartridge";

declare let window : any;

interface ICartridgeCardProps {
    snes: Console;
    cartridge: Cartridge;
}

export class CartridgeCard extends React.Component<ICartridgeCardProps, any> {

    constructor(props : ICartridgeCardProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            title: "",
            mapping: "",
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
                <div>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", marginTop: "10px"}}>
                        <legend>Details</legend>

                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", padding: "0px", margin: "0px", paddingRight: "80px", fontSize: "12px"}}>
                                <li>
                                    <span className="header">Title:</span>
                                    <span style={{whiteSpace: "nowrap"}}>{this.state.title}</span>
                                </li>
                                <li>
                                    <span className="header">Mapping:</span>
                                    <span style={{whiteSpace: "nowrap"}}>{this.state.mapping}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
