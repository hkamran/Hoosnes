import {Objects} from "./util/Objects";
import {Memory} from "./memory/Memory";


let SMS_HEADER_SIZE : number  = 512;
let HEADER_SIZE_NON_ZERO : number = 3;

export class Sms extends Memory {

    public size : number;
    public flags : number;

    public static parse(rom : number[]) {
        let hasSms : boolean = this.checkForSms(rom);
        let sms : Sms = new Sms();
        if (hasSms) {
            sms.size = (rom[1] << 4) | rom[0];
            sms.flags = rom[2];
            return sms;
        } else {
            sms.size = 0;
            sms.flags = 0;
        }
        return sms;
    }

    private static checkForSms(rom: number[]) : boolean {
        let size : number = rom.length;
        let remainder = size % 1024;
        if (remainder == 0) {
            return false;
        }
        if (remainder == 512) {
            return true;
        }
        throw new Error("Error is malformed!");
    }

    readByte(bank: number, offset: number): number {
        return 0;
    }

    writeByte(bank: number, offset: number, byte: number): void {
    }
}

export enum CartridgeLayout {
    LOROM = 0x20,
    HIROM = 0x21,
    FASTROM = 0x10,
}

export enum CartridgeType {
    ROMONLY = 0x00,
    SAVERAM = 0x02,
}

let SNES_OFFSET_LOROM : number = 0x7fc0;
let SNES_OFFSET_HIROM : number = 0xffc0;
let SNES_OFFSET_SIZE : number = 21;
let SNES_OFFSET_SRAM : number = 18;

export class Cartridge extends Memory {

    public rom : number[];
    public name : string;
    public layout : CartridgeLayout;
    public type : CartridgeType;
    public offset: number;
    public size : string; // kb
    public sms : Sms;

    constructor(bytes : number[]) {
        super();
        Objects.requireNonNull(bytes, "Rom cannot be empty!");

        this.rom = bytes;
        this.size = (bytes.length / 1024) + " kb";
        this.sms = Sms.parse(this.rom);
        this.layout = this.getLayoutType(this.rom, this.sms);
        this.offset = this.getHeaderOffset(this.layout, this.sms);
        this.name = this.getName(this.offset);
        this.type = this.getType(this.rom, this.offset);
    }

    private getLayoutType(bytes : number[], sms : Sms) : CartridgeLayout {
        let value : number;
        let layout : CartridgeLayout;

        value = bytes[SNES_OFFSET_LOROM + SNES_OFFSET_SIZE + (sms.size * SMS_HEADER_SIZE)];
        layout = CartridgeLayout[value as unknown as keyof typeof CartridgeLayout];
        if (layout == null) {
            value = bytes[SNES_OFFSET_HIROM + SNES_OFFSET_SIZE + (sms.size * SMS_HEADER_SIZE)];
            layout = CartridgeLayout[value as unknown as keyof typeof CartridgeLayout];
        }
        Objects.requireNonNull(layout, "Unable to parse layout type from rom");
        return layout;
    }

    private getHeaderOffset(layout: CartridgeLayout, sms: Sms) : number {
        if (CartridgeLayout[CartridgeLayout.HIROM] === layout.toString()) {
            return SNES_OFFSET_HIROM + (sms.size * SMS_HEADER_SIZE);
        }
        if (CartridgeLayout[CartridgeLayout.LOROM] === layout.toString()) {
            return SNES_OFFSET_LOROM + (sms.size * SMS_HEADER_SIZE);
        }
        throw Error("Unable to parse header offset from " + layout);
    }

    private getName(offset : number) : string {
        return this.rom.slice(offset, offset + SNES_OFFSET_SIZE)
            .map((c) => String.fromCharCode(c))
            .join('');
    }

    private getType(bytes : number[], offset : number) : CartridgeType {
        let value = bytes[offset + SNES_OFFSET_SIZE + 1];
        let type = CartridgeType[value as unknown as keyof typeof CartridgeType];

        Objects.requireNonNull(type, "Unable to parse cartridge type");
        return type;
    }

    readByte(bank: number, offset: number): number {
        return 0;
    }

    writeByte(bank: number, offset: number, byte: number): void {
    }

}
