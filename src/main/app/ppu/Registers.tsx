import {Ppu} from "./Ppu";
import {Mode, Modes} from "../Modes";
import Console from "../Console";
import {CGram} from "../memory/CGram";
import {Bit} from "../util/Bit";
import {Objects} from "../util/Objects";

const INVALID_SET: string = "Invalid value set";

// http://baltimorebarcams.com/eb/snes/docs/65816/SNES%20Registers.html
// https://en.wikibooks.org/wiki/Super_NES_Programming/SNES_Hardware_Registers
// https://wiki.superfamicom.org/registers

export class Register {

    protected val : number = 0;
    protected mode : Mode = Modes.bit8;
    public console: Console;
    public label: string;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.ppu);
        Objects.requireNonNull(console.ppu.registers);

        this.console = console;
    }

    public set(val : number): void {
        if (val == null || val < 0) {
            throw Error("Invalid set " + val + " to register.");
        }
        if (this.mode == Modes.bit8 && this.val > 0xFF) throw new Error("value is to big for register");
        this.val = val;
    }

    public get(): number {
        return this.val;
    }

}

export class ScreenDisplayRegister extends Register {

    public address: string = "0x2100";
    public label: string = "INIDISP";

    public val: number = 0x8F;

    public getDisplayOff(): boolean {
        return ((this.val >> 7) & 0x1) == 0;
    }

    public getBrightness(): number {
        let val: number = this.val & 0xF;
        return val * 17;
    }

}


export class OamSizeAndDataAreaRegister extends Register {

    public address: string = "0x2101";
    public label: string = "OBSEL";

    public getOamSize(): number {
        return (this.val >> 5) & 0x7;
    }

    public getNameSelection(): number {
        return ((this.val >> 3) & 0x2);
    }

    public getBaseSelection(): number {
        return ((this.val >> 0) & 0x3) << 13;
    }
}

export class OamAddressRegister extends Register {

    public address: string = "0x2102-0x2103";
    public label: string = "OAMADD";

    public oamlow: OamAddressLowRegister;
    public oamhigh: OamAddressHighRegister;

    constructor(console: Console) {
        super(console);
        this.oamlow = new OamAddressLowRegister(console);
        this.oamhigh = new OamAddressHighRegister(console);
    }

    public getPriority() {
        return (this.oamhigh.get() >> 7) & 0x1;
    }

    public getBaseAddress() {
        let high: number = this.oamhigh.get();
        let low: number = this.oamlow.get();

        return ((high & 1) << 9) | low;
    }

}

export class OamAddressLowRegister extends Register {

    public address: string = "0x2102";
    public label: string = "OAMADDL";

}

export class OamAddressHighRegister extends Register {

    public address: string = "0x2103";
    public label: string = "OAMADDH";

}

export class OamDataWriteRegister extends Register {

    public address: string = "0x2104";
    public label: string = "OAMDATA";

}

export class BhModeAndCharacterSizeRegister extends Register {

    public address: string = "0x2105";
    public label: string = "BGMODE";

    public getBG4TileSize(): number {
        let is8by8 = ((this.val >> 7) & 1) == 0;
        return is8by8 ? 8: 16;
    }

    public getBG3TileSize(): number {
        let is8by8 = ((this.val >> 6) & 1) == 0;
        return is8by8 ? 8: 16;
    }

    public getBG2TileSize(): number {
        let is8by8 = ((this.val >> 5) & 1) == 0;
        return is8by8 ? 8: 16;
    }

    public getBG1TileSize(): number {
        let is8by8 = ((this.val >> 4) & 1) == 0;
        return is8by8 ? 8: 16;
    }

    public getBG3Priority(): boolean {
        return ((this.val >> 3) & 1) == 1;
    }

    public getMode(): number {
        return ((this.val >> 0) & 3);
    }

}

export class MosaicRegister extends Register {

    public address: string = "0x2106";
    public label: string = "MOSAIC";

    public getMosaicSize(): number {
        return (this.val >> 4) & 0xFF;
    }

    public getBG4MosaicEnable(): boolean {
        return ((this.val >> 0) & 0x1) == 1;
    }

    public getBG3MosaicEnable(): boolean {
        return ((this.val >> 1) & 0x1) == 1;
    }

