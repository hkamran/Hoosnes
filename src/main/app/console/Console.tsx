import {Cpu} from "./cpu/Cpu";
import {Cartridge} from "./cartridge/Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';
import {Bus} from "./bus/Bus";
import {Ppu} from "./ppu/Ppu";
import {Apu} from "./apu/Apu";
import {Io} from "./io/Io";

export enum ConsoleStatus {
    RUNNING, PAUSED, RESET, OFF,
}

export const TICKS_PER_FRAME: number = 29780;


export class Console {

    public log : Logger = LoggerManager.create('Console');

    public apu: Apu;
    public cpu : Cpu;
    public ppu: Ppu;
    public io: Io;
    public bus: Bus;
    public cartridge : Cartridge;
    public status: ConsoleStatus = ConsoleStatus.OFF;
    public tpf: number = TICKS_PER_FRAME;

    constructor() {
        this.cpu = new Cpu(this);
        this.ppu = new Ppu(this);
        this.apu = new Apu(this);
        this.io = new Io(this);
        this.bus = new Bus(this);
    }

    public load(romBytes : number[]) : void {
        this.status = ConsoleStatus.PAUSED;
        this.reset();

        this.cartridge = new Cartridge(romBytes);
        this.bus.reset();
        this.log.info("Cartridge is Loaded!", this.cartridge);
        this.cpu.load(this.cartridge);
    }

    public play(): void {
        this.status = ConsoleStatus.RUNNING;
    }

    public reset(): void {
        this.status = ConsoleStatus.RESET;
        this.cpu.reset();
        this.ppu.reset();
        this.apu.reset();
        this.io.reset();
        this.bus.reset();
    }

    public pause(): void {
        this.status = ConsoleStatus.PAUSED;
    }

    public export(): void {

    }

    public import(): void {

    }

    public tick(): void {
        let cycles: number = this.cpu.tick();
        this.apu.tick();

        for (let i = 0; i < cycles; i++) {
            this.ppu.tick();
        }
    }

    public stop(): void {
        this.status = ConsoleStatus.PAUSED;
    }

    public ticks(count: number) {
        for (let i = 0; i < (count || 0); i++) {
            this.tick();
        }
    }

    public setTpf(tpf: number): void {
        this.tpf = tpf;
    }
}
