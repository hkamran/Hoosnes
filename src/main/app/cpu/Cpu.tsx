import {Registers} from "./Registers";
import {Operation, Opcodes, OpContext} from "./Opcodes";
import {InterruptHandler} from "./Interrupts";
import {Cartridge} from "../cartridge/Cartridge";
import {Objects} from "../util/Objects";
import {Logger, LoggerManager} from "typescript-logger";
import Console from "../Console";
import {Read} from "../bus/Read";
import {Address} from "../bus/Address";
import {Stack} from "../memory/Stack";
import {Wram} from "../memory/Wram";

export class Cpu {

    public log : Logger = LoggerManager.create('Cpu');

    public registers: Registers;
    public opcodes: Opcodes;
    public console: Console;
    public interrupts: InterruptHandler;

    public stack: Stack = new Stack();
    public wram: Wram = new Wram();

    public context: OpContext;

    public cycles: number = 0;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
        this.registers = new Registers();
        this.opcodes = new Opcodes(this);
        this.interrupts = new InterruptHandler(console, this);
    }

    public tick(): number {
        if (this.interrupts.wait) return 0;
        let interrupts: number = this.interrupts.tick();

        let pc: number = this.registers.pc.get();
        let bank: number = this.registers.k.get();
        let cycles = this.cycles;

        let opaddr: Address = Address.create(pc, bank);
        let opcode: Read = this.console.bus.readByte(opaddr);
        let operation: Operation = this.opcodes.get(opcode.get());

        console.log(opcode.get().toString(16) + " " + operation.name);

        this.registers.pc.set(opaddr.toValue() + operation.getSize());

        let context: OpContext = OpContext.create(this, opaddr, operation);
        this.cycles += operation.execute(context);
        this.context = context;

        let duration = this.cycles - cycles;
        return duration;
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






