import {Cpu} from "./cpu/Cpu";
import {Cartridge} from "./Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';
import {Memory} from "./Memory";
import {Ppu} from "./Ppu";

export default class Console {

    public log : Logger = LoggerManager.create('Console');

    public cpu : Cpu;
    public ppu: Ppu;
    public memory: Memory;
    public cartridge : Cartridge;

    constructor() {
        this.cpu = new Cpu(this);
        this.ppu = new Ppu(this);
        this.memory = new Memory(this);
    }

    public load(romBytes : number[]) : void {
        this.cartridge = new Cartridge(romBytes);
        this.log.info("Cartridge is Loaded!", this.cartridge);
    }

    public tick(): void {

    }
}
