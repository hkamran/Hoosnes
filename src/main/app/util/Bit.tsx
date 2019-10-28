export class Bit {

    public static toUint16(a: number, b?: number): number {
        if (a == null || b == null) {
            return null;
        }

        let result = 0;

        if (a) {
            result = (a << 8) | result;
        }

        if (b) {
            result = (b << 0) | result;
        }

        if (result == null || result > 0xFFFF || result < 0) {
            throw new Error("Invalid arguments");
        }

        return result;
    }

    public static toUint24(a: number, b?: number, c?: number): number {
        if (a == null) {
            return null;
        }

        let result = 0;

        if (a) {
            result = (a << 16) | result;
        }

        if (b) {
            result = (b << 8) | result;
        }

        if (c) {
            result = (c << 0) | result;
        }

        if (result == null || result > 0xFFFFFF || result < 0) {
            throw new Error("Invalid arguments");
        }

        return result;
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
