import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Console} from "../app/Console";
import {ScreenCard} from "./ScreenCard";
import {Operation} from "../app/cpu/Opcodes";
import {AddressUtil} from "../app/util/AddressUtil";
import ReactTooltip from "react-tooltip";

declare let window: any;
window.snes = new Console();

interface IMainStates {
    fetches: Array<() => void>;
    logs: TickEvent[];
}

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

        this.registerK = AddressUtil.getBank(snes.cpu.context.opaddr);
        this.registerPC = AddressUtil.getPage(snes.cpu.context.opaddr);
    }
}

export class Main extends React.Component<IMainProps, IMainStates> {

    constructor(props: IMainProps) {
        super(props);
        this.state = {
            fetches: [],
            logs: [],
        };
    }

    public componentDidMount(): void {

    }

    public tick() {
        try {
            this.props.snes.tick();
        } catch (e) {
            console.error(e);
        }

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
            <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className={"logo"} style={{width: "100px", marginRight: "10px"}}>
                        <div className={"header"}>
                            HOOSNES
                        </div>
                        <h2 className={"line"}>
                            EMULATOR
                        </h2>
                    </div>
                    <div style={{flexGrow: 1}} />
                    <a className={"menu-button green"} data-tip="Load Game" >
                        <div>
                            <i className="fas fa-download"/>
                        </div>
                    </a>
                    <a className={"menu-button blue"} data-tip="Net Play">
                        <div>
                            <i className="fas fa-user-friends"/>
                        </div>
                    </a>
                    <a className={"menu-button yellow"} data-tip="Settings">
                        <div>
                            <i className="fas fa-cog"/>
                        </div>
                    </a>
                    <a className={"menu-button red"} data-tip="Debugger">
                        <div>
                            <i className="fas fa-wrench"/>
                        </div>
                    </a>
                </div>
                <div className={"screen-container"} >
                    <ScreenCard snes={window.snes}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: "30px"}}>
                    <div style={{flexGrow: 1}} />
                    <div className={"extra-button-wrapper"}>
                        <a className={"extra-button"} data-tip="Zoom out">
                            <div>
                                <i className="fas fa-minus" />
                            </div>
                        </a>
                    </div>
                    <div className={"extra-button-wrapper"}>
                        <a className={"extra-button"} data-tip="Zoom in">
                            <div>
                                <i className="fas fa-plus" />
                            </div>
                        </a>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: "30px"}}>
                    <div className={"footer"}>
                        Author: <a href="https://github.com/hkamran">Hooman Kamran</a>
                    </div>
                </div>
                <ReactTooltip />
            </div>
        );
    }

}

ReactDOM.render(
    <Main snes={window.snes}/>,
    document.getElementById('main'),
);
