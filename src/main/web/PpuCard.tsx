import * as React from "react";
import {Card} from "./core/layout/Card";
import {Console} from "../app/Console";
import {Modes} from "../app/Modes";
import {Register, StatusRegister} from "../app/cpu/Registers";
import {CSSProperties} from "react";
import {Operation} from "../app/cpu/Opcodes";
import {Registers} from "../app/ppu/Registers";
import {Ppu, ScreenType} from "../app/ppu/Ppu";

interface IPpuCardProps {
    snes: Console;
    addFetchFunction: (renderer) => void;
}

interface IPpuCardState {
    registers: Registers;
    ppu: Ppu;
}


export class PpuCard extends React.Component<IPpuCardProps, IPpuCardState> {

    public context: CanvasRenderingContext2D;

    constructor(props : IPpuCardProps) {
        super(props);
        this.state = {
            registers: props.snes.ppu.registers,
            ppu: props.snes.ppu,
        };
    }

    public componentDidMount(): void {
        this.props.addFetchFunction(this.fetch.bind(this));
    }

    public fetch() {
        this.setState({
            registers: this.props.snes.ppu.registers,
            ppu: this.props.snes.ppu,
        });
    }

    public render() {
        return (
            <Card title="PPU">
                <div style={{display: "flex", flexDirection: "column", flexGrow: 1, width: "300px"}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Information</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", width: "100%", padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Scanline:</span>
                                    <span>{this.state.ppu.scanline}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Cycle:</span>
                                    <span>{this.state.ppu.cycle}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Screen State:</span>
                                    <span>{ScreenType[this.state.ppu.state]}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Frames:</span>
                                    <span>{this.state.ppu.frames}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Registers</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.inidisp.label} ({this.state.registers.inidisp.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Brightness:</span>
                                            <span>{this.state.registers.inidisp.getBrightness() / 17}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Display:</span>
                                            <span>{this.state.registers.inidisp.getDisplayOff().toString().toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.oamselect.label} ({this.state.registers.oamselect.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Size:</span>
                                            <span>{this.state.registers.oamselect.getSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Name Select:</span>
                                            <span>{this.state.registers.oamselect.getNameSelection()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Base Select:</span>
                                            <span>0x{this.state.registers.oamselect.getBaseSelection().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.oamaddr.label} ({this.state.registers.oamaddr.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Priority:</span>
                                            <span>{this.state.registers.oamaddr.getPriority()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Table Address:</span>
                                            <span>{this.state.registers.oamaddr.getTableAddress()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bgmode.label} ({this.state.registers.bgmode.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 Tile Size:</span>
                                            <span>{this.state.registers.bgmode.getBG4TileSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Tile Size:</span>
                                            <span>{this.state.registers.bgmode.getBG3TileSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Tile Size:</span>
                                            <span>{this.state.registers.bgmode.getBG2TileSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Tile Size:</span>
                                            <span>{this.state.registers.bgmode.getBG1TileSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Priority:</span>
                                            <span>{this.state.registers.bgmode.getBG3Priority().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mode:</span>
                                            <span>{this.state.registers.bgmode.getMode()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.mosaic.label} ({this.state.registers.mosaic.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mosaic Size:</span>
                                            <span>{this.state.registers.mosaic.getMosaicSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 Mosaic Enable:</span>
                                            <span>{this.state.registers.mosaic.getBG4MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Mosaic Enable:</span>
                                            <span>{this.state.registers.mosaic.getBG3MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Mosaic Enable:</span>
                                            <span>{this.state.registers.mosaic.getBG2MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Mosaic Enable:</span>
                                            <span>{this.state.registers.mosaic.getBG1MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vtilebg1.label} ({this.state.registers.vtilebg1.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{this.state.registers.vtilebg1.getTileAddress()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{this.state.registers.vtilebg1.getScreenSize()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vtilebg2.label} ({this.state.registers.vtilebg2.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{this.state.registers.vtilebg2.getTileAddress()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{this.state.registers.vtilebg2.getScreenSize()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vtilebg3.label} ({this.state.registers.vtilebg3.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{this.state.registers.vtilebg3.getTileAddress()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{this.state.registers.vtilebg3.getScreenSize()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vtilebg4.label} ({this.state.registers.vtilebg4.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{this.state.registers.vtilebg4.getTileAddress()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{this.state.registers.vtilebg4.getScreenSize()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vcharlocbg12.label} ({this.state.registers.vcharlocbg12.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Base Address:</span>
                                            <span>0x{this.state.registers.vcharlocbg12.getBaseAddressForBG1().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Base Address:</span>
                                            <span>0x{this.state.registers.vcharlocbg12.getBaseAddressForBG2().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vcharlocbg34.label} ({this.state.registers.vcharlocbg34.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Base Address:</span>
                                            <span>0x{this.state.registers.vcharlocbg34.getBaseAddressForBG3().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 Base Address:</span>
                                            <span>0x{this.state.registers.vcharlocbg34.getBaseAddressForBG4().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg1hofs.label} ({this.state.registers.bg1hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mode 7 Scroll V-offset:</span>
                                            <span>0x{this.state.registers.bg1hofs.getBG1Mode7HortOffset().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Scroll V-offset:</span>
                                            <span>0x{this.state.registers.bg1hofs.getBG1HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg1vofs.label} ({this.state.registers.bg1vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mode 7 Scroll V-offset:</span>
                                            <span>0x{this.state.registers.bg1vofs.getBG1Mode7VertOffset().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Scroll V-offset:</span>
                                            <span>0x{this.state.registers.bg1vofs.getBG1VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg2hofs.label} ({this.state.registers.bg2hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Scroll H-offset:</span>
                                            <span>0x{this.state.registers.bg2hofs.getBG2HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg2vofs.label} ({this.state.registers.bg2vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Scroll V-offset:</span>
                                            <span>0x{this.state.registers.bg2vofs.getBG2VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg3hofs.label} ({this.state.registers.bg3hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 SCroll H-offset:</span>
                                            <span>0x{this.state.registers.bg3hofs.getBG3HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg3vofs.label} ({this.state.registers.bg3vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 SCroll V-offset:</span>
                                            <span>0x{this.state.registers.bg3vofs.getBG3VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg4hofs.label} ({this.state.registers.bg4hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 SCroll H-offset:</span>
                                            <span>0x{this.state.registers.bg4hofs.getBG4HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.bg4vofs.label} ({this.state.registers.bg4vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 SCroll V-offset:</span>
                                            <span>0x{this.state.registers.bg4vofs.getBG4VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vportcntrl.label} ({this.state.registers.vportcntrl.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Increment Mode:</span>
                                            <span>0x{this.state.registers.vportcntrl.getAddressIncrementMode()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Increment Formation:</span>
                                            <span>0x{this.state.registers.vportcntrl.getAddressFormation()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Increment Size:</span>
                                            <span>0x{this.state.registers.vportcntrl.getAddressIncrementAmount()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.vaddr.label} ({this.state.registers.vaddr.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Address:</span>
                                            <span>0x{this.state.registers.vaddr.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.cgramaddr.label} ({this.state.registers.cgramaddr.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">CGRAM Address:</span>
                                            <span>0x{this.state.registers.cgramaddr.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.scanlochort.label} ({this.state.registers.scanlochort.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">H-counter:</span>
                                            <span>0x{this.state.registers.scanlochort.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.scanlocvert.label} ({this.state.registers.scanlocvert.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">V-counter:</span>
                                            <span>0x{this.state.registers.scanlocvert.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.scanlocvert.label} ({this.state.registers.scanlocvert.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">V-counter:</span>
                                            <span>0x{this.state.registers.scanlocvert.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.stat77.label} ({this.state.registers.stat77.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Range over:</span>
                                            <span>{this.state.registers.stat77.getRangeOver().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Time over:</span>
                                            <span>{this.state.registers.stat77.getTimeOver().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Version:</span>
                                            <span>{this.state.registers.stat77.getVersion().toString().toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{this.state.registers.stat78.label} ({this.state.registers.stat78.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Field:</span>
                                            <span>{this.state.registers.stat78.getField().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Counters Latched:</span>
                                            <span>{this.state.registers.stat78.getCountersLatched().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Region:</span>
                                            <span>{this.state.registers.stat78.getRegion().toString()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Version:</span>
                                            <span>{this.state.registers.stat78.getVersion().toString()}</span>
                                        </li>
                                    </ul>
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
