import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Console} from "../../../app/Console";
import {ScreenState} from "../../../app/ppu/Screen";

interface IPpuCardProps {
    snes: Console;
}

export class PpuCard extends React.Component<IPpuCardProps, any> {

    public context: CanvasRenderingContext2D;

    constructor(props : IPpuCardProps) {
        super(props);
    }

    public render() {
        let ppu = this.props.snes.ppu;
        let registers = this.props.snes.ppu.registers;

        return (
            <Card title="PPU">
                <div style={{display: "flex", flexDirection: "column", flexGrow: 1, width: "300px"}}>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Information</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", width: "100%", padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Scanline:</span>
                                    <span>{ppu.scanline}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Cycle:</span>
                                    <span>{ppu.cycle}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Screen State:</span>
                                    <span>{ScreenState[ppu.screen.state]}</span>
                                </li>
                                <li style={{display: "flex"}}>
                                    <span style={{flexGrow: 1}} className="header">Frames:</span>
                                    <span>{ppu.frames}</span>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <legend>Registers</legend>
                        <div style={{display: "flex"}}>
                            <ul style={{listStyle: "none", flexGrow: 1, padding: "0px", margin: "0px", paddingRight: "0px", fontSize: "12px"}}>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.inidisp.label} ({registers.inidisp.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Brightness:</span>
                                            <span>{registers.inidisp.brightness / 17}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Display:</span>
                                            <span>{registers.inidisp.forceBlankEnable.toString().toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.oamselect.label} ({registers.oamselect.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Size:</span>
                                            <span>{registers.oamselect.getSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Name Select:</span>
                                            <span>{registers.oamselect.getNameSelection()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Base Select:</span>
                                            <span>0x{registers.oamselect.getBaseSelection().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.oamaddr.label} ({registers.oamaddr.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Priority:</span>
                                            <span>{registers.oamaddr.getPriority()}</span>
                                        </li>
                                        <li style={{display: "flex"}} >
                                            <span style={{flexGrow: 1}} className="header">Table Selection:</span>
                                            <span>{registers.oamaddr.getTableSelection()}</span>
                                        </li>
                                        <li style={{display: "flex"}} >
                                            <span style={{flexGrow: 1}} className="header">Table Index:</span>
                                            <span>{registers.oamaddr.getTableIndex()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bgmode.label} ({registers.bgmode.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 Tile Size:</span>
                                            <span>{registers.bgmode.getBG4TileSize().toString()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Tile Size:</span>
                                            <span>{registers.bgmode.getBG3TileSize().toString()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Tile Size:</span>
                                            <span>{registers.bgmode.getBG2TileSize().toString()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Tile Size:</span>
                                            <span>{registers.bgmode.getBG1TileSize().toString()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Priority:</span>
                                            <span>{registers.bgmode.getBG3Priority().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mode:</span>
                                            <span>{registers.bgmode.getMode()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.mosaic.label} ({registers.mosaic.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mosaic Size:</span>
                                            <span>{registers.mosaic.getMosaicSize()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 Mosaic Enable:</span>
                                            <span>{registers.mosaic.getBG4MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Mosaic Enable:</span>
                                            <span>{registers.mosaic.getBG3MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Mosaic Enable:</span>
                                            <span>{registers.mosaic.getBG2MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Mosaic Enable:</span>
                                            <span>{registers.mosaic.getBG1MosaicEnable().toString().toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vtilebg1.label} ({registers.vtilebg1.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{registers.vtilebg1.getTileMapAddress().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{registers.vtilebg1.getDimension().toString()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vtilebg2.label} ({registers.vtilebg2.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{registers.vtilebg2.getTileMapAddress().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{registers.vtilebg2.getDimension().toString()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vtilebg3.label} ({registers.vtilebg3.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{registers.vtilebg3.getTileMapAddress().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{registers.vtilebg3.getDimension().toString()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vtilebg4.label} ({registers.vtilebg4.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Tile Address:</span>
                                            <span>{registers.vtilebg4.getTileAddress().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Screen Size:</span>
                                            <span>{registers.vtilebg4.getDimension().toString()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vcharlocbg12.label} ({registers.vcharlocbg12.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Base Address:</span>
                                            <span>0x{registers.vcharlocbg12.getBaseAddressForBG1().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Base Address:</span>
                                            <span>0x{registers.vcharlocbg12.getBaseAddressForBG2().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vcharlocbg34.label} ({registers.vcharlocbg34.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 Base Address:</span>
                                            <span>0x{registers.vcharlocbg34.getBaseAddressForBG3().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 Base Address:</span>
                                            <span>0x{registers.vcharlocbg34.getBaseAddressForBG4().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg1hofs.label} ({registers.bg1hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mode 7 Scroll V-offset:</span>
                                            <span>0x{registers.bg1hofs.getBG1Mode7HortOffset().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Scroll V-offset:</span>
                                            <span>0x{registers.bg1hofs.getBG1HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg1vofs.label} ({registers.bg1vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">Mode 7 Scroll V-offset:</span>
                                            <span>0x{registers.bg1vofs.getBG1Mode7VertOffset().toString(16)}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG1 Scroll V-offset:</span>
                                            <span>0x{registers.bg1vofs.getBG1VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg2hofs.label} ({registers.bg2hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Scroll H-offset:</span>
                                            <span>0x{registers.bg2hofs.getBG2HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg2vofs.label} ({registers.bg2vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG2 Scroll V-offset:</span>
                                            <span>0x{registers.bg2vofs.getBG2VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg3hofs.label} ({registers.bg3hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 SCroll H-offset:</span>
                                            <span>0x{registers.bg3hofs.getBG3HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg3vofs.label} ({registers.bg3vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG3 SCroll V-offset:</span>
                                            <span>0x{registers.bg3vofs.getBG3VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg4hofs.label} ({registers.bg4hofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 SCroll H-offset:</span>
                                            <span>0x{registers.bg4hofs.getBG4HortOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.bg4vofs.label} ({registers.bg4vofs.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">BG4 SCroll V-offset:</span>
                                            <span>0x{registers.bg4vofs.getBG4VertOffset().toString(16)}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vportcntrl.label} ({registers.vportcntrl.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Increment Mode:</span>
                                            <span>0x{registers.vportcntrl.getAddressIncrementMode()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Increment Formation:</span>
                                            <span>0x{registers.vportcntrl.getAddressFormation()}</span>
                                        </li>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Increment Size:</span>
                                            <span>0x{registers.vportcntrl.getAddressIncrementAmount()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.vaddr.label} ({registers.vaddr.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">VRAM Address:</span>
                                            <span>0x{registers.vaddr.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.cgramaddr.label} ({registers.cgramaddr.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">CGRAM Address:</span>
                                            <span>0x{registers.cgramaddr.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.scanlochort.label} ({registers.scanlochort.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">H-counter:</span>
                                            <span>0x{registers.scanlochort.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.scanlocvert.label} ({registers.scanlocvert.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">V-counter:</span>
                                            <span>0x{registers.scanlocvert.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                                <li style={{display: "flex", flexDirection: "column"}}>
                                    <span style={{flexGrow: 1}} className="header">{registers.scanlocvert.label} ({registers.scanlocvert.address})</span>
                                    <ul style={{margin: "5px"}}>
                                        <li style={{display: "flex"}}>
                                            <span style={{flexGrow: 1}} className="header">V-counter:</span>
                                            <span>0x{registers.scanlocvert.get().toString(16).toUpperCase()}</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
