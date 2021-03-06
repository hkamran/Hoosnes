export class Bit {

    public static toUint8(value: number) {
        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid value given ${value}`);
        }
        return value;
    }

    public static toUint16(high: number, low?: number): number {
        if (high == null || low == null) {
            return null;
        }

        let result = 0;

        if (high) {
            result = (high << 8) | result;
        }

        if (low) {
            result = (low << 0) | result;
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

    public static getUint24Upper(a: number) {
        if (a == null) {
            return null;
        }

        return (a >> 16) & 0xFF;
    }

    public static getUint24Middle(a: number) {
        if (a == null) {
            return null;
        }

        return (a >> 8) & 0xFF;
    }

    public static getUint24Lower(a: number) {
        if (a == null) {
            return null;
        }

        return (a) & 0xFF;
    }

    public static getUint32Upper(a: number) {
        if (a == null) {
            return null;
        }

        return (a >> 16) & 0xFF;
    }

    public static getUint32Middle(a: number) {
        if (a == null) {
            return null;
        }

        return (a >> 8) & 0xFF;
    }

    public static getUint32Lower(a: number) {
        if (a == null) {
            return null;
        }

        return (a) & 0xFF;
    }

    public static setUint32Upper(num: number, a: number) {
        let val: number = num;

        val = val & (0x00FFFF);
        val = val | ((a & 0xFF) << 16);

        return val & 0xFFFFFF;
    }

    public static setUint32Middle(num: number, a: number) {
        let val: number = num;

        val = val & (0xFF00FF);
        val = val | ((a & 0xFF) << 8);

        return val & 0xFFFFFF;
    }

    public static setUint32Lower(num: number, a: number) {
        let val: number = num;

        val = val & (0xFFFF00);
        val = val | ((a & 0xFF) << 0);

        return val & 0xFFFFFF;
    }

    public static setUint24Upper(num: number, a: number) {
        let val: number = num;

        val = val & (0x0FFFF);
        val = val | ((a & 0xF) << 16);

        return val & 0xFFFFF;
    }

    public static setUint24Middle(num: number, a: number) {
        let val: number = num;

        val = val & (0xF00FF);
        val = val | ((a & 0xFF) << 8);

        return val & 0xFFFFF;
    }

    public static setUint24Lower(num: number, a: number) {
        let val: number = num;

        val = val & (0xFFF00);
        val = val | ((a & 0xFF) << 0);

        return val & 0xFFFFF;
    }

    public static setUint16Lower(num: number, a: number) {
        let val: number = num;

        val = val & 0xFF00;
        val = val | (a & 0xFF);

        return val;
    }

    public static setUint16Upper(num: number, a: number) {
        let val: number = num;

        val = val & (0x00FF);
        val = val | ((a & 0xFF) << 8);

        return val;
    }

}
