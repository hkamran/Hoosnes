import {Console} from "../Console";
import {Registers} from "./Registers";

export class Io {
    private console: Console;
    public registers: Registers;

    constructor(console: Console) {
        this.console = console;
        this.registers = new Registers(console);
    }

}