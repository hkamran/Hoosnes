import * as React from "react";
import {Card} from "./core/layout/Card";
import Console from "../app/Console";
import {TickEvent} from "./Main";

interface IDebuggerCardProps {
    snes: Console;
    tick: () => void;
    logs: TickEvent[];
}

export class DebuggerCard extends React.Component<IDebuggerCardProps, any> {

    public divLog: React.RefObject<HTMLDivElement>;

    constructor(props : IDebuggerCardProps) {
        super(props);
        this.divLog = React.createRef<HTMLDivElement>();
    }

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: Readonly<IDebuggerCardProps>, prevState: Readonly<any>, snapshot?: any): void {
        this.divLog.current.scrollTop = this.divLog.current.scrollHeight;
    }

    public tick(): void {
        this.props.tick();
    }

    public render() {
        return (
            <Card title="Debugger" grow={true}>
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Logs</legend>
                        <div ref={this.divLog} style={{display: "flex", flexDirection: "column", fontSize: "12px", height: "273px", overflowY: "auto"}}>
                            {this.props.logs.map((value, index) => {
                                return (<div key={index}>
                                    Cycle:{value.cycle} Opcode:{"0x" + value.op.code.toString(16).toUpperCase()} Opname:{value.op.name}, K:0x{value.registerK.toString(16)}, PC:0x{value.registerPC.toString(16)}
                                </div>);
                            })}
                        </div>
                    </fieldset>
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.tick.bind(this)}>Tick</button>
                    </div>
                </div>
            </Card>
        );
    }

}
