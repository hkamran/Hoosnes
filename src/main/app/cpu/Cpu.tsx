import {Mode, Modes} from "../Modes";
import {Register} from "./Register";
import {Registers} from "./Registers";
import {Opcode, Opcodes, OpContext} from "./Opcodes";
import {Memory} from "../Memory";


export class Interrupts {

    private cpu : Cpu;

    constructor(cpu : Cpu) {
        this.cpu = cpu;
    }

    public tick() : void {

    }

}

export class Cpu {

    public registers : Registers = new Registers();
    public opcodes : Opcodes = new Opcodes();
    public memory : Memory;
    public cycles : number = 0;

    constructor(memory : Memory) {
        this.memory = memory;
    }

    public tick() : number {

        //interupt tick
        let pc = this.registers.pc.get();
        let cycles = this.cycles;

        let opAddr : number = this.registers.pc.get();
        let opCode : number = this.memory.readBytes(0x00, opAddr, 2);
        let opFunc : Opcode =  this.opcodes.get(opCode);
        let operand = opFunc.getAddressMode().get(opAddr);
        let opContext = new OpContext(pc, opAddr, operand, opFunc);

        this.registers.pc.set(opAddr + opFunc.getSize());
        this.cycles += opFunc.getCycles();

        // Execute operation
        opFunc.execute(opContext);

        let cyclesTaken = this.cycles - cycles;
        return cyclesTaken;
    }

}






