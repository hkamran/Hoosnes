import {Mode, Modes} from "../Modes";
import {Registers} from "./Registers";
import {Opcode, Opcodes, OpContext} from "./Opcodes";
import {Memory} from "../Memory";
import {InterruptHandler} from "./Interrupts";


export class Cpu {

    public registers : Registers = new Registers();
    public opcodes : Opcodes = new Opcodes();
    public memory : Memory;
    public cycles : number = 0;
    public mode : Mode = Modes.bit16;
    public interrupts;

    constructor(memory : Memory) {
        this.memory = memory;
        this.interrupts = new InterruptHandler(this);
    }

    public tick() : number {
        this.interrupts.tick();

        let pc = this.registers.pc.get();
        let cycles = this.cycles;

        let addr : number = this.registers.pc.get();
        let code : number = this.memory.readBytes(0x00, addr, 2);
        let operation : Opcode =  this.opcodes.get(code);
        let operand = operation.getAddressMode().get(addr);
        let context = new OpContext(pc, addr, operand, operation, this.mode);

        this.registers.pc.set(addr + operation.getSize());
        this.cycles += operation.getCycles();

        // Execute operation
        operation.execute(this, context);

        let cyclesTaken = this.cycles - cycles;
        return cyclesTaken;
    }

}






