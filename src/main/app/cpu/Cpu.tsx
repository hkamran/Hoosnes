import {Mode, Modes} from "../Modes";
import {Register} from "./Register";
import {Registers} from "./Registers";
import {Opcode, Opcodes, OpContext} from "./Opcodes";
import {Memory} from "../Memory";


export class Interrupts {

}

export class Cpu {

    public registers : Registers = new Registers();
    public opcodes : Opcodes = new Opcodes();
    public memory : Memory;
    public cycles : number = 0;

    constructor(memory : Memory) {
        this.memory = memory;
    }

    public tick() : void {

        //interupt tick
        let pc = this.registers.pc.get();
        let cycles = this.cycles;

        let opaddr : number = this.registers.pc.get();
        let opcode : number = this.memory.readBytes(0x00, opaddr, 2);
        let op : Opcode =  this.opcodes.get(opcode);

        let operand = op.mode.get(opaddr);

        // Prepare context
        let opContext = new OpContext(pc, opaddr, operand, op);

        // update pc
        // this.registers.pc.set(opaddr + op.size);

        // update cycles

        // Execute operation
        op.execute(opContext);

        // Update cpu information

    }

}






