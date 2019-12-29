import {Cpu} from "./cpu/Cpu";
import {Cartridge} from "./cartridge/Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';
import {Bus} from "./bus/Bus";
import {Ppu} from "./ppu/Ppu";

export class Console {

    public log : Logger = LoggerManager.create('Console');

    public cpu : Cpu;
    public ppu: Ppu;
    public bus: Bus;
    public cartridge : Cartridge;

    constructor() {
        this.cpu = new Cpu(this);
        this.ppu = new Ppu(this);
        this.bus = new Bus(this);
    }

    public load(romBytes : number[]) : void {
        this.reset();

        this.cartridge = new Cartridge(romBytes);
        this.log.info("Cartridge is Loaded!", this.cartridge);
        this.cpu.load(this.cartridge);
    }

    public reset(): void {
        this.cpu.reset();
        this.ppu.reset();
    }

    public tick(): void {
        let cycles: number = this.cpu.tick();

        for (let i = 0; i < cycles; i++) {
            this.ppu.tick();
        }
    }

    public ticks(count: number) {
        for (let i = 0; i < (count || 0); i++) {
            this.tick();
        }
    }
}
