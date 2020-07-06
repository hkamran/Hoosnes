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

export interface IControllerState {
    data: number[];
    index: number;
    strobe: number;
}

export class Controller {

    public id: number;

    private data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private index: number = 0;
    private strobe: number = 0;

    public constructor(id?: number) {
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

    public reset(): void {
        this.data.fill(0);
    }

    public readByte(address?: number): number {
        if (address == null) {
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
        } else {
            if (address == 1) {
                return this.getHigh();
            } else if (address == 0) {
                return this.getLow();
            }
        }
    }

    public writeByte(address: number, value: number) {
        this.strobe = value;
        if ((this.strobe & 1) == 1) {
            this.index = 0;
        }
    }

    private getHigh(): number {
        return this.data[15] << 7 |
            this.data[14] << 6 |
            this.data[13] << 5 |
            this.data[12] << 4 |
            this.data[11] << 3 |
            this.data[10] << 2 |
            this.data[9] << 1 |
            this.data[8] << 0;
    }

    private getLow(): number {
        return this.data[7] << 7 |
            this.data[6] << 6 |
            this.data[5] << 5 |
            this.data[4] << 4 |
            this.data[3] << 3 |
            this.data[2] << 2 |
            this.data[1] << 1 |
            this.data[0] << 0;
    }

    public saveState(): IControllerState {
        const {data, index, strobe} = this;
        return {
            data: [...data],
            index,
            strobe,
        };
    }

    public loadState(state: IControllerState) {
        this.data = state.data;
        this.index = state.index;
        this.strobe = state.strobe;
    }

}

export const joypadForNetplay: Controller = new Controller();
export const joypadForP1: Controller = new Controller(1);
export const joypadForP2: Controller = new Controller(2);