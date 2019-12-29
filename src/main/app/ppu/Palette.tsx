import {CGram} from "../memory/CGram";

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
        let opacity: number = (data >> 15 & 1) == 1 ? 0 : 255;

        return new Color(red, green, blue, opacity);
    }

}

export class Palette {

    public cgram: CGram;

    constructor(cgram: CGram) {
        this.cgram = cgram;
    }

    public getPalette(type: BppType, index: number): Color[] {
        if (type == BppType.Eight) {
            return this.fetchRange(0, 256);
        } else if (type == BppType.Four) {
            if (index < 0 || index > 15) {
                return null;
            }
            return this.fetchRange(index * 15, index * 15 + 15);
        } else if (type == BppType.Two) {
            if (index < 0 || index > 63) {
                return null;
            }
            return this.fetchRange(index * 4, index * 4 + 4);
        } else {
            return null;
        }
    }

    private fetchRange(startIndex: number, endIndex: number): Color[] {
        if (startIndex == null || startIndex < 0 || startIndex > 256 ||
            endIndex == null || endIndex < 0 || endIndex > 256 || startIndex > endIndex) {
            throw new Error("Invalid palette " + startIndex + " " + endIndex);
        }

        let colors: Color[] = [];
        let cramIndex: number = 0;
        for (let i = startIndex; i < endIndex; i++) {
            let lowHalf: number = this.cgram.readByte(cramIndex + 0) << 0;
            let highHalf: number = this.cgram.readByte(cramIndex + 1) << 8;

            let byte: number = lowHalf | highHalf;
            let color: Color = Color.parse(byte);
            cramIndex += 2;
            colors.push(color);
        }
        return colors;
    }

}
