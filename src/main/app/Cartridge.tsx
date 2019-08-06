import {Objects} from "./util/Objects";


export class SMS {

    // SMC ROM files may have an additional 512-byte SMC header at the beginning:
    //   offset  size in bytes    contents
    //  ----------------------------------------------------------------------------
    //   0       2                ROM dump size, in units of 8kB (little-endian).
    //   2       1                Binary flags for the ROM layout and save-RAM size.
    //   3       509              All zero.

    public static HEADER_SIZE : number = 512;
    public static HEADER_SIZE_NON_ZERO : number = 3;
    public static HEADER_FORMAT : string = "@HB";

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

export class Cartridge {

    public rom : number[];
    public name : string;
    public layout : CartridgeLayout;
    public type : CartridgeType;
    public offset: number;

    constructor(bytes : number[]) {
        Objects.requireNonNull(bytes, "Rom cannot be empty!");

        this.rom = bytes;
        this.layout = this.getLayoutType(this.rom);
        this.offset = this.getHeaderOffset(this.layout);
        this.name = this.getName(this.offset);
        this.type = this.getType(this.rom, this.offset);
    }

    private getLayoutType(bytes : number[]) : CartridgeLayout {
        let value : number;
        let layout : CartridgeLayout;

        value = bytes[SNES_OFFSET_LOROM + SNES_OFFSET_SIZE];
        layout = CartridgeLayout[value as unknown as keyof typeof CartridgeLayout];
        if (layout == null) {
            value = bytes[SNES_OFFSET_HIROM + SNES_OFFSET_SIZE];
            layout = CartridgeLayout[value as unknown as keyof typeof CartridgeLayout];
        }
        Objects.requireNonNull(layout, "Unable to parse layout type from rom");
        return layout;
    }

    private getHeaderOffset(layout : CartridgeLayout) : number {
        if (CartridgeLayout[CartridgeLayout.HIROM] === layout.toString()) {
            return SNES_OFFSET_HIROM;
        }
        if (CartridgeLayout[CartridgeLayout.LOROM] === layout.toString()) {
            return SNES_OFFSET_LOROM;
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

}