    public getBG2MosaicEnable(): boolean {
        return ((this.val >> 1) & 0x1) == 1;
    }

    public getBG1MosaicEnable(): boolean {
        return ((this.val >> 0) & 0x1) == 1;
    }

}

export class TileAddressForBG1Register extends Register {

    public address: string = "0x2107";
    public label: string = "BG1SC";

    public getTileAddress(): number {
        return (this.val >> 2) & 0x3F;
    }

    // 00=32x32 01=64x32
    // 10=32x64 11=64x64
    public getScreenSize(): number {
        let val: number = this.val & 0x2;
        if (val == 0x00) {
            return 32;
        } else if (val == 0x01) {
            return 32;
        } else if (val == 0x02) {
            return 64;
        } else if (val == 0x03) {
            return 64;
        }
    }
}

export class TileAddressForBG2Register extends Register {

    public address: string = "0x2108";
    public label: string = "BG2SC";

    public getTileAddress(): number {
        return (this.val >> 2) & 0x3F;
    }

    // 00=32x32 01=64x32
    // 10=32x64 11=64x64
    public getScreenSize(): number {
        let val: number = this.val & 0x2;
        if (val == 0x00) {
            return 32;
        } else if (val == 0x01) {
            return 32;
        } else if (val == 0x02) {
            return 64;
        } else if (val == 0x03) {
            return 64;
        }
    }
}

export class TileAddressForBG3Register extends Register {

    public address: string = "0x2109";
    public label: string = "BG3SC";

    public getTileAddress(): number {
        return (this.val >> 2) & 0x3F;
    }

    // 00=32x32 01=64x32
    // 10=32x64 11=64x64
    public getScreenSize(): number {
        let val: number = this.val & 0x2;
        if (val == 0x00) {
            return 32;
        } else if (val == 0x01) {
            return 32;
        } else if (val == 0x02) {
            return 64;
        } else if (val == 0x03) {
            return 64;
        }
    }
}

export class TileAddressForBG4Register extends Register {

    public address: string = "0x210A";
    public label: string = "BG4SC";

    public getTileAddress(): number {
        return (this.val >> 2) & 0x3F;
    }

    // 00=32x32 01=64x32
    // 10=32x64 11=64x64
    public getScreenSize(): number {
        let val: number = this.val & 0x2;
        if (val == 0x00) {
            return 32;
        } else if (val == 0x01) {
            return 32;
        } else if (val == 0x02) {
            return 64;
        } else if (val == 0x03) {
            return 64;
        }
    }
}

export class CharacterAddressForBG1And2Register extends Register {

    public address: string = "0x210B";
    public label: string = "BG12NBA";

    public getBaseAddressForBG1(): number {
       return ((this.val >> 4) & 0xF) << 12;
    }

    public getBaseAddressForBG2(): number {
        return ((this.val >> 0) & 0xF) << 12;
    }

}

export class CharacterAddressForBG3And4Register extends Register {

    public address: string = "0x210C";
    public label: string = "BG34NBA";

    public getBaseAddressForBG3(): number {
        return ((this.val >> 4) & 0xF) << 12;
    }

    public getBaseAddressForBG4(): number {
        return ((this.val >> 0) & 0xF) << 12;
    }
}

export class HorizontalScrollForBG1Register extends Register {

    public address: string = "0x210D";
    public label: string = "BG1HOFS";
    public prev: number = 0;

    public getBG1HortOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }

    public getBG1Mode7HortOffset(): number {
        return 0;
    }
}

export class VerticalScrollForBG1Register extends Register {

    public address: string = "0x210E";
    public label: string = "BG1VOFS";
    public prev: number = 0;

    public getBG1VertOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }

    public getBG1Mode7VertOffset(): number {
        return 0;
    }

}

export class HorizontalScrollForBG2Register extends Register {

    public address: string = "0x210F";
    public label: string = "BG2HOFS";
    public prev: number = 0;

    public getBG2HortOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }

}

export class VerticalScrollForBG2Register extends Register {

    public address: string = "0x2110";
    public label: string = "BG2VOFS";
    public prev: number = 0;

    public getBG2VertOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }
}

export class HorizontalScrollForBG3Register extends Register {

    public address: string = "0x2111";
    public label: string = "BG3HOFS";
    public prev: number = 0;

    public getBG3HortOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }
}

