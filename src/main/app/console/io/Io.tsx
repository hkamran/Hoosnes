import {Console} from "../Console";
import {Registers} from "./Registers";
import {ICpuState} from "../cpu/Cpu";

export interface IIoState {

}

export class Io {
    private console: Console;
    public registers: Registers;


    public nmiEnable: boolean = false;
    public irqMode: number = 0;
    public autoJoypadEnable: boolean = false;
    public nmiStatus: boolean = false;

    public chip5A22Version: number = 2;

    constructor(console: Console) {
        this.console = console;
        this.registers = new Registers(console);
    }

    public import(state: IIoState): void {

    }

    public export(): IIoState {
        return {};
    }

    public reset(): void {
        this.registers.reset();

        this.nmiEnable = false;
        this.irqMode = 0;
        this.autoJoypadEnable = false;
        this.nmiEnable = false;
    }
}