import * as React from "react";
import ReactTooltip from "react-tooltip";
import {Console} from "../../app/Console";
import {DebuggerTabCpu} from "./DebuggerTabCpu";
import {DebuggerTabPpu} from "./DebuggerTabPpu";
import {DebuggerTabCartridge} from "./DebuggerTabCartridge";

enum Tab {
    CPU, PPU, APU, CARTRIDGE,
}

interface IDebuggerStates {
    tab: Tab;
}

interface IDebuggerProps {
    snes: Console;
    display: boolean;
    closeDebugger: () => {};
    tickSnes: () => {};
}


export class Debugger extends React.Component<IDebuggerProps, IDebuggerStates> {

    constructor(props: IDebuggerProps) {
        super(props);
        this.state = {
            tab: Tab.CPU,
        };
    }

    public render() {
        return (
            !this.props.display ? null :
            <div id="debugger">
                <span className={"debug-menu"}>
                    <div className={"debug-title"}>Debugger</div>
                    <div className={"debug-button"} data-tip="Play">
                        <i className="fas fa-play" />
                    </div>
                    <div className={"debug-button"} data-tip="Stop">
                        <i className="fas fa-stop" />
                    </div>
                    <div className={"debug-button"} data-tip="Step" onClick={this.props.tickSnes}>
                        <i className="fas fa-step-forward" />
                    </div>
                    <div style={{flexGrow: 1}} />
                    <div className={"debug-tab-button " + (this.state.tab == Tab.CPU ? "active": "")} onClick={() => this.setTab(Tab.CPU)}>CPU</div>
                    <div className={"debug-tab-button " + (this.state.tab == Tab.PPU ? "active": "")} onClick={() => this.setTab(Tab.PPU)}>PPU</div>
                    <div className={"debug-tab-button " + (this.state.tab == Tab.CARTRIDGE ? "active": "")} onClick={() => this.setTab(Tab.CARTRIDGE)}>CARTRIDGE</div>
                    <div className={"debug-button"} data-tip="Close" onClick={this.props.closeDebugger}>
                        <i className="fas fa-times" />
                    </div>
                </span>
                <div className="debug-tab" style={{display: "inline-block"}}>
                    {this.state.tab == Tab.CPU ? <DebuggerTabCpu snes={this.props.snes} /> : null}
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