export class VerticalScrollForBG3Register extends Register {

    public address: string = "0x2112";
    public label: string = "BG3VOFS";
    public prev: number = 0;

    public getBG3VertOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }
}

export class HorizontalScrollForBG4Register extends Register {

    public address: string = "0x2113";
    public label: string = "BG4HOFS";
    public prev: number = 0;

    public getBG4HortOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }
}

export class VerticalScrollForBG4Register extends Register {

    public address: string = "0x2114";
    public label: string = "BG4VOFS";
    public prev: number = 0;

    public getBG4VertOffset(): number {
        let result = (this.val << 8) | this.prev;
        this.prev = this.val;
        return result;
    }
}

export class VideoPortControlRegister extends Register {

    public address: string = "0x2115";
    public label: string = "VMAIN";

    public getAddressIncrementMode(): number {
        return (this.val >> 7) & 0x1;
    }

    public getAddressIncrementAmount(): number {
        let result: number = (this.val & 0x3);
        if (result == 0x00) {
            return 2;
        } else if (result == 0x01) {
            return 64;
        } else if (result == 0x02) {
            return 128;
        } else if (result == 0x03) {
            return 256;
        }
    }

    public getAddressFormation(): number {
        // 00 = No remapping
        // 01 = Remap addressing aaaaaaaaBBBccccc => aaaaaaaacccccBBB
        // 10 = Remap addressing aaaaaaaBBBcccccc => aaaaaaaccccccBBB
        // 11 = Remap addressing aaaaaaBBBccccccc => aaaaaacccccccBBB
        return (this.val >> 2) & 0x3;
    }

}

export class VRAMAddressRegister extends Register {

    public address: string = "0x2115-0x2116";
    public label: string = "VMADD";

    public setLower(val: number) {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public setUpper(val: number) {
        this.val = Bit.setUint16Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
    }
}

export class VRAMDataWriteRegister extends Register {

    public address: string = "0x2118-0x2119";
    public label: string = "VMDATA";

    public setLower(val: number) {
        if (this.console.ppu.registers.vportcntrl.getAddressIncrementMode() == 0) {
            // write and increment
            let amount = this.console.ppu.registers.vportcntrl.getAddressIncrementAmount();
        }

        this.val = Bit.setUint16Lower(this.val, val);
    }

    public setUpper(val: number) {
        if (this.console.ppu.registers.vportcntrl.getAddressIncrementMode() == 1) {
            // write and increment
            let amount = this.console.ppu.registers.vportcntrl.getAddressIncrementAmount();
        }

        this.val = Bit.setUint16Upper(this.val, val);
    }

    public getLower(): number {
        if (this.console.ppu.registers.vportcntrl.getAddressIncrementMode() == 0) {
            // write and increment
            let amount = this.console.ppu.registers.vportcntrl.getAddressIncrementAmount();
        }

        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        if (this.console.ppu.registers.vportcntrl.getAddressIncrementMode() == 1) {
            // write and increment
            let amount = this.console.ppu.registers.vportcntrl.getAddressIncrementAmount();
        }

        return Bit.getUint16Upper(this.val);
    }
}

export class Mode7Register extends Register {

    public address: string = "211A";
    public label: string = "VMDATAH";

}

export class CosXRegister extends Register {

    public address: string = "211B";
    public label: string = "VMDATAH";

}

export class SinXRegister extends Register {

    public address: string = "211C";
    public label: string = "VMDATAH";

}

export class SinYRegister extends Register {

    public address: string = "211D";
    public label: string = "VMDATAH";

}

export class CosYRegister extends Register {

    public address: string = "211E";
    public label: string = "VMDATAH";

}

export class CenterPositionXRegister extends Register {

    public address: string = "211F";
    public label: string = "VMDATAH";

}

export class CenterPositionYRegister extends Register {

    public address: string = "2120";
    public label: string = "VMDATAH";

}

export class CGRAMAddressRegister extends Register {

    public address: string = "0x2121";
    public label: string = "CGADD";

    public set(val: number): void {
        super.set((val * 2) & 0xFFFF);
    }

    public increment(): void {
        this.val = (this.val + 1) % CGram.size;
    }

}

export class CGRAMDataWriteRegister extends Register {

    public address: string = "2122";
    public label: string = "CGDATA";

