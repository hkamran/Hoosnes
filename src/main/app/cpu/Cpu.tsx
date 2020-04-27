import {Registers} from "./Registers";
import {Opcodes, OpContext, Operation} from "./Opcodes";
import {InterruptHandler} from "./Interrupts";
import {Cartridge} from "../cartridge/Cartridge";
import {Objects} from "../util/Objects";
import {Console} from "../Console";
import {Stack} from "../memory/Stack";
import {Wram} from "../memory/Wram";
import {AddressUtil} from "../util/AddressUtil";
import {trace} from "../../web/debugger/cpu/LogCard";

export class Cpu {

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

        let opaddr: number = AddressUtil.create(pc, bank);
        let opcode: number = this.console.bus.readByte(opaddr);
        let operation: Operation = this.opcodes.get(opcode);
        let context: OpContext = OpContext.create(this, opaddr, operation);

        this.context = context;
        //console.log(trace(this));
        this.registers.pc.set(pc + operation.getSize());
        this.registers.k.set(bank);
        this.cycles += operation.execute(context);

        let duration = this.cycles - cycles;
        this.ticks++;

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






