import * as React from "react";
import ReactTooltip from "react-tooltip";
import {Console, ConsoleState, TICKS_PER_FRAME} from "../../app/Console";
import {DebuggerTabCpu} from "./DebuggerTabCpu";
import {DebuggerTabPpu} from "./DebuggerTabPpu";
import {DebuggerTabCartridge} from "./DebuggerTabCartridge";
import Toggle from 'react-toggle';
import {animateFrames} from "../Main";

enum Tab {
    CPU, PPU, APU, CARTRIDGE,
}

interface IDebuggerStates {
    tab: Tab;
    snes: Console;
    ticks: string;
    trace: boolean;
}

interface IDebuggerProps {
    snes: Console;
    display: boolean;
    closeCallback: () => {};
}

export let debugCallback = () => {};

export class Debugger extends React.Component<IDebuggerProps, IDebuggerStates> {

    constructor(props: IDebuggerProps) {
        super(props);
        this.state = {
            tab: Tab.CPU,
            snes: props.snes,
            ticks: "1",
            trace: false,
        };
    }

    public componentDidMount(): void {
        debugCallback = () => {
            if (this.state.trace) {
                this.setState({
                    snes: this.state.snes,
                });
            }
        };
    }

    private play() {
        this.props.snes.play();
        animateFrames();
        this.setState({
            snes: this.state.snes,
        });
    }

    private stop() {
        this.props.snes.stop();
        this.setState({
            snes: this.state.snes,
        });
    }

    private tick() {
        this.props.snes.stop();
        this.state.snes.tick();
        this.setState({
            snes: this.state.snes,
        });
    }

    private ticks() {
        let value = prompt("Number of ticks", this.state.ticks);
        let amount = 1;
        try {
            amount = Math.abs(Number.parseInt(value, 10));
        } catch (e) {}
        this.state.snes.ticks(amount);
        this.setState({
            ticks: value,
            snes: this.state.snes,
        });
    }

    private reset() {
        this.state.snes.reset();
        this.setState({
            snes: this.state.snes,
        });
    }

    public toggleTrace() {
        let result: boolean = !this.state.trace;
        if (result) {
            this.props.snes.setTpf(1);
        } else {
            this.props.snes.setTpf(TICKS_PER_FRAME);
        }

        this.setState({
           trace: !this.state.trace,
        });
    }

    public render() {
        return (
            !this.props.display ? null :
            <div id="debugger">
                <span className={"debug-menu"}>
                    <div className={"debug-title"}>Debugger</div>
                    <div className={"debug-button" + (this.props.snes.state == ConsoleState.RUNNING ? " active" : "")} data-tip="Play" onClick={this.play.bind(this)}>
                        <i className="fas fa-play" />
                    </div>
                    <div className={"debug-button" + (this.props.snes.state == ConsoleState.PAUSED ? " active" : "")} data-tip="Stop" onClick={this.stop.bind(this)}>
                        <i className="fas fa-stop" />
                    </div>
                    <div className={"debug-button"} data-tip="Step" onClick={this.tick.bind(this)}>
                        <i className="fas fa-step-forward" />
                    </div>
                    <div className={"debug-button"} data-tip="Fast Forward" onClick={this.ticks.bind(this)}>
                        <i className="fas fa-fast-forward" />
                    </div>
                    <div className={"debug-button" + (this.props.snes.state == ConsoleState.RESET ? " active" : "")} data-tip="Reset" onClick={this.reset.bind(this)}>
                        <i className="fas fa-undo-alt" />
                    </div>
                    <div className={"debugger-button-item"} data-tip="Toggle Tracing" onClick={this.toggleTrace.bind(this)}>
                      <Toggle
                          checked={this.state.trace}
                          icons={false}
                          onChange={this.toggleTrace.bind(this)} />
                    </div>
                    <div style={{flexGrow: 1}} />
                    <div className={"debug-tab-button " + (this.state.tab == Tab.CPU ? "active": "")} onClick={() => this.setTab(Tab.CPU)}>CPU</div>
                    <div className={"debug-tab-button " + (this.state.tab == Tab.PPU ? "active": "")} onClick={() => this.setTab(Tab.PPU)}>PPU</div>
                    <div className={"debug-tab-button " + (this.state.tab == Tab.CARTRIDGE ? "active": "")} onClick={() => this.setTab(Tab.CARTRIDGE)}>CARTRIDGE</div>
                    <div className={"debug-button"} data-tip="Close" onClick={this.props.closeCallback}>
                        <i className="fas fa-times" />
                    </div>
                </span>
                <div className="debug-tab" style={{display: "inline-block"}}>
                    {this.state.tab == Tab.CPU ? <DebuggerTabCpu snes={this.props.snes} trace={this.state.trace} /> : null}
                    {this.state.tab == Tab.PPU ? <DebuggerTabPpu snes={this.props.snes} /> : null}
                    {this.state.tab == Tab.CARTRIDGE ? <DebuggerTabCartridge snes={this.props.snes} /> : null}
                </div>
                <ReactTooltip place={"bottom"} backgroundColor={"#888888"} />
            </div>
        );
    }

    private setTab(tab: Tab) {
        this.setState({
            tab,
        });
    }
}