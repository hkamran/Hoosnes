import {Mode, Modes} from "../Modes";
import {Register} from "./Register";
import {Registers} from "./Registers";
import {Opcodes} from "./Opcodes";
import {Memory} from "../Memory";

export class Cpu {

    public registers : Registers = new Registers();
    public opcodes : Opcodes = new Opcodes();
    public memory : Memory;

    constructor(memory : Memory) {
        this.memory = memory;
    }

}






