import {Ppu} from "./Ppu";

const INVALID_SET: string = "Invalid value set";

// http://baltimorebarcams.com/eb/snes/docs/65816/SNES%20Registers.html
// https://en.wikibooks.org/wiki/Super_NES_Programming/SNES_Hardware_Registers
// https://wiki.superfamicom.org/registers

export class PpuByteRegister {

    public address: string = "";
    public name: string = "";

    public val: number = 0x0;

    public get(): number {
        return this.val;
    }

    public set(val: number): void {
        if (val == null || val < 0 || val > 0xFF) {
            throw new Error(INVALID_SET);
        }
        this.val = val;
    }
}

export class PpuWordRegister {

    public address: string = "";
    public name: string = "";

    public low: number = 0x0;
    public high: number = 0x0;
    public toggle: boolean = false;

    public get(): number {
        return (this.high << 7) | this.low;
    }

    public set(val: number): void {
        if (val == null || val < 0 || val > 0xFF) {
            throw new Error(INVALID_SET);
        }

        if (this.toggle) {
            this.low = val;
            this.toggle = !this.toggle;
        } else {
            this.high = val;
            this.toggle = !this.toggle;
        }
    }
}


export class ScreenDisplayRegister extends PpuByteRegister {

    public address: string = "2100";
    public name: string = "INIDISP";

    public val: number = 0x8F;

    public getDisplayOff(): boolean {
        return ((this.val >> 7) & 0x1) == 0;
    }

    public getBrightness(): number {
        let val: number = this.val & 0xF;
        return val * 17;
    }

}


export class OamSizeAndDataAreaRegister extends PpuByteRegister {

    public address: string = "2101";
    public name: string = "OBSEL";

    public getOamSize(): number {
        return (this.val >> 5) & 0x7;
    }

    public getNameSelection(): number {
        return (this.val >> 3) & 0x2;
    }

    public getBaseSelection(): number {
        return (this.val >> 0) & 0x3;
    }
}

export class OamAddressLowRegister extends PpuByteRegister {

    public address: string = "2102";
    public name: string = "OAMADDL";

    public getOamAddress(): number {
        return this.val;
    }

}

export class OamAddressHighRegister extends PpuByteRegister {

    public address: string = "2103";
    public name: string = "OAMADDH";

    public getOamPriorityRotation() : number {
        return (this.val >> 7) & 0x1;
    }

    public getOamMsb() : number {
        return (this.val >> 0) & 0x1;
    }

}

export class OamDataWriteRegister extends PpuByteRegister {

    public address: string = "2104";
    public name: string = "OAMDATA";

}

export class BhModeAndCharacterSizeRegister extends PpuByteRegister {

    public address: string = "2105";
    public name: string = "BGMODE";

}

export class MosaicRegister extends PpuByteRegister {

    public address: string = "2106";
    public name: string = "MOSAIC";

}

export class TileAddressForBG1Register extends PpuByteRegister {

    public address: string = "2107";
    public name: string = "BG1SC";

}

export class TileAddressForBG2Register extends PpuByteRegister {

    public address: string = "2108";
    public name: string = "BG2SC";

}

export class TileAddressForBG3Register extends PpuByteRegister {

    public address: string = "2109";
    public name: string = "BG3SC";

}

export class TileAddressForBG4Register extends PpuByteRegister {

    public address: string = "210A";
    public name: string = "BG4SC";

}

export class CharacterAddressForBG1And2Register extends PpuByteRegister {

    public address: string = "210B";
    public name: string = "BG12NBA";

}

export class CharacterAddressForBG3And4Register extends PpuByteRegister {

    public address: string = "210C";
    public name: string = "BG34NBA";

}

export class HorizontalScrollForBG1Register extends PpuWordRegister {

    public address: string = "210D";
    public name: string = "BG1HOFS";

}

export class VerticalScrollForBG1Register extends PpuWordRegister {

    public address: string = "210E";
    public name: string = "BG1VOFS";

}

export class HorizontalScrollForBG2Register extends PpuWordRegister {

    public address: string = "210F";
    public name: string = "BG2HOFS";

}

export class VerticalScrollForBG2Register extends PpuWordRegister {

    public address: string = "2110";
    public name: string = "BG2VOFS";

}

