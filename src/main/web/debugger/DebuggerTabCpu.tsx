import * as React from "react";
import {Console} from "../../app/console/Console";
import {CpuCard} from "./cpu/CpuCard";
import {LogCard} from "./cpu/LogCard";

interface IDebuggerCpuProps {
    snes: Console;
    trace: boolean;
}

export class DebuggerTabCpu extends React.Component<IDebuggerCpuProps, any> {

    public render() {
        return (
            <div className="debugger block" style={{display: "flex", flexDirection: "row"}}>
                <CpuCard snes={this.props.snes} />
                <LogCard snes={this.props.snes} trace={this.props.trace}/>
            </div>
        );
    }
}