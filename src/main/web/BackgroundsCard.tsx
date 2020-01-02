import {Console} from "../app/Console";
import {Registers} from "../app/ppu/Registers";
import {Ppu} from "../app/ppu/Ppu";
import * as React from "react";
import {Card} from "./core/layout/Card";

interface IBackgroundsCardProps {
    snes: Console;
}

interface IBackgroundsCardState {
}

export class BackgroundsCard extends React.Component<IBackgroundsCardProps, IBackgroundsCardState> {

    public canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props : IBackgroundsCardProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidUpdate(prevProps: Readonly<IBackgroundsCardProps>, prevState: Readonly<IBackgroundsCardState>, snapshot?: any): void {
        this.refresh();
    }

    public refresh(): void {

    }

    public render() {
        return (
            <Card title="Backgrounds">
                <div style={{height: "256px", width: "256px", overflow: "scroll"}}>
                    <canvas ref={this.canvasRef}
                            style={{
                                border: "2px solid #000",
                                borderRadius: "2px",
                                height: "98%",
                                width: "99%",
                            }}
                    />
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                    </div>
                </div>
            </Card>
        );
    }
}