export class HorizontalScrollForBG3Register extends PpuWordRegister {

    public address: string = "2111";
    public name: string = "BG3HOFS";

}

export class VerticalScrollForBG3Register extends PpuWordRegister {

    public address: string = "2112";
    public name: string = "BG3VOFS";

}

export class HorizontalScrollForBG4Register extends PpuWordRegister {

    public address: string = "2113";
    public name: string = "BG4HOFS";

}

export class VerticalScrollForBG4Register extends PpuWordRegister {

    public address: string = "2114";
    public name: string = "BG4VOFS";

}

export class VideoPortControlRegister extends PpuByteRegister {

    public address: string = "2115";
    public name: string = "VMAIN";

}

export class VRAMAddressLowRegister extends PpuByteRegister {

    public address: string = "2116";
    public name: string = "VMADDL";

}

export class VRAMAddressHighRegister extends PpuByteRegister {

    public address: string = "2117";
    public name: string = "VMADDH";

}

export class VRAMDataWriteLowRegister extends PpuByteRegister {

    public address: string = "2118";
    public name: string = "VMDATAL";

}

export class VRAMDataWriteHighRegister extends PpuByteRegister {

    public address: string = "2119";
    public name: string = "VMDATAH";

}

export class Mode7Register extends PpuByteRegister {

    public address: string = "211A";
    public name: string = "VMDATAH";

}

export class CosXRegister extends PpuByteRegister {

    public address: string = "211B";
    public name: string = "VMDATAH";

}

export class SinXRegister extends PpuByteRegister {

    public address: string = "211C";
    public name: string = "VMDATAH";

}

export class SinYRegister extends PpuByteRegister {

    public address: string = "211D";
    public name: string = "VMDATAH";

}

export class CosYRegister extends PpuByteRegister {

    public address: string = "211E";
    public name: string = "VMDATAH";

}

export class CenterPositionXRegister extends PpuByteRegister {

    public address: string = "211F";
    public name: string = "VMDATAH";

}

export class CenterPositionYRegister extends PpuByteRegister {

    public address: string = "2120";
    public name: string = "VMDATAH";

}

export class CGRAMAddressRegister extends PpuByteRegister {

    public address: string = "2121";
    public name: string = "CGADD";

}

export class CGRAMDataWriteRegister extends PpuByteRegister {

    public address: string = "2122";
    public name: string = "CGDATA";

}

export class WindowMaskSettingsForBG1And2Register extends PpuByteRegister {

    public address: string = "2123";
    public name: string = "W12SEL";

}

export class WindowMaskSettingsForBG3And4Register extends PpuByteRegister {

    public address: string = "2124";
    public name: string = "W34SEL";

}

export class WindowMaskSettingsForObjRegister extends PpuByteRegister {

    public address: string = "2125";
    public name: string = "WOBJSEL";

}

export class WindowPositionForBG0Register extends PpuByteRegister {

    public address: string = "2126";
    public name: string = "WH0";

}

export class WindowPositionForBG1Register extends PpuByteRegister {

    public address: string = "2127";
    public name: string = "WH1";

}

export class WindowPositionForBG2Register extends PpuByteRegister {

    public address: string = "2128";
    public name: string = "WH2";

}

export class WindowPositionForBG3Register extends PpuByteRegister {

    public address: string = "2129";
    public name: string = "WH3";

}

export class WindowMaskLogicForBgRegister extends PpuByteRegister {

    public address: string = "212A";
    public name: string = "WBGLOG";

}

export class WindowMaskLogicForObjRegister extends PpuByteRegister {

    public address: string = "212B";
    public name: string = "WOBJLOG";

}

export class ScreenDestinationForMainRegister extends PpuByteRegister {

    public address: string = "212C";
    public name: string = "TM";

}

export class ScreenDestinationForSubRegister extends PpuByteRegister {

    public address: string = "212D";
    public name: string = "TS";

}

export class WindowMaskDestinationForMainRegister extends PpuByteRegister {

    public address: string = "212E";
    public name: string = "TMW";

}

export class WindowMaskDestinationForSubRegister extends PpuByteRegister {

    public address: string = "212F";
    public name: string = "TSW";

}

// Fixed color addition or screen addition register [CGWSEL]
export class ColorMathSelectionRegister extends PpuByteRegister {

