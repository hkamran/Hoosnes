import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Core from './core/Core';
import {Console} from "../app/Console";
import {ScreenCard} from "./ScreenCard";
import {PaletteCard} from "./PaletteCard";
import {CartridgeCard} from "./CartridgeCard";
import {SpriteCard} from "./SpriteCards";
import {CpuCard} from "./CpuCard";
import {DebuggerCard} from "./DebuggerCard";
import {Card} from "./core/layout/Card";
import {Register, Registers} from "../app/cpu/Registers";
import {Operation} from "../app/cpu/Opcodes";
import {PpuCard} from "./PpuCard";
import {TileCard} from "./TileCard";
import {BackgroundsCard} from "./BackgroundsCard";

declare let window : any;
window.snes = new Console();

interface IMainProps {
    snes: Console;
}

export class TickEvent {
    public op: Operation;
    public cycle: number;
    public registerK: number;
    public registerPC: number;

    constructor(snes: Console) {
        this.cycle = snes.cpu.cycles;
        this.op = snes.cpu.context.op;

        this.registerK = snes.cpu.context.opaddr.getBank();
        this.registerPC = snes.cpu.context.opaddr.getPage();
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
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <ScreenCard snes={window.snes} />
                        <SpriteCard snes={window.snes} />
                        <TileCard snes={window.snes} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <BackgroundsCard snes={window.snes} />
                        <PaletteCard snes={window.snes} />
                        <CartridgeCard snes={window.snes} cartridge={window.snes.cartridge} />
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <PpuCard snes={window.snes} addFetchFunction={this.addFetchFunction.bind(this)} />
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
