import * as React from "react";
import {RefObject} from "react";
import Stats from 'stats.js';
import {Console, ConsoleState} from "../app/Console";


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

    public stats: Stats = new Stats();
    public animateStatic: boolean = true;

    public canvasRef: RefObject<HTMLCanvasElement>;
    public statsRef: RefObject<HTMLDivElement>;

    public context: CanvasRenderingContext2D;

    constructor(props : any) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.statsRef = React.createRef<HTMLDivElement>();
    }

    public componentDidMount(): void {
        this.context = this.canvasRef.current.getContext("2d", {alpha: false});
        this.statsRef.current.appendChild(this.stats.dom);
        this.statsRef.current.children[0].setAttribute("style", "position: inherit;");

        if (window) {
            window.canvas = this.canvasRef;
            window.context = this.context;
        }
        if (this.props.snes.state == ConsoleState.OFF) this.drawStatic();
        this.props.snes.ppu.screen.setCanvas(this.canvasRef.current);
    }

    private drawStatic(): void {
        if (!this.animateStatic) return;
        if (this.props.snes.state != ConsoleState.OFF) return;

        this.stats.begin();

        let image: ImageData = window.context.createImageData(
            this.props.snes.ppu.screen.getWidth(),
            this.props.snes.ppu.screen.getHeight());

        let len = image.data.length - 1;

        while (len--) {
            image.data[len] = Math.random() < 0.5 ? 0 : 255;
        }

        window.context.putImageData(image, 0, 0);
        window.requestAnimationFrame(this.drawStatic.bind(this));

        this.stats.end();
    }

    private increaseZoom(): void {
        this.setState({
            zoom: this.state.zoom + 1,
        });
    }

    private decreaseZoom(): void {
        this.setState({
            zoom: Math.max(1, this.state.zoom - 1),
        });
    }

    public render() {
        return (
            <div>
                <canvas ref={this.canvasRef}
                        style={{
                            backgroundColor: "#000000",
                            borderRadius: "4px",
                        }}
                        />
                <div ref={this.statsRef} style={{display: "none"}} />
            </div>
        );
    }

}
