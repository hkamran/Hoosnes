import {Registers} from "./Registers";
import {Console} from "../Console";
import {Address} from "../bus/Address";

export enum ApuState {
    TRANSFER, RUNNING, RESET
}

export class Apu {

    public registers: Registers;
    public state: ApuState = ApuState.RESET;

    public address: Address;
    public amount: number = 0;
    public initializing: boolean = false;

    constructor(console: Console) {
        this.registers = new Registers(console);
    }

    public reset(): void {
        this.registers.apuio0.set(0xAA);
        this.registers.apuio1.set(0xBB);
        this.amount = 0x00;
        this.state = ApuState.RESET;
    }

}