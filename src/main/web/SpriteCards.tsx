import * as React from "react";
import {Card} from "./core/layout/Card";
import {BppType, Color} from "../app/ppu/Palette";
import {Console} from "../app/Console";
import {Orientation, Sprite} from "../app/ppu/Sprites";
import {OamSizes} from "../app/memory/Oam";

interface ISpriteCardProps {
    snes: Console;
}

interface ISpriteCardState {
    selected: number | null;
}

export class SpriteCard extends React.Component<ISpriteCardProps, ISpriteCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;

    public state: ISpriteCardState = {
        selected: null,
    };

    constructor(props : ISpriteCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
    }

    public select(index: number) {
        this.setState({
           selected: index,
        });
    }

    public render() {

        let sizes: OamSizes = this.props.snes.ppu.registers.oamselect.getObjectSizes();

        return (
            <Card title="Sprites">
                <div style={{flexDirection: "row", display:"flex"}}>
                    <div style={{border: "1px solid #ddd", width: "390px", height: "300px", marginRight: "15px", overflow: "hidden", overflowY: "scroll"}}>
                        <table style={{width: "100%"}}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Size</th>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>Char</th>
                                    <th>Priority</th>
                                    <th>Palette</th>
                                    <th>Flip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.snes.ppu.sprites.getSprites().map((sprite: Sprite, index: number) => {

                                    let height: number = sprite.isBig() ? sizes.bigHeight: sizes.smallHeight;
                                    let width: number = sprite.isBig() ? sizes.bigWidth: sizes.smallWidth;

                                    let style = {cursor: "pointer", background: ""};

                                    if (index == this.state.selected) {
                                        style.background = "#eee";
                                    }

                                    return (
                                        <tr key={index} onClick={() => { this.select(index); }} style={style}>
                                            <td>{index}</td>
                                            <td>{height + "x" + width}</td>
                                            <td>{sprite.getXPosition()}</td>
                                            <td>{sprite.getYPosition()}</td>
                                            <td>{sprite.getTileNumber()}</td>
                                            <td>{sprite.getSpritePriority()}</td>
                                            <td>{sprite.getPaletteIndex()}</td>
                                            <td>{Orientation[sprite.getOrientation()]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div style={{marginBottom: "10px"}}>
                            <span>Id:</span>
                            <span>{this.state.selected}</span>
                        </div>
                        <div>
                            <canvas ref={this.canvasRef}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        border: "2px solid #000",
                                        borderRadius: "2px",
                                        marginRight: "10px",
                                    }}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

}
