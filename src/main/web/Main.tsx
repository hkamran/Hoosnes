import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Console} from "../app/Console";
import {ScreenCard} from "./ScreenCard";
import {Operation} from "../app/cpu/Opcodes";
import {AddressUtil} from "../app/util/AddressUtil";
import ReactTooltip from "react-tooltip";
import {Debugger} from "./debugger/Debugger";

declare let window: any;
window.snes = new Console();

interface IMainStates {
    snes: Console;
    viewDebugger: boolean;
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

    public fileInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: IMainProps) {
        super(props);
        this.state = {
            snes: props.snes,
            viewDebugger: false,
        };

        this.fileInputRef = React.createRef<HTMLInputElement>();
    }

    public componentDidMount(): void {

    }

    public openDebugger(): void {
        this.setState({
            viewDebugger: true,
            snes: this.state.snes,
        });
    }

    public closeDebugger(): void {
        this.setState({
            viewDebugger: false,
        });
    }

    public onChangeFile(event) {
        let file : File = event.target.files[0];
        let promise = this.readFileDataAsBase64(file);
        promise.then((value: number[]) => {
            this.props.snes.load(value);
        });
    }

    public readFileDataAsBase64(file : Blob) {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event : any) => {
                let str : string = event.target.result;
                window.raw = str;
                let bytes : number[] = [];
                for (let i = 0; i < str.length; ++i) {
                    let charCode = str.charCodeAt(i);
                    bytes.push(charCode & 0xFF);
                }
                resolve(bytes);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsBinaryString(file);
        });
    }

    private tickSnes() {
        this.state.snes.tick();
        this.setState({
            snes: this.state.snes,
        });
    }

    public render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto'}}>
                <Debugger snes={this.state.snes} display={this.state.viewDebugger} closeDebugger={this.closeDebugger.bind(this)} tickSnes={this.tickSnes.bind(this)} />
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
                    <a className={"menu-button green"} data-tip="Load Game" onClick={()=> this.fileInputRef.current.click()}>
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
                    <a className={"menu-button red"} data-tip="Debugger" onClick={this.openDebugger.bind(this)}>
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
                <input type="file" id="file" ref={this.fileInputRef} onChange={this.onChangeFile.bind(this)} style={{display: "none"}}/>
                <ReactTooltip />
            </div>
        );
    }

}

ReactDOM.render(
    <Main snes={window.snes}/>,
    document.getElementById('main'),
);
