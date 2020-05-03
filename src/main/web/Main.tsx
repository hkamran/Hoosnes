import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Console, ConsoleState} from "../app/Console";
import {ScreenCard} from "./ScreenCard";
import {Operation} from "../app/cpu/Opcodes";
import {AddressUtil} from "../app/util/AddressUtil";
import ReactTooltip from "react-tooltip";
import {debugCallback, Debugger} from "./debugger/Debugger";
import {CartridgeModal} from "./CartridgeModal";
import Modal from 'react-modal';
import {Keyboard, KeyboardMapping} from "./Keyboard";
import {joy1, Key} from "../app/controller/Controller";

declare let window: any;
window.snes = new Console();

const customStyles = {
    content: {
        top: '350px',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: "rgb(222, 222, 222)",
        border: "1px solid #dedede",
    },
    overlay: {
        backgroundColor: 'rgba(26,26,26,0.76)',
    },
};
Modal.setAppElement('#main');

export function animateFrames(): void {
    let execution = function() {
        if (window.snes.state == ConsoleState.RUNNING) {
            window.snes.ticks(window.snes.tpf);
            debugCallback();
            animateFrames.bind(this)();
        }
    }.bind(this);
    requestAnimationFrame(execution);
}

interface IMainStates {
    snes: Console;
    viewDebugger: boolean;
    viewCartridge: boolean;
    viewSettings: boolean;
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
            viewCartridge: false,
            viewSettings: false,
        };

        this.fileInputRef = React.createRef<HTMLInputElement>();
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

    public async loadCartridgeRemotely(url: string) {
        let file = await fetch(url).then((r) => r.blob());
        let promise = this.readFileDataAsBase64(file);
        promise.then((value: number[]) => {
            if (value == null || value.length == 0) return;
            this.props.snes.load(value);
            this.play();
        });
    }

    public loadCartridgeLocally(): void {
        this.fileInputRef.current.click();
    }

    public closeCartridge(): void {
        this.setState({
            viewCartridge: false,
        });
    }

    public openCartridge(): void {
        this.setState({
            viewCartridge: true,
        });
    }

    public openSettings(): void {
        this.setState({
            viewSettings: true,
        });
    }

    public closeSettings(): void {
        this.setState({
            viewSettings: false,
        });
    }

    public onChangeFile(event) {
        let file: File = event.target.files[0];
        let promise = this.readFileDataAsBase64(file);
        promise.then((value: number[]) => {
            if (value == null || value.length == 0) return;
            this.props.snes.load(value);
            this.play();
        });
    }

    private play() {
        if (this.props.snes.state != ConsoleState.RUNNING) {
            this.props.snes.play();
            animateFrames();
        }
    }

    public zoomIn() {
        this.props.snes.ppu.screen.zoomIn();
    }

    public zoomOut() {
        this.props.snes.ppu.screen.zoomOut();
    }

    public readFileDataAsBase64(file: Blob) {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                let str: string = event.target.result;
                window.raw = str;
                let bytes: number[] = [];
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

    public async selectCartridge(event) {
        let selectElement = event.target;
        let value: string = selectElement.value;

        if (value == "other") {
            this.loadCartridgeLocally();
        } else if (value == "select") {
            return;
        } else {
            this.loadCartridgeRemotely(value);
        }

        this.closeCartridge();
    }

    public render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', margin: '0 auto'}}>
                <Modal isOpen={this.state.viewCartridge} style={customStyles}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div className={"cartridge-title"}>Select Cartridge</div>
                            <div style={{flexGrow: 1, width: "70px"}}/>
                            <a style={{color: "#656565", cursor: "pointer"}} onClick={this.closeCartridge.bind(this)}>
                                <i className="fas fa-times"/>
                            </a>
                        </div>
                        <hr/>
                        <div className={"modal-content"} style={{display: 'flex', flexDirection: 'row'}}>
                            <select className={"cartridge-select"} defaultValue={"select"}
                                    onChange={this.selectCartridge.bind(this)}>
                                <option value="select">Select</option>
                                <option value="./roms/Dr. Mario (Japan) (NP).sfc">Dr Mario</option>
                                <option value="other">Load my own...</option>
                            </select>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.viewSettings} style={customStyles}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div className={"cartridge-title"}>Settings</div>
                            <div style={{flexGrow: 1, width: "70px"}}/>
                            <a style={{color: "#656565", cursor: "pointer"}} onClick={this.closeSettings.bind(this)}>
                                <i className="fas fa-times"/>
                            </a>
                        </div>
                        <hr/>
                        <div className={"modal-content"} style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{border: "1px solid #9f9f9f", paddingTop: "1px", borderRadius: "2px", display: 'flex', flexDirection: 'row'}}>
                                <table style={{width: "150px"}}>
                                    <thead>
                                    <tr>
                                        <th style={{width: "50%"}}>Button</th>
                                        <th style={{minWidth: "50px"}}>Key</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Up</td>
                                        <td>{KeyboardMapping.UP}</td>
                                    </tr>
                                    <tr>
                                        <td>Down</td>
                                        <td>{KeyboardMapping.DOWN}</td>
                                    </tr>
                                    <tr>
                                        <td>Left</td>
                                        <td>{KeyboardMapping.LEFT}</td>
                                    </tr>
                                    <tr>
                                        <td>Right</td>
                                        <td>{KeyboardMapping.RIGHT}</td>
                                    </tr>
                                    <tr>
                                        <td>START</td>
                                        <td>{KeyboardMapping.START}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table style={{width: "150px"}}>
                                    <thead>
                                    <tr>
                                        <th style={{width: "50%"}}>Button</th>
                                        <th style={{minWidth: "50px"}}>Key</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>X</td>
                                        <td>{KeyboardMapping.X}</td>
                                    </tr>
                                    <tr>
                                        <td>Y</td>
                                        <td>{KeyboardMapping.Y}</td>
                                    </tr>
                                    <tr>
                                        <td>A</td>
                                        <td>{KeyboardMapping.A}</td>
                                    </tr>
                                    <tr>
                                        <td>B</td>
                                        <td>{KeyboardMapping.B}</td>
                                    </tr>
                                    <tr>
                                        <td>SELECT</td>
                                        <td>{KeyboardMapping.SELECT}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Debugger snes={this.state.snes} display={this.state.viewDebugger}
                          closeCallback={this.closeDebugger.bind(this)}/>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className={"logo"} style={{width: "100px", marginRight: "10px"}}>
                        <div className={"header"}>
                            HOOSNES
                        </div>
                        <h2 className={"line"}>
                            EMULATOR
                        </h2>
                    </div>
                    <div style={{flexGrow: 1}}/>
                    <a className={"menu-button green"} data-tip="Load Game" onClick={async () => {
                        this.openCartridge();
                    }}>
                        <div>
                            <i className="fas fa-download"/>
                        </div>
                    </a>
                    <a className={"menu-button blue"} data-tip="Net Play">
                        <div>
                            <i className="fas fa-user-friends"/>
                        </div>
                    </a>
                    <a className={"menu-button yellow"} data-tip="Settings" onClick={this.openSettings.bind(this)}>
                        <div>
                            <i className="fas fa-cog" />
                        </div>
                    </a>
                    <a className={"menu-button red"} data-tip="Debugger" onClick={this.openDebugger.bind(this)}>
                        <div>
                            <i className="fas fa-wrench"/>
                        </div>
                    </a>
                </div>
                <div className={"screen-container"}>
                    <ScreenCard snes={window.snes}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: "30px"}}>
                    <div style={{flexGrow: 1}}/>
                    <div className={"extra-button-wrapper"}>
                        <a className={"extra-button"} data-tip="Zoom out" onClick={this.zoomOut.bind(this)}>
                            <div>
                                <i className="fas fa-minus"/>
                            </div>
                        </a>
                    </div>
                    <div className={"extra-button-wrapper"}>
                        <a className={"extra-button"} data-tip="Zoom in" onClick={this.zoomIn.bind(this)}>
                            <div>
                                <i className="fas fa-plus"/>
                            </div>
                        </a>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: "30px"}}>
                    <div className={"footer"}>
                        Author: <a href="https://github.com/hkamran">Hooman Kamran</a>
                    </div>
                </div>
                <input type="file" id="file" ref={this.fileInputRef} onChange={this.onChangeFile.bind(this)}
                       style={{display: "none"}}/>
                <ReactTooltip/>
            </div>
        );
    }

}

ReactDOM.render(
    <Main snes={window.snes}/>,
    document.getElementById('main'),
);

Keyboard.initialize(joy1);
