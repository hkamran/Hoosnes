import {Registers} from "./Registers";
import {Opcodes, OpContext, Operation} from "./Opcodes";
import {InterruptHandler} from "./Interrupts";
import {Cartridge} from "../cartridge/Cartridge";
import {Objects} from "../util/Objects";
import {Logger, LoggerManager} from "typescript-logger";
import {Console} from "../Console";
import {Address} from "../bus/Address";
import {Stack} from "../memory/Stack";
import {Wram} from "../memory/Wram";

export class Cpu {

    public log : Logger = LoggerManager.create('Cpu');

    public registers: Registers;
    public opcodes: Opcodes;
    public console: Console;
    public interrupts: InterruptHandler;

    public stack: Stack;
    public wram: Wram = new Wram();

    public context: OpContext;

    public cycles: number = 0;
    public ticks: number = 0;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
        this.opcodes = new Opcodes(this);
        this.registers = new Registers(console);
        this.stack = new Stack(console);
        this.interrupts = new InterruptHandler(console, this);
    }

    public tick(): number {
        this.interrupts.tick();
        if (this.interrupts.wait) {
            return InterruptHandler.STALL;
        }

        let pc: number = this.registers.pc.get();
        let bank: number = this.registers.k.get();
        let cycles = this.cycles;

        let opaddr: number = Address.create(pc, bank).toValue();
        let opcode: number = this.console.bus.readByte(opaddr);
        let operation: Operation = this.opcodes.get(opcode);
        let context: OpContext = OpContext.create(this, opaddr, operation);

        this.context = context;
        // this.trace();
        this.registers.pc.set(pc + operation.getSize());
        this.registers.k.set(bank);
        this.cycles += operation.execute(context);

        let duration = this.cycles - cycles;
        this.ticks++;

        return duration;
    }

    private trace(): void {
        let pc = this.console.cpu.registers.k.get().toString(16).padStart(2, "0")
            + this.console.cpu.registers.pc.get().toString(16).padStart(4, "0");
        let opcode = this.console.cpu.context.op.name.toLowerCase();
        let a = this.console.cpu.registers.a.get().toString(16).padStart(4, "0");
        let x = this.console.cpu.registers.x.get().toString(16).padStart(4, "0");
        let y = this.console.cpu.registers.y.get().toString(16).padStart(4, "0");
        let s = this.console.cpu.registers.sp.get().toString(16).padStart(4, "0");
        let d = this.console.cpu.registers.d.get().toString(16).padStart(4, "0");
        let db = this.console.cpu.registers.dbr.get().toString(16).padStart(2, "0");

        let nFlag = this.console.cpu.registers.p.getN() == 1 ? "N" : "n";
        let vFlag = this.console.cpu.registers.p.getV() == 1 ? "V" : "v";
        let mFlag = this.console.cpu.registers.p.getM() == 1 ? "M" : "m";
        let xFlag = this.console.cpu.registers.p.getX() == 1 ? "X" : "x";
        let dFlag = this.console.cpu.registers.p.getD() == 1 ? "D" : "d";
        let iFlag = this.console.cpu.registers.p.getI() == 1 ? "I" : "i";
        let zFlag = this.console.cpu.registers.p.getZ() == 1 ? "Z" : "z";
        let cFlag = this.console.cpu.registers.p.getC() == 1 ? "C" : "c";

        let p = nFlag + vFlag + mFlag + xFlag + dFlag + iFlag + zFlag + cFlag;

        console.log(`${pc} ${opcode} A:${a} X:${x} Y:${y} S:${s} D:${d} DB:${db} ${p}`);
    }

    public reset(): void {
        this.registers.p.setE(0x1);

        this.registers.p.set(0x0);
        this.registers.p.setI(0x1);
        this.registers.p.setZ(0x0);
        this.registers.p.setX(0x1);
        this.registers.p.setM(0x1);
        this.registers.p.setD(0x0);

        this.registers.a.set(0x0);
        this.registers.x.set(0x0000);
        this.registers.y.set(0x0000);
        this.registers.sp.set(0x1FF);
        this.registers.d.set(0x0000);
        this.registers.dbr.set(0x00);
        this.registers.k.set(0x00);

        this.registers.pc.set(0x0000);
    }

    public load(cartridge: Cartridge): void {
        Objects.requireNonNull(cartridge);

        if (cartridge.interrupts != null) {
            let reset: number = cartridge.interrupts.emulation.RESET;
            this.registers.pc.set(reset);
        }
    }
}






