import {CGram} from "../memory/CGram";
import {Bit} from "../util/Bit";
import {Objects} from "../util/Objects";

export enum BppType {
    Eight = 8,
    Four = 4,
    Two = 2,
}

export class Color {
    public red: number;
    public green: number;
    public blue: number;
    public opacity: number;

    constructor(red: number, green: number, blue: number, opacity: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.opacity = opacity;
    }

    public static parse(data: number) {
        if (data == null || data < 0 || data > 0xFFFF) {
            return null;
        }

        let blue: number = (data >> 10 & 0x1F) * 8;
        let green: number = (data >> 5 & 0x1F) * 8;
        let red: number = (data >> 0 & 0x1F) * 8;
        let opacity: number = 255;

        return new Color(red, green, blue, opacity);
    }

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

    public getPalette(index: number): Color {
        if (index == null || index < 0 || index > 256) {
            throw new Error(`Invalid getPalette from ${index}`);
        }

        let lowHalf: number = this.cgram.readByte((index * 2) + 0);
        let highHalf: number = this.cgram.readByte((index * 2) + 1);

        let byte: number = Bit.toUint16(highHalf, lowHalf);
        let color: Color = Color.parse(byte);

        Objects.requireNonNull(color);

        return color;
    }

    public getPalettesForBppType(index: number, type: BppType) {
        if (type == BppType.Eight) {
            return this.fetchRange(0, 512);
        } else if (type == BppType.Four) {
            return this.fetchRange(index, index + (16 * 2));
        } else if (type == BppType.Two) {
            return this.fetchRange(index, index + (4 * 2));
        } else {
            throw new Error(`Invalid getPaletteWithBppType from ${index} ${type}`);
        }
    }

    private fetchRange(startIndex: number, endIndex: number): Color[] {
        if (startIndex == null || startIndex < 0 || startIndex > 512 ||
            endIndex == null || endIndex < 0 || endIndex > 512 || startIndex > endIndex) {
            throw new Error("Invalid palette " + startIndex + " " + endIndex);
        }

        let colors: Color[] = [];
        for (let i = startIndex; i < endIndex; i = i + 2) {
            let lowHalf: number = this.cgram.readByte(i + 0);
            let highHalf: number = this.cgram.readByte(i + 1);

            let byte: number = Bit.toUint16(highHalf, lowHalf);
            let color: Color = Color.parse(byte);
            colors.push(color);
        }
        return colors;
    }

}
