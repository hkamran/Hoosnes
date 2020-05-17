import {Registers} from "./Registers";
import {Console} from "../Console";
import {Bit} from "../util/Bit";

export enum ApuState {
    BOOTING, START, BLOCK,TRANSFER, EXECUTE,
}

export class Apu {

    public registers: Registers;
    public state: ApuState = ApuState.BOOTING;

    public amount: number = 0;

    constructor(console: Console) {
        this.registers = new Registers(console);
    }

    public reset(): void {
        this.registers.apuio0.read = 0xAA;
        this.registers.apuio0.write = 0xAA;
        this.registers.apuio1.read = 0xBB;
        this.registers.apuio1.write = 0xBB;
        this.amount = 0x00;
        this.state = ApuState.BOOTING;
    }

    public tick(): void {
        let state = this.state;
        let registers = this.registers;

        if (state == ApuState.BOOTING) {
            if (registers.apuio0.write == 0xCC) {
                this.state = ApuState.START;
            }
        } else if (state == ApuState.START) {
            let addr = Bit.toUint16(registers.apuio3.write, registers.apuio2.write);
            let cmd = registers.apuio1.write;
            let index = registers.apuio0.write;
            registers.apuio0.read = registers.apuio0.write;

            if (cmd != 0) {
                this.state = ApuState.BLOCK;
            } else if (cmd == 0) {
                this.state = ApuState.EXECUTE;
            }
        } else if (state == ApuState.BLOCK) {
            let index = registers.apuio0.write;
            if (index == 0) {
                this.amount = 0;
                this.state = ApuState.TRANSFER;
            }
        } else if (state == ApuState.TRANSFER) {
            let data = registers.apuio1.write;
            let index = registers.apuio0.write;

            registers.apuio0.read = index;
            let isOver = ((this.amount - index) & 0xFF) > 0b01;
            if (isOver) {
                this.state = ApuState.START;
            } else if (this.amount > index) {
            } else if (this.amount == index) {
                this.amount = (this.amount + 1) & 0xFF;
            }
        } else if (state == ApuState.EXECUTE) {
            this.reset();
        }
    }
}