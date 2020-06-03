import * as React from "react";

interface IDebuggerStatsProps {
}

interface IDebuggerStatsState {
    fps: number;
    lastCalledTime: number;
}

let isRunning: boolean = false;

export class DebuggerStats extends React.Component<IDebuggerStatsProps, IDebuggerStatsState> {

    state = {
        fps: 0,
        lastCalledTime: 0,
    }

    constructor(props: IDebuggerStatsProps) {
        super(props);
    }

    public componentDidMount() {
        isRunning = true;
        this.tick();
    }

    public componentWillUnmount() {
        isRunning = false;
    }

    public tick() {
        let execute = function() {
            if (isRunning) {
                this.measure();
                this.tick.bind(this)();
            }
        }.bind(this);
        requestAnimationFrame(execute);
    }

    public measure() {
        if(!this.state.lastCalledTime) {
            this.setState({
                lastCalledTime: performance.now(),
                fps: 0,
            })
        } else {
            let delta = (performance.now() - this.state.lastCalledTime) / 1000;
            this.setState({
                lastCalledTime: performance.now(),
                fps: Math.floor(1 / delta),
            });
        }
    }

    public render() {
        return (
            <div style={{
                textTransform: "uppercase",
                marginTop: "22px",
                marginRight: "30px",
                whiteSpace: "nowrap",
            }}>
                {Math.min(this.state.fps, 99)} fps
            </div>
        );
    }
}