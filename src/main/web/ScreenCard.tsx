import * as React from "react";
import {RefObject} from "react";
import {Console, ConsoleState} from "../app/console/Console";
import {ScreenWebGl} from "../app/console/ppu/ScreenWebGl";


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
    public canvasRefWebGl: RefObject<HTMLCanvasElement>;

    public context: CanvasRenderingContext2D;
    private gl: WebGLRenderingContext;
    private webGl: ScreenWebGl;

    constructor(props : any) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvasRefWebGl = React.createRef<HTMLCanvasElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});

        if (window) {
            window.canvas = this.canvasRef;
            window.context = this.context;
        }
        if (this.props.snes.state == ConsoleState.OFF) this.drawStatic();
        this.props.snes.ppu.screen.setCanvas(this.canvasRef.current);

        this.webGl = new ScreenWebGl(this.canvasRefWebGl.current);
    }

    private drawStatic(): void {
        if (!this.animateStatic) return;
        if (this.props.snes.state != ConsoleState.OFF) return;

        let width = this.props.snes.ppu.screen.getWidth();
        let height = this.props.snes.ppu.screen.getHeight();

        let image: ImageData = window.context.createImageData(
            width,
            height);

        let len = image.data.length - 1;

        while (len--) {
            image.data[len] = Math.random() < 0.5 ? 0 : 255;
        }

        if (this.webGl) this.webGl.render(image);
        window.context.putImageData(image, 0, 0);
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
                <canvas ref={this.canvasRefWebGl}
                        style={{
                            backgroundColor: "#000000",
                            borderRadius: "4px",
                        }}
                />
            </div>
        );
    }

}
