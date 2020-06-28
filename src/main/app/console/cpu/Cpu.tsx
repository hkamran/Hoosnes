import {ICpuRegistersState, Registers} from "./Registers";
import {Opcodes, OpContext, Operation} from "./Opcodes";
import {InterruptHandler} from "./Interrupts";
import {Cartridge} from "../cartridge/Cartridge";
import {Objects} from "../../util/Objects";
import {Console, IConsoleState} from "../Console";
import {Stack} from "../memory/Stack";
import {Wram} from "../memory/Wram";
import {AddressUtil} from "../../util/AddressUtil";
import {trace} from "../../../web/debugger/cpu/LogCard";
import {IApuState} from "../apu/Apu";

export interface ICpuState {
    wram: number[],
    registers: ICpuRegistersState,
    cycles: number,
    ticks: number;
}


export class Cpu {

    public registers: Registers;
    public opcodes: Opcodes;
    public console: Console;
    public interrupts: InterruptHandler;

    public stack: Stack;
    public wram: Wram;

    public context: OpContext;

    public cycles: number = 0;
    public ticks: number = 0;

    public trace: boolean = false;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.console = console;
        this.opcodes = new Opcodes(this);
        this.registers = new Registers(console);
        this.stack = new Stack(console);
        this.wram = new Wram(console);
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
        if (this.trace) console.log(trace(this));
        this.registers.pc.set(pc + operation.getSize());
        this.registers.k.set(bank);
        this.cycles += operation.execute(context);

        let duration = this.cycles - cycles;
        this.ticks++;

        return duration;
    }

    public reset(): void {
        this.cycles = 0;
        this.ticks = 0;

        this.stack.reset();
        this.wram.reset();
        this.registers.reset();
    }

    public export(): ICpuState {
        return {
            wram: this.wram.data,
            registers: this.registers.export(),
            cycles: this.cycles,
            ticks: this.ticks,
        };
    }

    public import(state: ICpuState): void {
        this.wram.data = state.wram;

        this.registers.import(state.registers);

        this.cycles = state.cycles;
        this.ticks = state.ticks;
    }

    public load(cartridge: Cartridge): void {
        Objects.requireNonNull(cartridge);

        if (cartridge.interrupts != null) {
            let reset: number = cartridge.interrupts.emulation.RESET;
            this.registers.pc.set(reset);
        }
    }
}






