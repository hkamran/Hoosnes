import {Registers} from "./Registers";
import {Console} from "../Console";
import {Address} from "../bus/Address";

export enum ApuState {
    BOOTING, START, TRANSFER, EXECUTE,
}

export class Apu {

    public registers: Registers;
    public state: ApuState = ApuState.BOOTING;

    public address: Address;
    public amount: number = 0;

    constructor(console: Console) {
        this.registers = new Registers(console);
    }

    public reset(): void {
        this.registers.apuio0.read = 0xAA;
        this.registers.apuio1.read = 0xBB;
        this.amount = 0x00;
        this.state = ApuState.BOOTING;
    }

    public tick(): void {
        let state = this.state;
        let registers = this.registers;

        if (state == ApuState.BOOTING) {
            this.amount = 0x00;

            if (registers.apuio0.write == 0xCC && registers.apuio1.write != 0) {
                this.state = ApuState.START;
                registers.apuio0.read = 0xCC;
            }
        } else if (state == ApuState.START) {
            let cmd = registers.apuio1.read; //TODO look into this
            let index = registers.apuio0.write;

            if (cmd != 0 && index == 0) {
                this.state = ApuState.TRANSFER;
                this.amount = 0;
                registers.apuio0.read = this.amount;
            }
        } else if (state == ApuState.TRANSFER) {
            let data = registers.apuio1.write;
            let index = registers.apuio0.write;

            registers.apuio0.read = index;
            let isOver = ((this.amount - index) & 0xFF) > 0b01;
            if (isOver) {
                if (data == 0x00) {
                    this.state = ApuState.EXECUTE;
                } else {
                    this.state = ApuState.START;
                }
            } else if (this.amount > index) {
            } else if (this.amount == index) {
                this.amount = (this.amount + 1) & 0xFF;
            }
        } else if (state == ApuState.EXECUTE) {
            let data = registers.apuio1.write;

            if (data != 0 && registers.apuio0.write == 0x00) {
                this.state = ApuState.TRANSFER;
                this.amount = 0;
            } else if (data == 0) {
                this.reset();
                return;
            }

            registers.apuio0.read = registers.apuio0.write;
        }
    }
}