    public counter: number = 0;
    public low: number = 0;
    public high: number = 0;

    public set(val: number): void {
        super.set(val);
        this.counter++;
        if (this.counter == 1) {
            this.low = val;
        } else if (this.counter == 2) {
            this.high = val;
        }
        let doWrite: boolean = this.counter % 2 == 0;

        if (doWrite) {
            let lowAddr: number = this.console.ppu.registers.cgramaddr.get();
            this.console.ppu.cgram.writeByte(lowAddr, this.low);

            this.console.ppu.registers.cgramaddr.increment();

            let highAddr: number = this.console.ppu.registers.cgramaddr.get();
            this.console.ppu.cgram.writeByte(highAddr, this.high);

            this.console.ppu.registers.cgramaddr.increment();

            this.counter = 0;
        }

    }

}

export class WindowMaskSettingsForBG1And2Register extends Register {

    public address: string = "2123";
    public label: string = "W12SEL";

}

export class WindowMaskSettingsForBG3And4Register extends Register {

    public address: string = "2124";
    public label: string = "W34SEL";

}

export class WindowMaskSettingsForObjRegister extends Register {

    public address: string = "2125";
    public label: string = "WOBJSEL";

}

export class WindowPositionForBG0Register extends Register {

    public address: string = "2126";
    public label: string = "WH0";

}

export class WindowPositionForBG1Register extends Register {

    public address: string = "2127";
    public label: string = "WH1";

}

export class WindowPositionForBG2Register extends Register {

    public address: string = "2128";
    public label: string = "WH2";

}

export class WindowPositionForBG3Register extends Register {

    public address: string = "2129";
    public label: string = "WH3";

}

export class WindowMaskLogicForBgRegister extends Register {

    public address: string = "212A";
    public label: string = "WBGLOG";

}

export class WindowMaskLogicForObjRegister extends Register {

    public address: string = "212B";
    public label: string = "WOBJLOG";

}

export class ScreenDestinationForMainRegister extends Register {

    public address: string = "212C";
    public label: string = "TM";

}

export class ScreenDestinationForSubRegister extends Register {

    public address: string = "212D";
    public label: string = "TS";

}

export class WindowMaskDestinationForMainRegister extends Register {

    public address: string = "212E";
    public label: string = "TMW";

}

export class WindowMaskDestinationForSubRegister extends Register {

    public address: string = "212F";
    public label: string = "TSW";

}

// Fixed color addition or screen addition register [CGWSEL]
export class ColorMathSelectionRegister extends Register {

    public address: string = "2130";
    public label: string = "CGWSEL";

}

// Addition/subtraction for screens, BGs, & OBJs [CGADSUB]
export class ColorMathAddSubAffectRegister extends Register {

    public address: string = "2131";
    public label: string = "CGADSUB";

}

// $2132
export class ColorMathDataRegister extends Register {

    public address: string = "2132";
    public label: string = "COLDATA";

}

export class ScreenModeSelectRegister extends Register {

    public address: string = "2133";
    public label: string = "SETINI";

}

export class MultiplicationResultLowRegister extends Register {

    public address: string = "2134";
    public label: string = "MPYL";

}

export class MultiplicationResultMiddleRegister extends Register {

    public address: string = "2135";
    public label: string = "MPYM";

}

export class MultiplicationResultHighRegister extends Register {

    public address: string = "2136";
    public label: string = "MPYH";

}

export class SoftwareLatchRegister extends Register {

    public address: string = "0x2137";
    public label: string = "SLHV";

}

export class OAMDataReadRegister extends Register {

    public address: string = "2138";
    public label: string = "OAMDATAREAD";

}

export class VRAMDataReadRegister extends Register {

    public address: string = "0x2139-0x213A";
    public label: string = "VMDATA";

    public setLower(val: number) {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public setUpper(val: number) {
        this.val = Bit.setUint16Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
    }
}

export class CGRAMDataReadRegister extends Register {

    public address: string = "213B";
    public label: string = "CGDATAREAD";

}

export class ScanlineLocationHorizontalRegister extends Register {

    public address: string = "0x213C";
    public label: string = "OPHCT";

}

export class ScanlineLocationVerticalRegister extends Register {

    public address: string = "0x213D";
    public label: string = "OPVCT";

}

export class PPUStatus77Register extends Register {

