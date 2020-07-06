import {Objects} from "../../util/Objects";
import {ByteReader} from "../../util/ByteReader";
import {CartridgeMapping0} from "./CartridgeMapping0";
import {CartridgeMapping1} from "./CartridgeMapping1";
import {CartridgeMapping5} from "./CartridgeMapping5";
import {CartridgeMapping4} from "./CartridgeMapping4";
import {CartridgeMapping2} from "./CartridgeMapping2";
import {Sram} from "../memory/Sram";
import {CartridgeMapping3} from "./CartridgeMapping3";
import {Bit} from "../../util/Bit";
import {ICpuState} from "../cpu/Cpu";

export interface ICartridgeMapping {
    label: string;
    read(address: number): number;
    write(address: number, value: number): void;
}

export interface ICartridgeState {
    rom: number[];
}

export class InterruptAddresses {
    public COP: number;
    public BRK: number;
    public ABORT: number;
    public NMI: number;
    public RESET: number;
    public IRQ: number;
}

export class InterruptVectors {

    public emulation: InterruptAddresses = new InterruptAddresses();
    public native: InterruptAddresses = new InterruptAddresses();

    constructor(rom: number[], offset: number) {
        this.native.COP = ByteReader.readWord(rom, offset + 0x24);
        this.native.BRK = ByteReader.readWord(rom, offset + 0x26);
        this.native.ABORT = ByteReader.readWord(rom, offset + 0x28);
        this.native.NMI = ByteReader.readWord(rom, offset + 0x2A);
        this.native.RESET = ByteReader.readWord(rom, offset + 0x2C);
        this.native.IRQ = ByteReader.readWord(rom, offset + 0x2E);

        this.emulation.COP = ByteReader.readWord(rom, offset + 0x34);
        this.emulation.ABORT = ByteReader.readWord(rom, offset + 0x38);
        this.emulation.NMI = ByteReader.readWord(rom, offset + 0x3A);
        this.emulation.RESET = ByteReader.readWord(rom, offset + 0x3C);
        this.emulation.BRK = ByteReader.readWord(rom, offset + 0x3E);
        this.emulation.IRQ = ByteReader.readWord(rom, offset + 0x3E);
    }
}



const SMC_HEADER_SIZE: number = 512;

export enum CartridgeMappingType {
    LOROM = 0x20,
    HIROM = 0x21,
    SUPER_MMC1 = 0x22,
    SUPER_MMC2 = 0x2A,
    LOROM_FASTROM = 0X30,
    HIROM_FASTROM = 0X31,
    SAS = 0x23,
    SFX = 0x24,
    EXHIROM = 0x25,
}

export enum CartridgeType {
    ROMONLY = 0x00,
    SAVERAM = 0x02,
}

const SNES_OFFSET_LOROM: number = 0x7fc0;
const SNES_OFFSET_HIROM: number = 0xffc0;
const SNES_OFFSET_TITLE: number = 0x15; // xFC0
const SNES_OFFSET_MAP_TYPE: number = 0x15; // xFD5
const SNES_OFFSET_ROM_TYPE: number = 0x16; // xFD6
const SNES_OFFSET_ROM_SIZE: number = 0x17; // xFD7
const SNES_OFFSET_SRAM_SIZE: number = 0x18; // xFD8
const SNES_OFFSET_LICENSE: number = 0x19; // xFD9
const SNES_OFFSET_VERSION: number = 0x1b; // xFDB
const SNES_OFFSET_COMPLEMENT_CHECK: number = 0x1c; // xFDC
const SNES_OFFSET_CHECKSUM: number = 0x1e; // xFDE

export class Cartridge {

    public rom: number[] = [];
    public aux: number[] = [];

    public title: string = ""; // xFC0
    public mapping: ICartridgeMapping; // xFD5
    public type: CartridgeType; // xFD6
    public size: number; // xFD7
    public sram: Sram; // xFD8
    public smcSize: number = 0;
    public license: number; // xFD9
    public version: number; // xFDB
    public complement: number; // xFDC
    public checksum: number; // xFDE
    public interrupts: InterruptVectors;

