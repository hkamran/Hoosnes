import {Cpu} from "./cpu/Cpu";
import {Memory} from "./Memory";

export default class Console {

    public memory : Memory;
    public cpu : Cpu;

    constructor() {
        this.memory = new Memory();
        this.cpu = new Cpu(this.memory);
    }


}
