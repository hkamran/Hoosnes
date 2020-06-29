import {Console} from "../Console";
import {Registers} from "./Registers";
import {ICpuState} from "../cpu/Cpu";

export interface IIoState {
    nmiEnable: boolean;
    irqMode: number;
    autoJoypadEnable: boolean;
    nmiStatus: boolean;
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
        this.nmiEnable = state.nmiEnable;
        this.irqMode = state.irqMode;
        this.autoJoypadEnable = state.autoJoypadEnable;
        this.nmiStatus = state.nmiStatus;
    }

    public export(): IIoState {
        return {
            nmiEnable: this.nmiEnable,
            irqMode: this.irqMode,
            autoJoypadEnable: this.autoJoypadEnable,
            nmiStatus: this.nmiStatus,
        };
    }

    public reset(): void {
        this.registers.reset();

        this.nmiEnable = false;
        this.irqMode = 0;
        this.autoJoypadEnable = false;
        this.nmiEnable = false;
    }
}