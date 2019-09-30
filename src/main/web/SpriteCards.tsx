import * as React from "react";
import {Card} from "./core/layout/Card";
import {PaletteBppType, PaletteColor} from "../app/ppu/Palette";
import Console from "../app/Console";

declare let window : any;

interface ISpriteCardProps {
    snes: Console;
}

export class SpriteCard extends React.Component<ISpriteCardProps, any> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    constructor(props : ISpriteCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
        this._render();
    }

    public _render() {

    }

    public render() {
        return (
            <Card title="Sprites">
                <div>
                    <canvas ref={this.canvasRef}
                            style={{
                                border: "2px solid #000",
                                borderRadius: "2px",
                            }}
                    />
                </div>
                <div>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)"}}>
                        <legend>Details</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", padding: "0px", margin: "0px", paddingRight: "80px", fontSize: "12px"}}>
                                <li>
                                    <span className="header">X-Position:</span>
                                    <span>0</span>
                                </li>
                                <li>
                                    <span className="header">Y-Position:</span>
                                    <span>0</span>
                                </li>
                                <li>
                                    <span className="header">OAM Address:</span>
                                    <span>0</span>
                                </li>
                                <li>
                                    <span className="header">Attribute:</span>
                                    <span>0</span>
                                </li>
                            </ul>
                            <ul style={{listStyle: "none", padding: "0px", margin: "0px", flex: "1", fontSize: "12px"}}>
                                <li>
                                    <span className="header">X-flip:</span>
                                    <span>0</span>
                                </li>
                                <li>
                                    <span className="header">Y-flip:</span>
                                    <span>0</span>
                                </li>
                                <li>
                                    <span className="header">Tile Address:</span>
                                    <span>0</span>
                                </li>
                                <li>
                                    <span className="header">Tile Number:</span>
                                    <span>0</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this._render.bind(this)}>Render</button>
                    </div>
                </div>
            </Card>
        );
    }

}
