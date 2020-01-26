import {Ppu} from "./Ppu";
import {Mode, Modes} from "../Modes";
import {Console} from "../Console";
import {CGram} from "../memory/CGram";
import {Bit} from "../util/Bit";
import {Objects} from "../util/Objects";
import {Address} from "../bus/Address";
import {Vram} from "../memory/Vram";
import {Dimension} from "./Tiles";


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

        this.console = console;
    }

    public set(val : number): void {
        if (val == null || val < 0) {
            throw Error("Invalid set " + val + " to register.");
        }
        if (this.mode == Modes.bit8 && val > 0xFF) {
            throw new Error("value is to big for register 0x" + val.toString(16));
        }
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

    public getSize(): number {
        let type : number = (this.val >> 5) & 0x7;
        return type;
    }

    public getObjectSizes(): {small: Dimension, big: Dimension} {
        let type : number = this.getSize();
        if (type == 0x0) {
            return {small: Dimension.get8by8(), big: Dimension.get16by16()};
        } else if (type == 0x1) {
            return {small: Dimension.get8by8(), big: Dimension.get32by32()};
        } else if (type == 0x2) {
            return {small: Dimension.get16by16(), big: Dimension.get32by32()};
        } else if (type == 0x4) {
            return {small: Dimension.get16by16(), big: Dimension.get64by64()};
        } else if (type == 0x6) {
            return {small: Dimension.get32by32(), big: Dimension.get64by64()};
        } else if (type == 0x5) {
            return {small: Dimension.get32by32(), big: Dimension.get64by64()};
        } else {
            throw new Error("Undocumented behaviour type " + type);
        }
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

    constructor(console: Console) {
        super(console);
    }

    public setUpper(val: number): void {
        this.val = Bit.setUint16Upper(this.val, val);
    }

    public setLower(val: number): void {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getTableAddress(): number {
        return Bit.toUint16(this.getUpper() & 0x7F, this.getLower());
    }

    public setTableAddress(value: number) {
        this.val = (this.getPriority() << 14) | ((value) % 544);
    }

    public getPriority(): number {
        return (this.getUpper() >> 7) & 0x1;
    }

}

export class OamDataWriteRegister extends Register {

    public address: string = "0x2104";
    public label: string = "OAMDATA";

    public buffer: number;

    public set(val: number): void {
        let ppu: Ppu = this.console.ppu;
        let addr: number = ppu.registers.oamaddr.getTableAddress();

        let isEven: boolean = (addr & 0x1) == 0;

        if (isEven) {
            this.buffer = val;
        }
        if (addr < 512) {
            if (!isEven) {
                ppu.oam.writeByte(Address.create(addr - 1), this.buffer);
                ppu.oam.writeByte(Address.create(addr), val);
            }
        } else {
            ppu.oam.writeByte(Address.create(512 + (addr & 0x1f)), val);
        }
        ppu.registers.oamaddr.setTableAddress(addr + 1);
    }

    public get(): number {
        throw new Error("Invalid read on 0x2104");
    }
}

export class BhModeAndCharacterSizeRegister extends Register {

    public address: string = "0x2105";
    public label: string = "BGMODE";

    public getBG4TileSize(): Dimension {
        let is8by8 = ((this.val >> 7) & 1) == 0;
        return is8by8 ? Dimension.get8by8() : Dimension.get16by16();
    }

    public getBG3TileSize(): Dimension {
        let is8by8 = ((this.val >> 6) & 1) == 0;
        return is8by8 ? Dimension.get8by8() : Dimension.get16by16();
    }

    public getBG2TileSize(): Dimension {
        let is8by8 = ((this.val >> 5) & 1) == 0;
        return is8by8 ? Dimension.get8by8() : Dimension.get16by16();
    }

    public getBG1TileSize(): Dimension {
        let is8by8 = ((this.val >> 4) & 1) == 0;
        return is8by8 ? Dimension.get8by8() : Dimension.get16by16();
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

/**
 * 2107  wb++?- BG1SC - BG1 Tilemap Address and Size
 2108  wb++?- BG2SC - BG2 Tilemap Address and Size
 2109  wb++?- BG3SC - BG3 Tilemap Address and Size
 210a  wb++?- BG4SC - BG4 Tilemap Address and Size
 aaaaaayx

 aaaaaa = Tilemap address in VRAM (Addr>>10)
 x    = Tilemap horizontal mirroring
 y    = Tilemap veritcal mirroring
 All tilemaps are 32x32 tiles. If x and y are both unset, there is
 one tilemap at Addr. If x is set, a second tilemap follows the
 first that should be considered "to the right of" the first. If y
 is set, a second tilemap follows the first that should be
 considered "below" the first. If both are set, then a second
 follows "to the right", then a third "below", and a fourth "below
 and to the right".

 See the section "BACKGROUNDS" below for more details.
 */

export class TileAddressForBG1Register extends Register {

    public address: string = "0x2107";
    public label: string = "BG1SC";

    public getTileMapAddress(): number {
        return (((this.val >> 2) & 0x3F) * 0x400);
    }

    public isExtendedHorizontally() {
        return ((this.val >> 0) & 0x1) == 0x1;
    }

    public isExtendedVertically() {
        return ((this.val >> 1) & 0x1) == 0x1;
    }

    public getDimension(): Dimension {
        if (this.isExtendedHorizontally() && this.isExtendedVertically()) {
            return Dimension.get64by64();
        } else if (this.isExtendedVertically()) {
            return Dimension.get64by32();
        } else if (this.isExtendedHorizontally()) {
            return Dimension.get32by64();
        } else {
            return Dimension.get32by32();
        }
    }
}

export class TileAddressForBG2Register extends Register {

    public address: string = "0x2108";
    public label: string = "BG2SC";

    public getTileMapAddress(): number {
        return (((this.val >> 2) & 0x3F) * 0x400);
    }

    public isExtendedHorizontally() {
        return ((this.val >> 0) & 0x1) == 0x1;
    }

    public isExtendedVertically() {
        return ((this.val >> 1) & 0x1) == 0x1;
    }

    public getDimension(): Dimension {
        if (this.isExtendedHorizontally() && this.isExtendedVertically()) {
            return Dimension.get64by64();
        } else if (this.isExtendedVertically()) {
            return Dimension.get64by32();
        } else if (this.isExtendedHorizontally()) {
            return Dimension.get32by64();
        } else {
            return Dimension.get32by32();
        }
    }
}

export class TileAddressForBG3Register extends Register {

    public address: string = "0x2109";
    public label: string = "BG3SC";

    public getTileAddress(): number {
        return (this.val >> 2) & 0x3F;
    }

    public isExtendedHorizontally() {
        return ((this.val >> 0) & 0x1) == 0x1;
    }

    public isExtendedVertically() {
        return ((this.val >> 1) & 0x1) == 0x1;
    }

    public getDimension(): Dimension {
        if (this.isExtendedHorizontally() && this.isExtendedVertically()) {
            return Dimension.get64by64();
        } else if (this.isExtendedVertically()) {
            return Dimension.get64by32();
        } else if (this.isExtendedHorizontally()) {
            return Dimension.get32by64();
        } else {
            return Dimension.get32by32();
        }
    }
}

export class TileAddressForBG4Register extends Register {

    public address: string = "0x210A";
    public label: string = "BG4SC";

    public getTileAddress(): number {
        return (this.val >> 2) & 0x3F;
    }

    public isExtendedHorizontally() {
        return ((this.val >> 0) & 0x1) == 0x1;
    }

    public isExtendedVertically() {
        return ((this.val >> 1) & 0x1) == 0x1;
    }

    public getDimension(): Dimension {
        if (this.isExtendedHorizontally() && this.isExtendedVertically()) {
            return Dimension.get64by64();
        } else if (this.isExtendedVertically()) {
            return Dimension.get64by32();
        } else if (this.isExtendedHorizontally()) {
            return Dimension.get32by64();
        } else {
            return Dimension.get32by32();
        }
    }
}

export class CharacterAddressForBG1And2Register extends Register {

    public address: string = "0x210B";
    public label: string = "BG12NBA";

    public getBaseAddressForBG1(): number {
       return ((this.val >> 4) & 0xF) << 13;
    }

    public getBaseAddressForBG2(): number {
        return ((this.val >> 0) & 0xF) << 13;
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

    public set(val: number): void {
        this.prev = this.val & 0xFF;
        this.val = val & 0xFF;
    }

    public getBG1VertOffset(): number {
        let low: number = this.prev & 0xFF;
        let high: number = this.val & 0xFF;

        let result = (high << 8) | low;
        return result & 1023;
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

    public static remap(type: number, val: number) {
        if (type == 0x00) {
            return val;
        } else if (type == 0x01) {
            let top: number = (val >> 8) & 0xFF;
            let middle: number = (val >> 5) & 0x7;
            let bottom: number = (val >> 0) & 0x1F;

            return (top << 8) | (bottom << 3) | (middle);
        } else if (type == 0x10) {
            let top: number = (val >> 9) & 0x7F;
            let middle: number = (val >> 6) & 0x7;
            let bottom: number = (val >> 0) & 0x3F;

            return (top << 9) | (bottom << 3) | (middle);
        } else if (type == 0x11) {
            let top: number = (val >> 10) & 0x3F;
            let middle: number = (val >> 6) & 0x7;
            let bottom: number = (val >> 0) & 0x7F;

            return (top << 10) | (bottom << 3) | (middle);
        }
    }

}

export class VRAMAddressRegister extends Register {

    public address: string = "0x2115-0x2116";
    public label: string = "VMADD";

    public set(val: number): void {
        this.val = (val & 0xFFFF) % Vram.size;
    }

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

    public get(): number {
        return this.val;
    }
}

export class VRAMDataWriteRegister extends Register {

    public address: string = "0x2118-0x2119";
    public label: string = "VMDATA";

    public setLower(val: number) {
        this.val = Bit.setUint16Lower(this.val, val);

        let ppu: Ppu = this.console.ppu;
        let doIncrement = ppu.registers.vportcntrl.getAddressIncrementMode() == 0;

        let loData: number = Bit.getUint16Lower(this.val);
        let hiData: number = Bit.getUint16Upper(this.val);

        if (doIncrement) {
            this.write(true, loData);
        } else {
            this.write(false, loData);
        }
    }

    public setUpper(val: number) {
        this.val = Bit.setUint16Upper(this.val, val);

        let ppu: Ppu = this.console.ppu;
        let doIncrement = ppu.registers.vportcntrl.getAddressIncrementMode() == 1;

        let loData: number = Bit.getUint16Lower(this.val);
        let hiData: number = Bit.getUint16Upper(this.val);

        if (doIncrement) {
            this.write(true, loData, hiData);
        } else {
            this.write(false, loData, hiData);
        }
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
    }

    public write(doIncrement: boolean, loByte: number, hiByte?: number): void {
        let ppu: Ppu = this.console.ppu;

        let amount = ppu.registers.vportcntrl.getAddressIncrementAmount();
        let type: number = ppu.registers.vportcntrl.getAddressFormation();
        let address: number = VideoPortControlRegister.remap(type, ppu.registers.vaddr.get());
        if (loByte != null) ppu.vram.writeByte(Address.create((address + 0) % Vram.size), loByte);
        if (hiByte != null) ppu.vram.writeByte(Address.create((address + 1) % Vram.size), hiByte);

        if (doIncrement) ppu.registers.vaddr.set(ppu.registers.vaddr.get() + amount);
    }
}

export class Mode7Register extends Register {

    public address: string = "0x211A";
    public label: string = "VMDATAH";

}

export class CosXRegister extends Register {

    public address: string = "0x211B";
    public label: string = "VMDATAH";

}

export class SinXRegister extends Register {

    public address: string = "0x211C";
    public label: string = "VMDATAH";

}

export class SinYRegister extends Register {

    public address: string = "0x211D";
    public label: string = "VMDATAH";

}

export class CosYRegister extends Register {

    public address: string = "0x211E";
    public label: string = "VMDATAH";

}

export class CenterPositionXRegister extends Register {

    public address: string = "0x211F";
    public label: string = "VMDATAH";

}

export class CenterPositionYRegister extends Register {

    public address: string = "0x2120";
    public label: string = "VMDATAH";

}

export class CGRAMAddressRegister extends Register {

    public address: string = "0x2121";
    public label: string = "CGADD";

    public set(val: number): void {
        this.val = ((val * 2) % CGram.size);
    }

    public increment(val: number): void {
        this.val = (this.val + val) % CGram.size;
    }

}

export class CGRAMDataWriteRegister extends Register {

    public address: string = "0x2122";
    public label: string = "CGDATA";

    public counter: number = 0;
    public low: number = 0;
    public high: number = 0;

    public set(val: number): void {
        super.set(val);
        this.low = this.high;
        this.high = val;
        this.counter++;
        let doWrite: boolean = this.counter == 2;

        if (doWrite) {
            let addr: number = this.console.ppu.registers.cgramaddr.get();

            this.console.ppu.cgram.writeByte((addr + 0) % CGram.size, this.low);
            this.console.ppu.cgram.writeByte((addr + 1) % CGram.size, this.high);

            this.console.ppu.registers.cgramaddr.increment(2);
            this.counter = 0;
        }
    }

}

export class WindowMaskSettingsForBG1And2Register extends Register {

    public address: string = "0x2123";
    public label: string = "W12SEL";

}

export class WindowMaskSettingsForBG3And4Register extends Register {

    public address: string = "0x2124";
    public label: string = "W34SEL";

}

export class WindowMaskSettingsForObjRegister extends Register {

    public address: string = "0x2125";
    public label: string = "WOBJSEL";

}

export class WindowPositionForBG0Register extends Register {

    public address: string = "0x2126";
    public label: string = "WH0";

}

export class WindowPositionForBG1Register extends Register {

    public address: string = "0x2127";
    public label: string = "WH1";

}

export class WindowPositionForBG2Register extends Register {

    public address: string = "0x2128";
    public label: string = "WH2";

}

export class WindowPositionForBG3Register extends Register {

    public address: string = "0x2129";
    public label: string = "WH3";

}

export class WindowMaskLogicForBgRegister extends Register {

    public address: string = "0x212A";
    public label: string = "WBGLOG";

}

export class WindowMaskLogicForObjRegister extends Register {

    public address: string = "0x212B";
    public label: string = "WOBJLOG";

}

export class ScreenDestinationForMainRegister extends Register {

    public address: string = "0x212C";
    public label: string = "TM";

}

export class ScreenDestinationForSubRegister extends Register {

    public address: string = "0x212D";
    public label: string = "TS";

}

export class WindowMaskDestinationForMainRegister extends Register {

    public address: string = "0x212E";
    public label: string = "TMW";

}

export class WindowMaskDestinationForSubRegister extends Register {

    public address: string = "0x212F";
    public label: string = "TSW";

}

// Fixed color addition or screen addition register [CGWSEL]
export class ColorMathSelectionRegister extends Register {

    public address: string = "0x2130";
    public label: string = "CGWSEL";

}

// Addition/subtraction for screens, BGs, & OBJs [CGADSUB]
export class ColorMathAddSubAffectRegister extends Register {

    public address: string = "0x2131";
    public label: string = "CGADSUB";

}

// $2132
export class ColorMathDataRegister extends Register {

    public address: string = "0x2132";
    public label: string = "COLDATA";

}

export class ScreenModeSelectRegister extends Register {

    public address: string = "0x2133";
    public label: string = "SETINI";

}

export class MultiplicationResultLowRegister extends Register {

    public address: string = "0x2134";
    public label: string = "MPYL";

}

export class MultiplicationResultMiddleRegister extends Register {

    public address: string = "0x2135";
    public label: string = "MPYM";

}

export class MultiplicationResultHighRegister extends Register {

    public address: string = "0x2136";
    public label: string = "MPYH";

}

export class SoftwareLatchRegister extends Register {

    public address: string = "0x2137";
    public label: string = "SLHV";

}

export class OAMDataReadRegister extends Register {

    public address: string = "0x2138";
    public label: string = "OAMDATAREAD";

    public get(): number {
        let ppu: Ppu = this.console.ppu;
        let addr: number = ppu.registers.oamaddr.getTableAddress();

        ppu.registers.oamaddr.setTableAddress(addr + 1);

        if (addr >= 0x512) {
            return ppu.oam.readByte(Address.create(512 + (addr & 0x1f)));
        } else {
            return ppu.oam.readByte(Address.create(addr));
        }
    }

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
        let ppu: Ppu = this.console.ppu;
        let doIncrement = ppu.registers.vportcntrl.getAddressIncrementMode() == 0;

        if (doIncrement) {
            return this.read(true, false);
        }

        return this.read(false, false);
    }

    public getUpper(): number {
        let ppu: Ppu = this.console.ppu;
        let doIncrement = ppu.registers.vportcntrl.getAddressIncrementMode() == 1;

        if (doIncrement) {
            return this.read(true, true);
        }

        return this.read(false, true);
    }

    public read(doIncrement: boolean, high?: boolean): number {
        let ppu: Ppu = this.console.ppu;

        let amount = ppu.registers.vportcntrl.getAddressIncrementAmount();
        let type: number = ppu.registers.vportcntrl.getAddressFormation();
        let address: number = VideoPortControlRegister.remap(type, ppu.registers.vaddr.get());

        if (doIncrement) ppu.registers.vaddr.set(ppu.registers.vaddr.get() + amount);
        if (high) return ppu.vram.readByte(Address.create(address + 0));
        if (!high) return ppu.vram.readByte(Address.create(address + 1));
    }
}

export class CGRAMDataReadRegister extends Register {

    public address: string = "213B";
    public label: string = "CGDATAREAD";

    public counter: number = 0;

    public get(): number {
        let addr: number = this.console.ppu.registers.cgramaddr.get();
        let value: number = this.console.ppu.cgram.readByte((addr + this.counter) % CGram.size);

        if (this.counter == 1) {
            this.console.ppu.registers.cgramaddr.set((addr + 2) % CGram.size);
            this.counter = 0;
        } else {
            this.counter++;
        }
        return value;
    }

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
