import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import Console from './../app/Console';
import {ScreenCard} from "./ScreenCard";
import {PaletteCard} from "./PaletteCard";
import {CartridgeCard} from "./CartridgeCard";
import {SpriteCard} from "./SpriteCards";
import {CpuCard} from "./CpuCard";
import {DebuggerCard} from "./DebuggerCard";
import {Card} from "./core/layout/Card";
import {Register, Registers} from "../app/cpu/Registers";

declare let window : any;
window.snes = new Console();

interface IMainProps {
    snes: Console;
}

export class TickEvent {
    public opcode: number;
    public cycle: number;
    public opname: string;
    public registerK: number;
    public registerPC: number;

    constructor(snes: Console) {
        this.opcode = snes.cpu.opCode;
        this.cycle = snes.cpu.cycles;
        this.opname = snes.cpu.op ? snes.cpu.op.name : "NULL";

        this.registerK = snes.cpu.registers.k.get();
        this.registerPC = snes.cpu.registers.pc.get();
    }
}

export class Main extends React.Component<IMainProps, any> {

    constructor(props : IMainProps) {
        super(props);
        this.state = {
            fetches: [],
            logs: [],
        };
    }

    public componentDidMount(): void {

    }

    public tick() {
        this.props.snes.tick();

        this.state.logs.push(new TickEvent(this.props.snes));

        for (let fetch of this.state.fetches) {
            fetch();
        }

        this.setState({
            logs: this.state.logs,
        });
    }

    public addFetchFunction(fetch: () => void) {
        let fetches = this.state.fetches;
        fetches.push(fetch);

        this.setState({
           fetches,
        });
    }

    public render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <ScreenCard snes={window.snes} />
                    <PaletteCard snes={window.snes} />
                    <SpriteCard snes={window.snes} />
                    <CartridgeCard snes={window.snes} cartridge={window.snes.cartridge} />
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <CpuCard snes={window.snes} addFetchFunction={this.addFetchFunction.bind(this)} />
                    <DebuggerCard snes={window.snes} tick={this.tick.bind(this)} logs={this.state.logs} />
                </div>
            </div>
        );
    }

}

ReactDOM.render(
    <Main snes={window.snes} />,
    document.getElementById('main'),
);
