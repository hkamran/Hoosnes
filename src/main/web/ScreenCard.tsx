import * as React from "react";
import {RefObject} from "react";
import {Console, ConsoleState} from "../app/console/Console";
import {IColor} from "../app/console/ppu/Palette";
import {WebGlUtil} from "../app/util/WebGlUtil";


declare let window : any;

interface IScreenCardProps {
    snes: Console;
}

export class ScreenCard extends React.Component<IScreenCardProps, any> {

    public state = {
        width: 256,
        height: 224,
        zoom: 1,
    };
    public animateStatic: boolean = true;
    public canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props : any) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        if (this.props.snes.state == ConsoleState.OFF) this.drawStatic();
        this.props.snes.ppu.screen.setCanvas(this.canvasRef.current);
    }

    private drawStatic(): void {
        let screen = this.props.snes.ppu.screen;
        if (!this.animateStatic) return;
        if (this.props.snes.state != ConsoleState.OFF) {
            screen.reset();
            return;
        }

        if (screen.isReady()) {
            let width = screen.getWidth();
            let height = screen.getHeight();

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const color: IColor = {
                        blue: Math.random() < 0.5 ? 0 : 240,
                        green: Math.random() < 0.5 ? 0 : 240,
                        red: Math.random() < 0.5 ? 0 : 240,
                        opacity: 255,
                    };
                    screen.setPixel(x, y, color);
                }
            }
            screen.render();
        }
        window.requestAnimationFrame(this.drawStatic.bind(this));
    }

    public render() {
        return (
            <div style={{display: "flex"}}>
                <canvas ref={this.canvasRef}
                        style={{
                            backgroundColor: "#000000",
                            borderRadius: "4px",
                        }}
                        />
            </div>
        );
    }

}
