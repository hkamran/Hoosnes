import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Console} from "../../../app/Console";
import {Cpu} from "../../../app/cpu/Cpu";

interface IDebuggerCardProps {
    snes: Console;
    trace: boolean;
}

export function trace(cpu: Cpu): string {
    let pc = cpu.registers.k.get().toString(16).padStart(2, "0")
        + cpu.registers.pc.get().toString(16).padStart(4, "0");
    let opcode = cpu.context.op.name.toLowerCase();
    let a = cpu.registers.a.get().toString(16).padStart(4, "0");
    let x = cpu.registers.x.get().toString(16).padStart(4, "0");
    let y = cpu.registers.y.get().toString(16).padStart(4, "0");
    let s = cpu.registers.sp.get().toString(16).padStart(4, "0");
    let d = cpu.registers.d.get().toString(16).padStart(4, "0");
    let db = cpu.registers.dbr.get().toString(16).padStart(2, "0");

    let nFlag = cpu.registers.p.getN() == 1 ? "N" : "n";
    let vFlag = cpu.registers.p.getV() == 1 ? "V" : "v";
    let mFlag = cpu.registers.p.getM() == 1 ? "M" : "m";
    let xFlag = cpu.registers.p.getX() == 1 ? "X" : "x";
    let dFlag = cpu.registers.p.getD() == 1 ? "D" : "d";
    let iFlag = cpu.registers.p.getI() == 1 ? "I" : "i";
    let zFlag = cpu.registers.p.getZ() == 1 ? "Z" : "z";
    let cFlag = cpu.registers.p.getC() == 1 ? "C" : "c";

    let p = nFlag + vFlag + mFlag + xFlag + dFlag + iFlag + zFlag + cFlag;

    return `${pc} ${opcode} A:${a} X:${x} Y:${y} S:${s} D:${d} DB:${db} ${p}`;
}

export class LogCard extends React.Component<IDebuggerCardProps, any> {

    public divLog: React.RefObject<HTMLDivElement>;
    public counter: number = 0;

    constructor(props : IDebuggerCardProps) {
        super(props);
        this.divLog = React.createRef<HTMLDivElement>();
    }

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: Readonly<IDebuggerCardProps>, prevState: Readonly<any>, snapshot?: any): void {
        this.divLog.current.scrollTop = this.divLog.current.scrollHeight;

        if (this.counter == 500) {
            this.divLog.current.innerHTML = '';
            this.counter = 0;
        }

        const newElement = document.createElement('span');
        newElement.innerText = trace(this.props.snes.cpu);
        this.divLog.current.appendChild(newElement);
        this.counter++;
    }
    public render() {
        return (
            <Card title="Logs" grow={true}>
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1, height: "419px"}} >
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <div ref={this.divLog} style={{display: "flex", flexDirection: "column", fontSize: "12px", height: "100%", overflowY: "auto"}}>

                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
