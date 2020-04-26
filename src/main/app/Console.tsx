import {Cpu} from "./cpu/Cpu";
import {Cartridge} from "./cartridge/Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';
import {Bus} from "./bus/Bus";
import {Ppu} from "./ppu/Ppu";
import {Apu} from "./apu/Apu";
import {animateFrames} from "../web/Main";

export enum ConsoleState {
    RUNNING, PAUSED, RESET, OFF,
}

export const TICKS_PER_FRAME: number = 29780;

export class Console {

    public log : Logger = LoggerManager.create('Console');

    public apu: Apu;
    public cpu : Cpu;
    public ppu: Ppu;
    public bus: Bus;
    public cartridge : Cartridge;
    public state: ConsoleState = ConsoleState.OFF;

    constructor() {
        this.cpu = new Cpu(this);
        this.ppu = new Ppu(this);
        this.apu = new Apu(this);
        this.bus = new Bus(this);
    }

    public load(romBytes : number[]) : void {
        this.state = ConsoleState.PAUSED;
        this.reset();

        this.cartridge = new Cartridge(romBytes);
        this.bus.reset();
        this.log.info("Cartridge is Loaded!", this.cartridge);
        this.cpu.load(this.cartridge);
    }

    public play(): void {
        this.state = ConsoleState.RUNNING;
        animateFrames();
    }

    public reset(): void {
        this.state = ConsoleState.RESET;
        this.cpu.reset();
        this.ppu.reset();
        this.apu.reset();
        this.bus.reset();
    }

    public tick(): void {
        let cycles: number = this.cpu.tick();
        this.apu.tick();

        for (let i = 0; i < cycles; i++) {
            this.ppu.tick();
        }
    }

    public stop(): void {
        this.state = ConsoleState.PAUSED;
    }

    public ticks(count: number) {
        for (let i = 0; i < (count || 0); i++) {
            this.tick();
        }
    }
}
