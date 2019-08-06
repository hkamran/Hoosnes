import {Cpu} from "./cpu/Cpu";
import {Memory} from "./Memory";
import {Cartridge} from "./Cartridge";
import {Logger, LoggerManager} from 'typescript-logger';

export default class Console {

    public log : Logger = LoggerManager.create('Console');

    public memory : Memory;
    public cpu : Cpu;
    public cartridge : Cartridge;

    constructor() {
        this.memory = new Memory();
        this.cpu = new Cpu(this.memory);
    }

    public load(bytes : number[]) : void {
        this.cartridge = new Cartridge(bytes);

        this.log.info("Loaded cartridge!", this.cartridge);
    }


}
