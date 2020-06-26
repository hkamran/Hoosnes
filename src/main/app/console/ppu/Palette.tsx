import {CGram} from "../memory/CGram";
import {Bit} from "../../util/Bit";
import {Objects} from "../../util/Objects";
import {Dictionary} from "../../interfaces/Structures";

export enum BppType {
    Eight = 8,
    Four = 4,
    Two = 2,
}

export interface IColor {
    red: number;
    green: number;
    blue: number;
    opacity: number;
}

export function parseColor(data: number): IColor {
    if (data == null || data < 0 || data > 0xFFFF) {
        throw new Error(`Invalid color data given ${data}`);
    }

    let blue: number = (data >> 10 & 0x1F) * 8;
    let green: number = (data >> 5 & 0x1F) * 8;
    let red: number = (data >> 0 & 0x1F) * 8;
    let opacity: number = 255;

    return {
        red, green, blue, opacity,
    };
}

const PALETTE_BYTE_LENGTH = 2;

export class Palette {

    public cgram: CGram;

    constructor(cgram: CGram) {
        this.cgram = cgram;
    }

    public reset(): void {
        this.cgram.reset();
    }

    // 0-255 indexed
    public getPaletteAt(paletteIndex: number, paletteTable?: number, type?: BppType): IColor {
        if (paletteIndex == null || paletteIndex < 0 || paletteIndex > 255) {
            throw new Error(`Invalid getPalette from ${paletteIndex}`);
        }

        let address = paletteIndex;
        if (type == BppType.Four) {
            address += paletteTable * 16;
        } else if (type == BppType.Two) {
            address += paletteTable * 4;
        }
        address *= PALETTE_BYTE_LENGTH;

        let lowHalf: number = this.cgram.readByte(address + 0);
        let highHalf: number = this.cgram.readByte(address+ 1);

        let data: number = Bit.toUint16(highHalf, lowHalf);
        let color: IColor = parseColor(data);
        return color;
    }

}
