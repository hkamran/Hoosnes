import {Cpu} from "./Cpu";
import {Registers} from "./Registers";
import {Console} from "../Console";

export enum InterruptType {
    NONE,
    COP,
    BRK,
    ABT,
    NMI,
    RST,
    IRQ,
}

export class InterruptHandler {

    public interrupt : InterruptType = InterruptType.NONE;

    private console : Console;
    private registers: Registers;
    private cpu: Cpu;

    public wait: boolean = false;
    public irq: boolean = false;
    public static readonly STALL: number = 3;

    constructor(console: Console, cpu: Cpu) {
        this.console = console;
        this.cpu = cpu;
        this.registers = cpu.registers;
    }

    public tick() : number {
        switch (this.interrupt) {
            case InterruptType.NONE: {
                return this.doNone();
            }
            case InterruptType.RST: {
                return this.doRST();
            }
            case InterruptType.ABT: {
                return this.doABT();
            }
            case InterruptType.IRQ: {
                return this.doIRQ();
            }
            case InterruptType.NMI: {
                return this.doNMI();
            }
            case InterruptType.COP: {
                return this.doCOP();
            }
            case InterruptType.BRK: {
                return this.doBRK();
            }
            default:
                throw new Error(`Unknown interrupt given ${this.interrupt}`);
        }
    }

    public set(interrupt : InterruptType) : void {
        this.interrupt = interrupt;
    }

    private doNone(): number {
        this.interrupt = InterruptType.NONE;

        return 0;
    }

    private doCOP(): number {
        let isNative = this.registers.p.getE() == 0;

        let pb: number = this.registers.k.get();
        let pc: number = this.registers.pc.get();
        let p: number = this.registers.p.get();

        if (isNative) this.cpu.stack.pushByte(pb);
        this.cpu.stack.pushWord(pc);
        this.cpu.stack.pushByte(p);

        this.registers.p.setI(1);
        this.registers.p.setD(0);

        if (isNative) {
            let value: number = this.console.cartridge.interrupts.native.COP;
            let bank = 0;
            let offset = value;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        } else {
            let value: number = this.console.cartridge.interrupts.native.COP;
            let bank = (value >> 16) & 0xFF;
            let offset = value & 0xFFFF;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        }
        this.interrupt = InterruptType.NONE;
        this.wait = false;
        return 0;
    }

    private doBRK(): number {
        let isNative = this.registers.p.getE() == 0;

        let pb: number = this.registers.k.get();
        let pc: number = this.registers.pc.get();
        let p: number = this.registers.p.get();

        if (isNative) this.cpu.stack.pushByte(pb);
        this.cpu.stack.pushWord(pc);
        this.cpu.stack.pushByte(p);

        this.registers.p.setI(1);
        this.registers.p.setD(0);

        if (isNative) {
            let value: number = this.console.cartridge.interrupts.native.BRK;
            let bank = 0;
            let offset = value;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        } else {
            let value: number = this.console.cartridge.interrupts.native.BRK;
            let bank = (value >> 16) & 0xFF;
            let offset = value & 0xFFFF;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        }
        this.interrupt = InterruptType.NONE;
        this.wait = false;
        return 0;
    }

    private doNMI(): number {
        let isNative = this.registers.p.getE() == 0;

        let pb: number = this.registers.k.get();
        let pc: number = this.registers.pc.get();
        let p: number = this.registers.p.get();

        if (isNative) this.cpu.stack.pushByte(pb);
        this.cpu.stack.pushWord(pc);
        this.cpu.stack.pushByte(p | 0x10);

        this.registers.p.setI(1);
        this.registers.p.setD(0);

        if (isNative) {
            let value: number = this.console.cartridge.interrupts.native.NMI;
            let bank = 0;
            let offset = value;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        } else {
            let value: number = this.console.cartridge.interrupts.emulation.NMI;
            let bank = (value >> 16) & 0xFF;
            let offset = value & 0xFFFF;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        }
        this.interrupt = InterruptType.NONE;
        this.wait = false;
        return 0;
    }

    private doIRQ(): number {
        if (this.registers.p.getI() == 1) {
            return ;
        }

        let isNative = this.registers.p.getE() == 0;

        let pb: number = this.registers.k.get();
        let pc: number = this.registers.pc.get();
        let p: number = this.registers.p.get();

        if (isNative) this.cpu.stack.pushByte(pb);
        this.cpu.stack.pushWord(pc);
        this.cpu.stack.pushByte(p);

        this.registers.p.setI(1);
        this.registers.p.setD(0);

        if (isNative) {
            let value: number = this.console.cartridge.interrupts.native.IRQ;
            let bank = 0;
            let offset = value;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        } else {
            let value: number = this.console.cartridge.interrupts.native.IRQ;
            let bank = (value >> 16) & 0xFF;
            let offset = value & 0xFFFF;

            this.registers.pc.set(offset);
            this.registers.k.set(bank);
        }
        this.interrupt = InterruptType.NONE;
        this.wait = false;
        return 0;
    }

    private doABT(): number {
        this.wait = false;
        throw new Error("Invalid interrupt ABORT");
    }

    private doRST(): number {
        this.wait = false;
        throw new Error("Invalid interrupt RESET");
    }
}
