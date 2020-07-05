import {Cpu, ICpuState} from "./cpu/Cpu";
import {Cartridge, ICartridgeMapping, ICartridgeState} from "./cartridge/Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';
import {Bus} from "./bus/Bus";
import {IPpuState, Ppu} from "./ppu/Ppu";
import {Apu, IApuState} from "./apu/Apu";
import {IIoState, Io} from "./io/Io";

export enum ConsoleStatus {
    RUNNING, PAUSED, RESET, OFF,
}

export const TICKS_PER_FRAME: number = 29780;

export interface IConsoleState {
    apu: IApuState;
    cpu: ICpuState;
    ppu: IPpuState;
    io: IIoState;
    cartridge: ICartridgeState;
}

export class Console {

    public log : Logger = LoggerManager.create('Console');

    public apu: Apu;
    public cpu : Cpu;
    public ppu: Ppu;
    public io: Io;
    public cartridge : Cartridge;

    public bus: Bus;

    public status: ConsoleStatus = ConsoleStatus.OFF;
    public tpf: number = TICKS_PER_FRAME;

    constructor() {
        this.cpu = new Cpu(this);
        this.ppu = new Ppu(this);
        this.apu = new Apu(this);
        this.io = new Io(this);
        this.cartridge = new Cartridge();
        this.bus = new Bus(this);
    }

    public load(rom : number[]) : void {
        this.status = ConsoleStatus.PAUSED;
        this.reset();

        this.cartridge.load(rom);
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

    public stop(): void {
        this.status = ConsoleStatus.PAUSED;
    }

    public saveState(): IConsoleState {
        return copy({
                cartridge: this.cartridge.saveState(),
                apu: this.apu.saveState(),
                io: this.io.saveState(),
                cpu: this.cpu.saveState(),
                ppu: this.ppu.saveState(),
            });
    }

    public loadState(state: IConsoleState): void {
        const clone = copy(state);

        this.cartridge.loadState(clone.cartridge);
        this.apu.loadState(clone.apu);
        this.io.loadState(clone.io);
        this.cpu.loadState(clone.cpu);
        this.ppu.loadState(clone.ppu);
    }

    public tick(): void {
        let cycles: number = this.cpu.tick();
        this.apu.tick();

        for (let i = 0; i < cycles; i++) {
            this.ppu.tick();
        }
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

function copy(x) {
    return JSON.parse(JSON.stringify(x));
}