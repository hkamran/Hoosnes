import * as React from "react";
import {CSSProperties} from "react";
import {RefObject} from "react";
import Stats from 'stats.js';

const screenStyle: CSSProperties = {
    padding: '0.5rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    margin: '20px',
    borderRadius: '4px',
    flexDirection: "column",
    display: "flex",
    alignSelf: "baseline",
};

declare let window : any;

export class Screen extends React.Component<any, any> {

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
        this.drawStatic();
    }

    private drawStatic(): void {
        if (!this.animateStatic) return;
        this.stats.begin();

        let image: ImageData = window.context.createImageData(
            this.state.width * this.state.zoom,
            this.state.height * this.state.zoom);

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
        console.log();
        return (
            <div style={screenStyle}>
                <div>
                    <div>
                        <canvas ref={this.canvasRef}
                                width={this.state.width * this.state.zoom}
                                height={this.state.height * this.state.zoom}
                                style={{
                                    width: this.state.width * this.state.zoom + "px",
                                    borderRadius: "4px",
                                    border: "2px solid #000",
                                }}
                                />
                    </div>
                    <div>
                        <div ref={this.statsRef} />
                    </div>
                </div>
                <div style={{paddingTop: '7px'}}>
                    <button onClick={this.increaseZoom.bind(this)}>+</button>
                    <button onClick={this.decreaseZoom.bind(this)}>-</button>
                </div>
            </div>
        );
    }

}