    public address: string = "2130";
    public name: string = "CGWSEL";

}

// Addition/subtraction for screens, BGs, & OBJs [CGADSUB]
export class ColorMathAddSubAffectRegister extends PpuByteRegister {

    public address: string = "2131";
    public name: string = "CGADSUB";

}

// $2132
export class ColorMathDataRegister extends PpuByteRegister {

    public address: string = "2132";
    public name: string = "COLDATA";

}

export class ScreenModeSelectRegister extends PpuByteRegister {

    public address: string = "2133";
    public name: string = "SETINI";

}

export class MultiplicationResultLowRegister extends PpuByteRegister {

    public address: string = "2134";
    public name: string = "MPYL";

}

export class MultiplicationResultMiddleRegister extends PpuByteRegister {

    public address: string = "2135";
    public name: string = "MPYM";

}

export class MultiplicationResultHighRegister extends PpuByteRegister {

    public address: string = "2136";
    public name: string = "MPYH";

}

export class SoftwareLatchRegister extends PpuByteRegister {

    public address: string = "2137";
    public name: string = "SLHV";

}

export class OAMDataReadRegister extends PpuWordRegister {

    public address: string = "2138";
    public name: string = "OAMDATAREAD";

}

export class VRAMDataReadLowRegister extends PpuByteRegister {

    public address: string = "2139";
    public name: string = "VMDATALREAD";

}

export class VRAMDataReadHighRegister extends PpuByteRegister {

    public address: string = "213A";
    public name: string = "VMDATAHREAD";

}

export class CGRAMDataReadRegister extends PpuByteRegister {

    public address: string = "213B";
    public name: string = "CGDATAREAD";

}

export class ScanlineLocationHorizontalRegister extends PpuWordRegister {

    public address: string = "213C";
    public name: string = "OPHCT";

}

export class ScanlineLocationVerticalRegister extends PpuWordRegister {

    public address: string = "213D";
    public name: string = "OPVCT";

}

export class PPUStatus77Register extends PpuByteRegister {

    public address: string = "213E";
    public name: string = "STAT77";

}

export class PPUStatus78Register extends PpuByteRegister {

    public address: string = "213F";
    public name: string = "STAT78";

}

export class WRAMDataRegister extends PpuByteRegister {

    public address: string = "2180";
    public name: string = "WMDATA";

}

export class WRAMAddressLowRegister extends PpuByteRegister {

    public address: string = "2181";
    public name: string = "WMADDL";

}

export class WRAMAddressMidRegister extends PpuByteRegister {

    public address: string = "2182";
    public name: string = "WMADDM";

}

export class WRAMAddressHighRegister extends PpuByteRegister {

    public address: string = "2183";
    public name: string = "WMADDH";

}

export class Registers {

    public mosaic: MosaicRegister = new MosaicRegister();
    public m7sel: Mode7Register = new Mode7Register();
    public m7a: CosXRegister = new CosXRegister();
    public m7b: SinXRegister = new SinXRegister();
    public m7c: SinYRegister = new SinYRegister();
    public m7d: CosYRegister = new CosYRegister();
    public m7x: CenterPositionXRegister = new CenterPositionXRegister();
    public m7y: CenterPositionYRegister = new CenterPositionYRegister();

    public oamselect: OamSizeAndDataAreaRegister = new OamSizeAndDataAreaRegister();
    public oamaddrl: OamAddressLowRegister = new OamAddressLowRegister();
    public oamaddrh: OamAddressHighRegister = new OamAddressHighRegister();
    public oamdataw: OamDataWriteRegister = new OamDataWriteRegister();
    public oamdatar: OAMDataReadRegister = new OAMDataReadRegister();

    public cgramaddr: CGRAMAddressRegister = new CGRAMAddressRegister();
    public cgdataw: CGRAMDataWriteRegister = new CGRAMDataWriteRegister();
    public cgdatar: CGRAMDataReadRegister = new CGRAMDataReadRegister();
    public cgwsel: ColorMathSelectionRegister = new ColorMathSelectionRegister();
    public cgadsub: ColorMathAddSubAffectRegister = new ColorMathAddSubAffectRegister();
    public coldata: ColorMathDataRegister = new ColorMathDataRegister();

