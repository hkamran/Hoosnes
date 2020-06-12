import {Console} from "../Console";
import {Registers} from "./Registers";

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

}