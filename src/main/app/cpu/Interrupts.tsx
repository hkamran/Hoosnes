import {Cpu} from "./Cpu";

export class Interrupt {

    public id : number;
    public label : string;
    public bank : number;
    public addr8 : number;
    public addr16 : number;
    public size : number;

    constructor(id : number, bank: number, addr8: number, addr16: number, size: number, label: string) {
        this.id = id;
        this.bank = bank;
        this.addr8 = addr8;
        this.addr16 = addr16;
        this.size = size;
        this.label = label;
    }
}

export class InterruptHandler {

    public NONE: Interrupt = new Interrupt(0, 0x00, 0x0000, 0x0000, 4, "NONE");
    public COP : Interrupt = new Interrupt(1, 0x00, 0xFFE4, 0xFFF4, 2, "COP");
    public BRK : Interrupt = new Interrupt(2, 0x00, 0xFFE6, 0xFFF6, 2, "BREAK");
    public ABT : Interrupt = new Interrupt(3, 0x00, 0xFFE8, 0xFFF8, 2, "ABORT");
    public NMI : Interrupt = new Interrupt(4, 0x00, 0xFFEA, 0xFFAA, 2, "NMI");
    public RST : Interrupt = new Interrupt(5, 0x00, 0xFFEC, 0xFFFC, 2, "RESET");
    public IRQ : Interrupt = new Interrupt(6, 0x00, 0xFFEE, 0xFFFE, 2, "IRQ");

    public interrupt : Interrupt = this.NONE;

    private cpu : Cpu;

    constructor(cpu : Cpu) {
        this.cpu = cpu;
    }

    public tick() : void {
        switch (this.interrupt) {
            case this.NONE: {
                this.doNone();
                break;
            }
            case this.COP: {
                this.doCOP();
                break;
            }
            case this.BRK: {
                this.doBRK();
                break;
            }
            case this.ABT: {
                this.doABT();
                break;
            }
            case this.NMI: {
                this.doNMI();
                break;
            }
            case this.RST: {
                this.doRST();
                break;
            }
            case this.IRQ: {
                this.doIRQ();
                break;
            }
        }
    }

    public set(interrupt : Interrupt) : void {
        this.interrupt = interrupt;
    }

    private doNone() {

    }

    private doCOP() {

    }

    private doBRK() {

    }

    private doABT() {

    }

    private doNMI() {

    }

    private doRST() {

    }

    private doIRQ() {

    }
}