    public setini: ScreenModeSelectRegister = new ScreenModeSelectRegister();
    public mpyl: MultiplicationResultLowRegister = new MultiplicationResultLowRegister();
    public mpym: MultiplicationResultMiddleRegister = new MultiplicationResultMiddleRegister();
    public mpyh: MultiplicationResultHighRegister = new MultiplicationResultHighRegister();
    public slhv: SoftwareLatchRegister = new SoftwareLatchRegister();

    public vtilebg1: TileAddressForBG1Register = new TileAddressForBG1Register();
    public vtilebg2: TileAddressForBG2Register = new TileAddressForBG2Register();
    public vtilebg3: TileAddressForBG3Register = new TileAddressForBG3Register();
    public vtilebg4: TileAddressForBG4Register = new TileAddressForBG4Register();
    public vcharlocbg12: CharacterAddressForBG1And2Register = new CharacterAddressForBG1And2Register();
    public vcharlocbg34: CharacterAddressForBG3And4Register = new CharacterAddressForBG3And4Register();
    public vportcntrl: VideoPortControlRegister = new VideoPortControlRegister();
    public vaddrl: VRAMAddressLowRegister = new VRAMAddressLowRegister();
    public vaddrh: VRAMAddressHighRegister = new VRAMAddressHighRegister();
    public vdatawl: VRAMDataWriteLowRegister = new VRAMDataWriteLowRegister();
    public vdatawh: VRAMDataWriteHighRegister = new VRAMDataWriteHighRegister();
    public vdatarl: VRAMDataReadLowRegister = new VRAMDataReadLowRegister();
    public vdatarw: VRAMDataReadHighRegister = new VRAMDataReadHighRegister();

    public inidisp: ScreenDisplayRegister = new ScreenDisplayRegister();
    public bgmode: BhModeAndCharacterSizeRegister = new BhModeAndCharacterSizeRegister();

    public bg1hofs: HorizontalScrollForBG1Register = new HorizontalScrollForBG1Register();
    public bg1vofs: VerticalScrollForBG1Register = new VerticalScrollForBG1Register();
    public bg2hofs: HorizontalScrollForBG2Register = new HorizontalScrollForBG2Register();
    public bg2vofs: VerticalScrollForBG2Register = new VerticalScrollForBG2Register();
    public bg3hofs: HorizontalScrollForBG3Register = new HorizontalScrollForBG3Register();
    public bg3vofs: VerticalScrollForBG3Register = new VerticalScrollForBG3Register();
    public bg4hofs: HorizontalScrollForBG4Register = new HorizontalScrollForBG4Register();
    public bg4vofs: VerticalScrollForBG4Register = new VerticalScrollForBG4Register();

    public tm: ScreenDestinationForMainRegister = new ScreenDestinationForMainRegister();
    public ts: ScreenDestinationForSubRegister = new ScreenDestinationForSubRegister();

    public w12sel: WindowMaskSettingsForBG1And2Register = new WindowMaskSettingsForBG1And2Register();
    public w34sel: WindowMaskSettingsForBG3And4Register = new WindowMaskSettingsForBG3And4Register();
    public wobjsel: WindowMaskSettingsForObjRegister = new WindowMaskSettingsForObjRegister();
    public wh0: WindowPositionForBG0Register = new WindowPositionForBG0Register();
    public wh1: WindowPositionForBG1Register = new WindowPositionForBG1Register();
    public wh2: WindowPositionForBG2Register = new WindowPositionForBG2Register();
    public wh3: WindowPositionForBG3Register = new WindowPositionForBG3Register();
    public wbglog: WindowMaskLogicForBgRegister = new WindowMaskLogicForBgRegister();
    public wobjlog: WindowMaskLogicForObjRegister = new WindowMaskLogicForObjRegister();
    public tmw: WindowMaskDestinationForMainRegister = new WindowMaskDestinationForMainRegister();
    public tsw: WindowMaskDestinationForSubRegister = new WindowMaskDestinationForSubRegister();

    public scanlochort: ScanlineLocationHorizontalRegister = new ScanlineLocationHorizontalRegister();
    public scanlocvert: ScanlineLocationVerticalRegister = new ScanlineLocationVerticalRegister();

    public stat77: PPUStatus77Register = new PPUStatus77Register();
    public stat78: PPUStatus78Register = new PPUStatus78Register();

}