    public address: string = "213E";
    public label: string = "STAT77";

    public getRangeOver(): boolean {
        return ((this.val >> 7) & 0x1) == 1;
    }

    public getTimeOver(): boolean {
        return ((this.val >> 6) & 0x1) == 1;
    }

    public getVersion(): number {
        return ((this.val >> 0) & 0xF);
    }

}

export class PPUStatus78Register extends Register {

    public address: string = "213F";
    public label: string = "STAT78";

    public getField(): boolean {
        return ((this.val >> 7) & 0x1) == 1;

    }

    public getCountersLatched(): boolean {
        return ((this.val >> 6) & 0x1) == 1;

    }

    public getRegion(): number {
        return ((this.val >> 4) & 0x1);

    }

    public getVersion(): number {
        return ((this.val >> 4) & 0xF);
    }

}

export class WRAMDataRegister extends Register {

    public address: string = "2180";
    public label: string = "WMDATA";

}

export class WRAMAddressLowRegister extends Register {

    public address: string = "2181";
    public label: string = "WMADDL";

}

export class WRAMAddressMidRegister extends Register {

    public address: string = "2182";
    public label: string = "WMADDM";

}

export class WRAMAddressHighRegister extends Register {

    public address: string = "2183";
    public label: string = "WMADDH";

}

export class Registers {

    public mosaic: MosaicRegister;
    public m7sel: Mode7Register;
    public m7a: CosXRegister;
    public m7b: SinXRegister;
    public m7c: SinYRegister;
    public m7d: CosYRegister;
    public m7x: CenterPositionXRegister;
    public m7y: CenterPositionYRegister;

    public oamselect: OamSizeAndDataAreaRegister;
    public oamaddr: OamAddressRegister;
    public oamdataw: OamDataWriteRegister;
    public oamdatar: OAMDataReadRegister;

    public cgramaddr: CGRAMAddressRegister;
    public cgdataw: CGRAMDataWriteRegister;
    public cgdatar: CGRAMDataReadRegister;
    public cgwsel: ColorMathSelectionRegister;
    public cgadsub: ColorMathAddSubAffectRegister;
    public coldata: ColorMathDataRegister;

    public setini: ScreenModeSelectRegister;
    public mpyl: MultiplicationResultLowRegister;
    public mpym: MultiplicationResultMiddleRegister;
    public mpyh: MultiplicationResultHighRegister;
    public slhv: SoftwareLatchRegister;

    public vtilebg1: TileAddressForBG1Register;
    public vtilebg2: TileAddressForBG2Register;
    public vtilebg3: TileAddressForBG3Register;
    public vtilebg4: TileAddressForBG4Register;
    public vcharlocbg12: CharacterAddressForBG1And2Register;
    public vcharlocbg34: CharacterAddressForBG3And4Register;
    public vportcntrl: VideoPortControlRegister;
    public vaddr: VRAMAddressRegister;
    public vdataw: VRAMDataWriteRegister;
    public vdatar: VRAMDataReadRegister;

    public inidisp: ScreenDisplayRegister;
    public bgmode: BhModeAndCharacterSizeRegister;

    public bg1hofs: HorizontalScrollForBG1Register;
    public bg1vofs: VerticalScrollForBG1Register;
    public bg2hofs: HorizontalScrollForBG2Register;
    public bg2vofs: VerticalScrollForBG2Register;
    public bg3hofs: HorizontalScrollForBG3Register;
    public bg3vofs: VerticalScrollForBG3Register;
    public bg4hofs: HorizontalScrollForBG4Register;
    public bg4vofs: VerticalScrollForBG4Register;

    public tm: ScreenDestinationForMainRegister;
    public ts: ScreenDestinationForSubRegister;

    public w12sel: WindowMaskSettingsForBG1And2Register;
    public w34sel: WindowMaskSettingsForBG3And4Register;
    public wobjsel: WindowMaskSettingsForObjRegister;
    public wh0: WindowPositionForBG0Register;
    public wh1: WindowPositionForBG1Register;
    public wh2: WindowPositionForBG2Register;
    public wh3: WindowPositionForBG3Register;
    public wbglog: WindowMaskLogicForBgRegister;
    public wobjlog: WindowMaskLogicForObjRegister;
    public tmw: WindowMaskDestinationForMainRegister;
    public tsw: WindowMaskDestinationForSubRegister;

