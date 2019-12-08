import {Mode, Modes} from "../Modes";

/**
 * +---------------------------+---------+-----------------------------------+-------------------+-------------------------------------------+
 * |                           | 24 Bit  |              16 Bit               |      8 Bit        |                 Use cases                 |
 * +---------------------------+---------+-----------------------------------+-------------------+-------------------------------------------+
 * | accumulator A             |         |                                   |                   |                                           |
 * |                           | A       | 8 Bit Accumulator                 |                   |                                           |
 * | accumulator B             |         |                                   |                   |                                           |
 * |                           | B       | 8 Bit Accumulator                 |                   |                                           |
 * | 16-Bit Accumulator  C     |         | B                                 | A                 | A+B combined to make a 16 bit accumulator |
 * | Processor flag register   |         |                                   |                   |                                           |
 * |                           | P       | Flags                             |                   |                                           |
 * | Indirect X                | DBR     | X                                 | Indirect Register |                                           |
 * | Indirect Y                | DBR     | Y                                 | Indirect Register |                                           |
 * | Hardware Stack  Pointer   | 00      | S                                 | Stack             |                                           |
 * | Program Counter           | PBR     | PC                                | Running Command   |                                           |
 * | Direct page Register      | 00      | D                                 |                   |                                           |
 * |                           | D+nn    | Zero page is relocatable on 65816 |                   |                                           |
 * | Databank Register         | DBR     |                                   |                   |                                           |
 * | Program Bank Register     | PBR     |                                   |                   |                                           |
 * +---------------------------+---------+-----------------------------------+-------------------+-------------------------------------------+
 */

/**
 * -------------
 * P Register
 * ------------
 *
 * +-------------------------------------+------------------------------+----------------------------------+
 * |     Flags: NVMXDIZC / -------E      | Name                         |Meaning                           |
 * +-------------------------------------+------------------------------+----------------------------------+
 * | N                                   | Negative                     | 1=Negative                       |
 * | V                                   | Overflow                     | 1=True                           |
 * | M                                   | Memory / Accumulator Select  | 1=8bit / 0=16bit for Accumulator |
 * | X                                   | XY index register select     | 1=8bit / 0=16bit for X/Y         |
 * | D                                   | Decimal mode                 | 1=True                           |
 * | I                                   | IRQ disable                  | 1=Disable                        |
 * | Z                                   | Zero                         | 1=Result Zero                    |
 * | C                                   | Carry                        | 1=Carry                          |
 * | E                                   | Emulator mode                |                                  |
 * | (accessed via carry flag with XCE)  | 0=native 16 bit              |                                  |
 * | 1=Emulated 8 bit                    |                              |                                  |
 * +-------------------------------------+------------------------------+----------------------------------+
 */


export class Register {

    protected val : number = 0;
    protected mode : Mode = Modes.bit8;

    constructor() {
    }

    public set(val : number): void {
        if (val == null || val < 0) {
            throw Error("Invalid set " + val + " to register.");
        }
        this.val = val;
    }

    public get(): number {
        return this.val;
    }

    public getLower(): number {
        return (this.val >> 0) & 0xFFFF;
    }

    public getUpper(): number {
        return (this.val >> 8) & 0xFFFF;
    }

}

// NVMXDIZC
export class StatusRegister extends Register {

    public address: string = "212D";
    public name: string = "TS";

    protected e : number = 0;

    constructor() {
        super();
        this.mode = Modes.bit8;
    }

    // Emulation Mode
    public getE() : number {
        return this.e & 0x1;
    }

    // Carry
    public getC() : number {
        return (this.val >> 0) & 0x1;
    }

    // Zero
    public getZ() : number {
        return (this.val >> 1) & 0x1;
    }

    // IRQ Disable
    public getI() : number {
        return (this.val >> 2) & 0x1;
    }

    // Decimal Mode
    public getD() : number {
        return (this.val >> 3) & 0x1;
    }

    // Break Flag
    public getX() : number {
        return (this.val >> 4) & 0x1;
    }

    // Accumulator register size
    public getM() : number {
        return (this.val >> 5) & 0x1;
    }

    // Overflow
    public getV() : number {
        return (this.val >> 6) & 0x1;
    }

    // Negative
    public getN() : number {
        return (this.val >> 7) & 0x1;
    }

    // Setting
    public setE(value: number): void {
        this.e = value & 0x1;
    }

    public setB(value: number): void {
        this.setX(value);
    }

    // Carry
    public setC(value : number) : void {
        this.val &= ~(value << 0);
        this.val |= value << 0;
    }

    // Zero
    public setZ(value : number) : void {
        this.val &= ~(value << 1);
        this.val |= value << 1;
    }

    // IRQ Disable
    public setI(value : number) : void {
        this.val &= ~(value << 2);
        this.val |= value << 2;
    }

    // Decimal Mode
    public setD(value : number) : void {
        this.val &= ~(value << 3);
        this.val |= value << 3;
    }

    // Break Flag
    public setX(value : number) : void {
        this.val &= ~(value << 4);
        this.val |= value << 4;
    }

    //  Accumulator register size (native mode only)
    // (0 = 16-bit, 1 = 8-bit)
    public setM(value : number) : void {
        this.val &= ~(value << 5);
        this.val |= value << 5;
    }

    // Overflow
    public setV(value : number) : void {
        this.val &= ~(value << 6);
        this.val |= value << 6;
    }

    // Negative
    public setN(value : number) : void {
        this.val &= ~(value << 7);
        this.val |= value << 7;
    }


}

export class InterruptEnableRegister extends Register {


}

export class AccumulatorRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }


}


export class DataBankRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }

}

export class DirectPageRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }

}

export class ProgramBankRegister extends Register {

    // PBR

    constructor() {
        super();
        this.mode = Modes.bit8;
    }

}

export class ProgramCounterRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }

}

export class StackPointerRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }

}


export class IndirectYRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }

}

export class IndirectXRegister extends Register {

    constructor() {
        super();
        this.mode = Modes.bit16;
    }

}

export class Registers {

    public a : Register = new AccumulatorRegister();
    public dbr : Register = new DataBankRegister();
    public d : Register = new DirectPageRegister();
    public k : Register = new ProgramBankRegister();
    public pc : Register = new ProgramCounterRegister();
    public p : StatusRegister = new StatusRegister();
    public sp : Register = new StackPointerRegister();
    public x : Register = new IndirectYRegister();
    public y : Register = new IndirectXRegister();

    // IO Registers

    public nmitimen : Register = new Register();
    public wrio : Register = new Register();
    public wrmpya : Register = new Register();
    public wrmpyb : Register = new Register();
    public wrdivl : Register = new Register();
    public wrdivh : Register = new Register();
    public wrdivb : Register = new Register();
    public htimel : Register = new Register();
    public htimeh : Register = new Register();
    public vtimel : Register = new Register();
    public vtimeh : Register = new Register();
    public mdmaen : Register = new Register();
    public hdmaen : Register = new Register();
    public memsel : Register = new Register();
    public rdnmi : Register = new Register();
    public timeup : Register = new Register();
    public hvbjoy : Register = new Register();
    public rdio : Register = new Register();
    public rddivl : Register = new Register();
    public rddivh : Register = new Register();
    public rdmpyl : Register = new Register();
    public rdmpyh : Register = new Register();
    public joy1l : Register = new Register();
    public joy1h : Register = new Register();
    public joy2l : Register = new Register();
    public joy2h : Register = new Register();
    public joy3l : Register = new Register();
    public joy3h : Register = new Register();
    public joy4l : Register = new Register();
    public joy4h : Register = new Register();

}
