import {Mode, Modes} from "../Modes";
import {Registers} from "./Registers";
import {Opcode, Opcodes, OpContext} from "./Opcodes";
import {InterruptHandler} from "./Interrupts";
import {Cartridge} from "../Cartridge";
import {Memory} from "../Memory";
import {Objects} from "../util/Objects";
import {Logger, LoggerManager} from "typescript-logger";
import Console from "../Console";


export class Cpu {

    public log : Logger = LoggerManager.create('Cpu');

    public registers: Registers = new Registers();
    public opcodes: Opcodes = new Opcodes();
    public console: Console;
    public cycles: number = 0;
    public interrupts;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
        this.interrupts = new InterruptHandler(this);
    }

    public tick(): number {
        this.interrupts.tick();

        let pc = this.registers.pc.get();
        let cycles = this.cycles;

        let opaddr: number = this.registers.pc.get();
        let opcode: number = this.console.memory.readByte(opaddr);
        let operation: Opcode = this.opcodes.get(opcode);
        let context = new OpContext(pc, opaddr, operation, this.registers.e.getMode(), this);

        this.registers.pc.set(opaddr + operation.getSize());

        // Execute operation
        operation.execute(context);

        this.cycles += operation.getCycle();
        let cyclesTaken = this.cycles - cycles;
        return cyclesTaken;
    }

    public reset(): void {
        this.registers.p.set(0x0);
        this.registers.p.setI(0x1);
        this.registers.p.setX(0x1);
        this.registers.p.setM(0x1);

        this.registers.sp.set(0x100);
        this.registers.e.set(0x1);


        this.registers.pc.set(0x0);
    }

    public load(cartridge: Cartridge) {

    }
}