    public scanlochort: ScanlineLocationHorizontalRegister;
    public scanlocvert: ScanlineLocationVerticalRegister;

    public stat77: PPUStatus77Register;
    public stat78: PPUStatus78Register;

    constructor(console: Console) {
        this.mosaic = new MosaicRegister(console);
        this.m7sel = new Mode7Register(console);
        this.m7a = new CosXRegister(console);
        this.m7b = new SinXRegister(console);
        this.m7c = new SinYRegister(console);
        this.m7d = new CosYRegister(console);
        this.m7x = new CenterPositionXRegister(console);
        this.m7y = new CenterPositionYRegister(console);

        this.oamselect = new OamSizeAndDataAreaRegister(console);
        this.oamaddr = new OamAddressRegister(console);
        this.oamdataw = new OamDataWriteRegister(console);
        this.oamdatar = new OAMDataReadRegister(console);

        this.cgramaddr = new CGRAMAddressRegister(console);
        this.cgdataw = new CGRAMDataWriteRegister(console);
        this.cgdatar = new CGRAMDataReadRegister(console);
        this.cgwsel = new ColorMathSelectionRegister(console);
        this.cgadsub = new ColorMathAddSubAffectRegister(console);
        this.coldata = new ColorMathDataRegister(console);

        this.setini = new ScreenModeSelectRegister(console);
        this.mpyl = new MultiplicationResultLowRegister(console);
        this.mpym = new MultiplicationResultMiddleRegister(console);
        this.mpyh = new MultiplicationResultHighRegister(console);
        this.slhv = new SoftwareLatchRegister(console);

        this.vtilebg1 = new TileAddressForBG1Register(console);
        this.vtilebg2 = new TileAddressForBG2Register(console);
        this.vtilebg3 = new TileAddressForBG3Register(console);
        this.vtilebg4 = new TileAddressForBG4Register(console);
        this.vcharlocbg12 = new CharacterAddressForBG1And2Register(console);
        this.vcharlocbg34 = new CharacterAddressForBG3And4Register(console);
        this.vportcntrl = new VideoPortControlRegister(console);
        this.vaddr = new VRAMAddressRegister(console);
        this.vdataw = new VRAMDataWriteRegister(console);
        this.vdatar = new VRAMDataReadRegister(console);

        this.inidisp = new ScreenDisplayRegister(console);
        this.bgmode = new BhModeAndCharacterSizeRegister(console);

        this.bg1hofs = new HorizontalScrollForBG1Register(console);
        this.bg1vofs = new VerticalScrollForBG1Register(console);
        this.bg2hofs = new HorizontalScrollForBG2Register(console);
        this.bg2vofs = new VerticalScrollForBG2Register(console);
        this.bg3hofs = new HorizontalScrollForBG3Register(console);
        this.bg3vofs = new VerticalScrollForBG3Register(console);
        this.bg4hofs = new HorizontalScrollForBG4Register(console);
        this.bg4vofs = new VerticalScrollForBG4Register(console);

        this.tm = new ScreenDestinationForMainRegister(console);
        this.ts = new ScreenDestinationForSubRegister(console);

        this.w12sel = new WindowMaskSettingsForBG1And2Register(console);
        this.w34sel = new WindowMaskSettingsForBG3And4Register(console);
        this.wobjsel = new WindowMaskSettingsForObjRegister(console);
        this.wh0 = new WindowPositionForBG0Register(console);
        this.wh1 = new WindowPositionForBG1Register(console);
        this.wh2 = new WindowPositionForBG2Register(console);
        this.wh3 = new WindowPositionForBG3Register(console);
        this.wbglog = new WindowMaskLogicForBgRegister(console);
        this.wobjlog = new WindowMaskLogicForObjRegister(console);
        this.tmw = new WindowMaskDestinationForMainRegister(console);
        this.tsw = new WindowMaskDestinationForSubRegister(console);

        this.scanlochort = new ScanlineLocationHorizontalRegister(console);
        this.scanlocvert = new ScanlineLocationVerticalRegister(console);

        this.stat77 = new PPUStatus77Register(console);
        this.stat78 = new PPUStatus78Register(console);
    }

}