    public load(rom: number[]): void {
        Objects.requireNonNull(rom, "Rom cannot be empty!");

        // SMC header
        let romLength: number = rom.length;
        this.smcSize = romLength % 1024;
        if (this.smcSize != 0 && this.smcSize != 512) {
            throw new Error(`SMC is malformed! ${this.smcSize}`);
        }

        this.rom = rom.slice(this.smcSize);

        // Determine the offset
        let mappingType: CartridgeMappingType = this.getLayoutType();
        let offset: number = this.getHeaderOffset(mappingType);

        this.mapping = this.getMapping(mappingType);
        this.title = this.getTitle(offset, offset + SNES_OFFSET_TITLE);
        this.type = this.getType(offset + SNES_OFFSET_ROM_TYPE);
        this.size = 400 << ByteReader.readByte(rom, offset + SNES_OFFSET_ROM_SIZE);
        this.sram = new Sram(ByteReader.readByte(rom, offset + SNES_OFFSET_SRAM_SIZE));
        this.license = ByteReader.readByte(rom, offset + SNES_OFFSET_LICENSE);
        this.version = ByteReader.readByte(rom, offset + SNES_OFFSET_VERSION);
        this.complement = ByteReader.readWord(rom, offset + SNES_OFFSET_COMPLEMENT_CHECK);
        this.checksum = ByteReader.readWord(rom, offset + SNES_OFFSET_CHECKSUM);
        this.interrupts = new InterruptVectors(rom, offset);
    }

    private getLayoutType(): CartridgeMappingType {
        let value: number;
        let layout: CartridgeMappingType;

        value = ByteReader.readByte(this.rom, SNES_OFFSET_LOROM + SNES_OFFSET_MAP_TYPE);
        layout = CartridgeMappingType[value as unknown as keyof typeof CartridgeMappingType];
        if (layout == null) {
            value = ByteReader.readByte(this.rom, SNES_OFFSET_HIROM + SNES_OFFSET_MAP_TYPE);
            layout = CartridgeMappingType[value as unknown as keyof typeof CartridgeMappingType];
        }
        Objects.requireNonNull(layout, "Unable to parse mappingType type: 0x" + value.toString(16));
        return layout;
    }

    private getHeaderOffset(layout: CartridgeMappingType): number {
        if (CartridgeMappingType[CartridgeMappingType.HIROM] === layout.toString()) {
            return SNES_OFFSET_HIROM;
        }
        if (CartridgeMappingType[CartridgeMappingType.HIROM_FASTROM] === layout.toString()) {
            return SNES_OFFSET_HIROM;
        }
        if (CartridgeMappingType[CartridgeMappingType.LOROM] === layout.toString()) {
            return SNES_OFFSET_LOROM;
        }
        if (CartridgeMappingType[CartridgeMappingType.LOROM_FASTROM] === layout.toString()) {
            return SNES_OFFSET_LOROM;
        }
        throw Error("Unable to parse header offset from " + layout);
    }

    private getTitle(start: number, end: number): string {
        return this.rom.slice(start, end + 1)
            .map((c) => String.fromCharCode(c))
            .join('').toUpperCase().trim();
    }

    private getType(offset: number): CartridgeType {
        let value = ByteReader.readByte(this.rom, offset);
        let type = CartridgeType[value as unknown as keyof typeof CartridgeType];

        Objects.requireNonNull(type, "Unable to parse cartridge type");
        return type;
    }

    public readByte(address: number): number {
        return Bit.toUint8(this.mapping.read(address));
    }

    public writeByte(address: number, value: number): void {
        return this.mapping.write(address, value);
    }

    private getMapping(mappingType: CartridgeMappingType): ICartridgeMapping {
        if (mappingType.toString() == CartridgeMappingType[CartridgeMappingType.LOROM] ||
            mappingType.toString() == CartridgeMappingType[CartridgeMappingType.LOROM_FASTROM]) {
            return new CartridgeMapping0(this);
        } else if (mappingType.toString()  == CartridgeMappingType[CartridgeMappingType.HIROM] ||
            mappingType.toString()  == CartridgeMappingType[CartridgeMappingType.HIROM_FASTROM]) {
            return new CartridgeMapping1(this);
        } else if (mappingType.toString()  == CartridgeMappingType[CartridgeMappingType.SUPER_MMC1] ||
            mappingType.toString() == CartridgeMappingType[CartridgeMappingType.SUPER_MMC2]) {
            return new CartridgeMapping2(this);
        } else if (mappingType.toString()  == CartridgeMappingType[CartridgeMappingType.SAS]) {
            return new CartridgeMapping3(this);
        } else if (mappingType.toString()  == CartridgeMappingType[CartridgeMappingType.SFX]) {
            return new CartridgeMapping4(this);
        } else if (mappingType.toString()  == CartridgeMappingType[CartridgeMappingType.EXHIROM]) {
            return new CartridgeMapping5(this);
        } else {
            throw new Error("Unknown cartridge mapping type " + mappingType.valueOf());
        }
    }

    public loadState(state: ICartridgeState): void {
        if (state.rom.length > 0) {
            this.load(state.rom);
        }
    }

    public saveState(): ICartridgeState {
        return {
            rom: this.rom,
        };
    }
}
