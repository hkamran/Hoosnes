import {CGram} from "../memory/CGram";

export enum PaletteBppType {
    Eight,
    Four,
    Two,
}

export class PaletteColor {
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

        let red: number = (data >> 10 & 0x1F) * 8;
        let green: number = (data >> 5 & 0x1F) * 8;
        let blue: number = (data >> 0 & 0x1F) * 8;
        let opacity: number = (data >> 15 & 1) == 1 ? 0 : 100;

        return new PaletteColor(red, green, blue, opacity);
    }

}

export class Palette {

    public cache: Map<number, PaletteColor> = new Map();
    public cgram: CGram;

    constructor(cgram: CGram) {
        this.cgram = cgram;
    }

    public getPalette(type: PaletteBppType, index: number): PaletteColor[] {
        if (type == PaletteBppType.Eight) {
            return this.fetchRange(0, 256);
        } else if (type == PaletteBppType.Four) {
            if (index < 0 || index > 15) {
                return null;
            }
            return this.fetchRange(index * 15, index * 15 + 15);
        } else if (type == PaletteBppType.Two) {
            if (index < 0 || index > 63) {
                return null;
            }
            return this.fetchRange(index * 4, index * 4 + 4);
        } else {
            return null;
        }
    }

    private fetchRange(startIndex: number, endIndex: number): PaletteColor[] {
        if (startIndex == null || startIndex < 0 || startIndex > 256 ||
            endIndex == null || endIndex < 0 || endIndex > 256 || startIndex > endIndex) {
            throw new Error("Invalid palette " + startIndex + " " + endIndex);
        }

        let slice: number[] = this.cgram.data.slice(startIndex, endIndex);
        let colors: PaletteColor[] = [];
        for (let i = 0; i < slice.length; i++) {
            let byte: number = slice[i];
            let color: PaletteColor = this.cache.get(byte);
            if (color == null) {
                color = PaletteColor.parse(byte);
                this.cache.set(byte, color);
            }
            colors.push(color);
        }
        return colors;
    }

}
