import {Cpu} from "./cpu/Cpu";
import {Cartridge} from "./Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';
import {Bus} from "./Bus";
import {Ppu} from "./ppu/Ppu";

export default class Console {

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
        this.cartridge = new Cartridge(romBytes);
        this.log.info("Cartridge is Loaded!", this.cartridge);
    }

    public tick(): void {

    }
}
