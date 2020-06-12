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

export class Palette {

    public cgram: CGram;

    constructor(cgram: CGram) {
        this.cgram = cgram;
    }

    public getPalettes(start: number, end: number) {
        if (start == null || end == null || end < start || start < 0 || end < 0) {
            throw new Error(`Invalid getPalettes from ${start} to ${end}`);
        }

        return this.fetchRange((start * 2), (end * 2));
    }

    // 256 indexed
    public getPalette(index: number): IColor {
        if (index == null || index < 0 || index > 256) {
            throw new Error(`Invalid getPalette from ${index}`);
        }

        let lowHalf: number = this.cgram.readByte((index * 2) + 0);
        let highHalf: number = this.cgram.readByte((index * 2) + 1);

        let data: number = Bit.toUint16(highHalf, lowHalf);
        let color: IColor = parseColor(data);
        return color;
    }

    // 256 indexed
    public getPalettesForBppType(index: number, type: BppType) {
        if (type == BppType.Eight) {
            return this.fetchRange(0, 256);
        } else if (type == BppType.Four) {
            return this.fetchRange((index + 0) * 16, (index + 1) * 16);
        } else if (type == BppType.Two) {
            return this.fetchRange((index + 0) * 4, (index + 1) * 4);
        } else {
            throw new Error(`Invalid getPaletteWithBppType from ${index} ${type}`);
        }
    }

    // 256 indexed
    private fetchRange(startIndex: number, endIndex: number): IColor[] {
        if (startIndex == null || startIndex < 0 || startIndex > 512 ||
            endIndex == null || endIndex < 0 || endIndex > 512 || startIndex > endIndex) {
            throw new Error("Invalid palette " + startIndex + " " + endIndex);
        }

        let colors: IColor[] = [];
        for (let i = startIndex; i < endIndex; i++) {
            let color = this.getPalette(i);
            colors.push(color);
        }
        return colors;
    }

}
