export enum Key {
    R = 4,
    L = 5,
    X = 6,
    A = 7,
    RIGHT = 8,
    LEFT = 9,
    DOWN = 10,
    UP = 11,
    START = 12,
    SELECT = 13,
    Y = 14,
    B = 15,
}

export class Controller {

    public id: number;

    private data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private index: number = 0;
    private strobe: number = 0;

    public constructor(id: number) {
        this.id = id;
    }

    public pressKey(key: Key): void {
        if (key == null) return;
        this.data[key] = 1;
    }

    public releaseKey(key: Key): void {
        if (key == null) return;
        this.data[key] = 0;
    }

    public readByte(address?: number): number {
        if (address == 1) {
            return this.data[15] << 7 |
                this.data[14] << 6 |
                this.data[13] << 5 |
                this.data[12] << 4 |
                this.data[11] << 3 |
                this.data[10] << 2 |
                this.data[9] << 1 |
                this.data[8] << 0;
        } else if (address == 0) {
            return this.data[7] << 7 |
                this.data[6] << 6 |
                this.data[5] << 5 |
                this.data[4] << 4 |
                this.data[3] << 3 |
                this.data[2] << 2 |
                this.data[1] << 1 |
                this.data[0] << 0;
        } else {
            let result = 0;
            let size: number = this.data.length;
            if (this.index < size) {
                result = this.data[this.index];
            }

            this.index++;

            if ((this.strobe & 1) == 1) {
                this.index = 0;
            }

            if (this.index > size) {
                this.index = size;
                return 1;
            }
            return result;
        }
    }

    public writeByte(address: number, value: number) {
        this.strobe = value;
        if ((this.strobe & 1) == 1) {
            this.index = 0;
        }
    }

}

export const joy1: Controller = new Controller(1);
export const joy2: Controller = new Controller(2);