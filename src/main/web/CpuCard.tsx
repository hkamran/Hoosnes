import * as React from "react";
import {Card} from "./core/layout/Card";
import Console from "../app/Console";
import {Modes} from "../app/Modes";
import {EmulationRegister, Register, StatusRegister} from "../app/cpu/Registers";
import {CSSProperties} from "react";
import {Opcode} from "../app/cpu/Opcodes";

interface ICpuCardProps {
    snes: Console;
    addFetchFunction: (renderer) => void;
}

interface ICpuCardState {
    pc: number;
    k: number;
    x: number;
    y: number;
    sp: number;
    d: number;
    dbr: number;
    p: number;

    emulation: number;
    break: number;
    carry: number;
    zero: number;
    iqr: number;
    negative: number;
    decimal: number;
    accumulator: number;
    overflow: number;

    opCode: number;
    op: Opcode;
    opCycle: number;

    cycles: number;
}


export class CpuCard extends React.Component<ICpuCardProps, ICpuCardState> {

    public context: CanvasRenderingContext2D;

    constructor(props : ICpuCardProps) {
        super(props);
        this.state = {
            pc: 0,
            k: 0,
            x: 0,
            y: 0,
            sp: 0,
            d: 0,
            dbr: 0,
            p: 0,

            emulation: 0,
            break: 0,
            carry: 0,
            zero: 0,
            iqr: 0,
            negative: 0,
            decimal: 0,
            accumulator: 0,
            overflow: 0,

            opCode: 0,
            op: null,
            opCycle: 0,

            cycles: 0,
        };
    }

    public componentDidMount(): void {
        this.props.addFetchFunction(this.fetch.bind(this));
    }

    public fetch() {
        this.setState({
            pc: this.props.snes.cpu.registers.pc.get(),
            k: this.props.snes.cpu.registers.k.get(),
            x: this.props.snes.cpu.registers.x.get(),
            y: this.props.snes.cpu.registers.y.get(),
            sp: this.props.snes.cpu.registers.sp.get(),
            d: this.props.snes.cpu.registers.d.get(),
            dbr: this.props.snes.cpu.registers.dbr.get(),
            p: this.props.snes.cpu.registers.p.get(),

            emulation: this.props.snes.cpu.registers.e.get(),
            break: this.props.snes.cpu.registers.p.getB(),
            carry: this.props.snes.cpu.registers.p.getC(),
            zero: this.props.snes.cpu.registers.p.getZ(),
            negative: this.props.snes.cpu.registers.p.getN(),
            iqr: this.props.snes.cpu.registers.p.getI(),
            decimal: this.props.snes.cpu.registers.p.getD(),
            accumulator: this.props.snes.cpu.registers.p.getM(),
            overflow: this.props.snes.cpu.registers.p.getV(),

            opCode: this.props.snes.cpu.opCode,
            opCycle: this.props.snes.cpu.opCycle,
            op: this.props.snes.cpu.op,

            cycles: this.props.snes.cpu.cycles,
        });
    }

    public render() {

        return (
            <Card title="CPU">
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Information</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Cycles:</span>
                                    <span>{this.state.cycles}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)"}}>
                        <legend>Registers</legend>
                        <div style={{display: "flex", flexGrow: 1}}>
                            <ul style={{listStyle: "none", width: "130px", padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">PC:</span>
                                    <span>0x{this.state.pc.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">K:</span>
                                    <span>0x{this.state.k.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">X:</span>
                                    <span>0x{this.state.x.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Y:</span>
                                    <span>0x{this.state.y.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">SP:</span>
                                    <span>0x{this.state.sp.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">D:</span>
                                    <span>0x{this.state.d.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">DBR:</span>
                                    <span>0x{this.state.dbr.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">P:</span>
                                    <span>0x{this.state.p.toString(16).toUpperCase()}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)"}}>
                        <legend>Flags</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, width: "120px", padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Emulation:</span>
                                    <span>{this.state.emulation.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Break:</span>
                                    <span>{this.state.break.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Carry:</span>
                                    <span>{this.state.carry.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Zero:</span>
                                    <span>{this.state.zero.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">IQR:</span>
                                    <span>{this.state.iqr.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Decimal:</span>
                                    <span>{this.state.decimal.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Negative:</span>
                                    <span>{this.state.negative.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Accumulator:</span>
                                    <span>{this.state.accumulator.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Overflow:</span>
                                    <span>{this.state.overflow.toString(16).toUpperCase()}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Operation</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Code:</span>
                                    <span>{this.state.op ? "0x" + this.state.opCode.toString(16) : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Name:</span>
                                    <span>{this.state.op ? this.state.op.name.toUpperCase() : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Cycles:</span>
                                    <span>{this.state.opCycle}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <div style={{paddingTop: '7px'}}>
                        <button onClick={this.fetch.bind(this)}>Render</button>
                    </div>
                </div>
            </Card>
        );
    }

}
