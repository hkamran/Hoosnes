import {Registers} from "./Registers";
import {Console} from "../Console";
import {Address} from "../bus/Address";
import {Bit} from "../util/Bit";

export enum ApuState {
    READY, INITIALIZED, TRANSFER, FINISHED, RUNNING,
}

export class Apu {

    public registers: Registers;
    public state: ApuState = ApuState.READY;

    public address: Address;
    public amount: number = 0;

    constructor(console: Console) {
        this.registers = new Registers(console);
    }

    public reset(): void {
        this.registers.apuio0.reset();
        this.registers.apuio1.reset();
        this.amount = 0x00;
        this.state = ApuState.READY;
    }

}