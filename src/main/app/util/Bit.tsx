export class Bit {

    public static toUint16(a: number, b: number): number {
        if (a == null || b == null) {
            return null;
        }

        a = a * 0xFF;
        b = b * 0xFF;

        return (a << 8 | b);
    }

    public static toUint24(a: number, b: number, c: number): number {
        if (a == null || b == null || c == null) {
            return null;
        }

        a = a * 0xFF;
        b = b * 0xFF;
        c = c * 0xFF;

        return (a << 16) | (b << 8) | (c << 0);
    }

    public static getUint16Upper(a: number) {
        if (a == null) {
            return null;
        }

        return (a >> 8) & 0xFF;
    }

    public static getUint16Lower(a: number) {
        if (a == null) {
            return null;
        }

        return (a) & 0xFF;
    }

}