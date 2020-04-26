import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Console} from "../../../app/Console";
import {InterruptType} from "../../../app/cpu/Interrupts";
import {AddressUtil} from "../../../app/util/AddressUtil";

interface ICpuCardProps {
    snes: Console;
    addFetchFunction?: (renderer) => void;
}

export class CpuCard extends React.Component<ICpuCardProps, any> {

    public context: CanvasRenderingContext2D;

    constructor(props : ICpuCardProps) {
        super(props);
    }

    public render() {
        let cpu = this.props.snes.cpu;
        let op = cpu.context && cpu.context.op ? cpu.context.op : null;
        let stack = cpu.stack.stack;

        let pc = cpu.context ? AddressUtil.getPage(cpu.context.opaddr) : 0;
        let k = cpu.context ? AddressUtil.getBank(cpu.context.opaddr): 0;

        return (
            <Card title="CPU">
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Information</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Cycles:</span>
                                    <span>{cpu.cycles}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Interrupt:</span>
                                    <span>{InterruptType[cpu.interrupts.interrupt]}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Ticks:</span>
                                    <span>{this.props.snes.cpu.ticks}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)"}}>
                        <legend>Registers</legend>
                        <div style={{display: "flex", flexGrow: 1}}>
                            <ul style={{listStyle: "none", width: "100%", padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">PC:</span>
                                    <span>0x{pc.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">K:</span>
                                    <span>0x{k.toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">A:</span>
                                    <span>0x{cpu.registers.a.get().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">X:</span>
                                    <span>0x{cpu.registers.x.get().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Y:</span>
                                    <span>0x{cpu.registers.y.get().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">SP:</span>
                                    <span>0x{cpu.registers.sp.get().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">D:</span>
                                    <span>0x{cpu.registers.d.get().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">DBR:</span>
                                    <span>0x{cpu.registers.dbr.get().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">P:</span>
                                    <span>0x{cpu.registers.p.get().toString(16).toUpperCase()}</span>
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
                                    <span>{cpu.registers.p.getE().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Break:</span>
                                    <span>{cpu.registers.p.getX().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Carry:</span>
                                    <span>{cpu.registers.p.getC().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Zero:</span>
                                    <span>{cpu.registers.p.getZ().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">IQR:</span>
                                    <span>{cpu.registers.p.getI().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Decimal:</span>
                                    <span>{cpu.registers.p.getD().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Negative:</span>
                                    <span>{cpu.registers.p.getN().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Accumulator:</span>
                                    <span>{cpu.registers.p.getM().toString(16).toUpperCase()}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Overflow:</span>
                                    <span>{cpu.registers.p.getV().toString(16).toUpperCase()}</span>
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
                                    <span>{op != null ? "0x" +op.code.toString(16).toUpperCase() : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Name:</span>
                                    <span>{op != null ? op.name.toUpperCase() : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Mode:</span>
                                    <span>{op != null ? op.mode.label : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Cycles:</span>
                                    <span>{op != null ? op.cycle : ""}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Size:</span>
                                    <span>{op != null ? op.getSize() : ""}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Stack</legend>
                        <div style={{display: "block", fontSize: "12px"}}>
                            {stack.map((value, index) => {
                                return (
                                    <span key={index}>0x{value.toString(16).toUpperCase() + ", "}</span>
                                );
                            })}
                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
