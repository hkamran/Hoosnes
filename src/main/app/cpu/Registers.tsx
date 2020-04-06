import {Mode, Modes} from "../Modes";
import {Bit} from "../util/Bit";
import {DmaChannel, DmaEnableRegister} from "./Dma";
import {Objects} from "../util/Objects";
import {Console} from "../Console";
import {ScreenRegion} from "../ppu/Screen";
import {
    HdmaEnableRegister,
} from "./Hdma";

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
        if (this.mode == Modes.bit8 && this.val > 0xFF) throw new Error("value is to big for register");
        this.val = val;
    }

    public get(): number {
        return this.val;
    }

    public setUpper(val: number) {
        if (this.mode != Modes.bit16) throw new Error("Cannot set upper on 8 bit register");
        this.val = Bit.setUint16Upper(this.val, val);
    }

    public setLower(val: number) {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
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

    // Accumulator register transferSize
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
        this.val &= ~(1 << 0);
        this.val |= value << 0;
    }

    // Zero
    public setZ(value : number) : void {
        this.val &= ~(1 << 1);
        this.val |= value << 1;
    }

    // IRQ Disable
    public setI(value : number) : void {
        this.val &= ~(1 << 2);
        this.val |= value << 2;
    }

    // Decimal Mode
    public setD(value : number) : void {
        this.val &= ~(1 << 3);
        this.val |= value << 3;
    }

    // Break Flag
    public setX(value : number) : void {
        this.val &= ~(1 << 4);
        this.val |= value << 4;
    }

    //  Accumulator register transferSize (native mode only)
    // (0 = 16-bit, 1 = 8-bit)
    public setM(value : number) : void {
        this.val &= ~(1 << 5);
        this.val |= value << 5;
    }

    // Overflow
    public setV(value : number) : void {
        this.val &= ~(1 << 6);
        this.val |= value << 6;
    }

    // Negative
    public setN(value : number) : void {
        this.val &= ~(1 << 7);
        this.val |= value << 7;
    }

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

export class InterruptEnableFlagsRegister extends Register {

    public address: string = "4200";
    public name: string = "NMITIMEN";

    public isNMIEnabled(): boolean {
        return (this.val & 0x80) > 0;
    }

    public isHorizontalCounterEnabled() {
        return (this.val & 0x20) > 0;
    }

    public isVerticalCounterEnabled() {
        return (this.val & 0x10) > 0;
    }

    public isJoypadEnabled() {
        return (this.val & 0x1) > 0;
    }

}

export class NmiFlagRegister extends Register {

    public address: string = "4210";
    public name: string = "RDNMI";

    public setVBlankFlag(flag: boolean) {
        if (flag) {
            this.val |= 0x80;
        } else {
            this.val &= 0x7F;
        }
    }

}

export class WramMemoryAddressRegister extends Register {

    public address: string = "0x2181-0x2183";
    public name: string = "WMADD";

    public setLower(val: number) {
        this.val = Bit.setUint24Lower(this.val, val);
    }

    public setMiddle(val: number) {
        this.val = Bit.setUint24Middle(this.val, val);
    }

    public setUpper(val: number) {
        this.val = Bit.setUint24Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint24Lower(this.val);
    }

    public getMiddle(): number {
        return Bit.getUint24Middle(this.val);
    }

    public getUpper(): number {
        return Bit.getUint24Upper(this.val);
    }
}


export class HvBStatusRegister extends Register {

    private console: Console;

    constructor(console: Console) {
        super();
        this.console = console;
    }


    public address: string = "0x4212";
    public name: string = "HVBJOY";

    public val: number = 0x0;
//     Joypad automatic scanning flag
//
// - Bit 0 of $4212 is set at line $00E1 and cleared at line $00E4 in 224-line
//     mode.
//
// - Bit 0 of $4212 is set at line $00F0 and cleared at line $00F3 in 239-line
//     mode.
    public setVBlankFlag(val: boolean): void {
        if (val) {
            this.val = this.val | 0x80;
        } else {
            this.val = this.val & 0x7F;
        }
    }

    public setHBlankFlag(val: boolean): void {
        if (val) {
            this.val = this.val | 0x40;
        } else {
            this.val = this.val & 0xBF;
        }
    }

    public setJoypadFlag(val: boolean): void {
        if (val) {
            this.val = this.val | 0x1;
        } else {
            this.val = this.val & 0xFE;
        }
    }

    public get(): number {
        let result = super.get();

        let cycle = this.console.ppu.cycle;
        let scanline = this.console.ppu.scanline;

        if (cycle < ScreenRegion.HORT_BLANK.end || cycle > ScreenRegion.HORT_BLANK.start) {
            result |= 0x40;
        }

        if (scanline > ScreenRegion.VERT_BLANK.start) {
            result |= 0x80;
        }

        return result;
    }

}

export class Registers {

    public a : Register;
    public dbr : Register;
    public d : Register;
    public k : Register;
    public pc : Register;
    public p : StatusRegister;
    public sp : Register;
    public x : Register;
    public y : Register;

    // IO Registers

    public nmitimen : InterruptEnableFlagsRegister;
    public wrio : Register;
    public wrmpya : Register;
    public wrmpyb : Register;
    public wrdivl : Register;
    public wrdivh : Register;
    public wrdivb : Register;
    public htimel : Register;
    public htimeh : Register;
    public vtimel : Register;
    public vtimeh : Register;
    public memsel : Register;
    public rdnmi : NmiFlagRegister;
    public timeup : Register;
    public hvbjoy : HvBStatusRegister;
    public rdio : Register;
    public rddivl : Register;
    public rddivh : Register;
    public rdmpyl : Register;
    public rdmpyh : Register;
    public joy1l : Register;
    public joy1h : Register;
    public joy2l : Register;
    public joy2h : Register;
    public joy3l : Register;
    public joy3h : Register;
    public joy4l : Register;
    public joy4h : Register;

    public wmdata : Register;
    public wmadd : WramMemoryAddressRegister;

    public dma0: DmaChannel;
    public dma1: DmaChannel;
    public dma2: DmaChannel;
    public dma3: DmaChannel;
    public dma4: DmaChannel;
    public dma5: DmaChannel;
    public dma6: DmaChannel;
    public dma7: DmaChannel;
    public mdmaen: DmaEnableRegister;
    public hdmaen : HdmaEnableRegister;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.a = new AccumulatorRegister();
        this.dbr = new DataBankRegister();
        this.d = new DirectPageRegister();
        this.k = new ProgramBankRegister();
        this.pc = new ProgramCounterRegister();
        this.p = new StatusRegister();
        this.sp = new StackPointerRegister();
        this.x = new IndirectXRegister();
        this.y = new IndirectYRegister();

        // IO Registers

        this.nmitimen = new InterruptEnableFlagsRegister();
        this.wrio = new Register();
        this.wrmpya = new Register();
        this.wrmpyb = new Register();
        this.wrdivl = new Register();
        this.wrdivh = new Register();
        this.wrdivb = new Register();
        this.htimel = new Register();
        this.htimeh = new Register();
        this.vtimel = new Register();
        this.vtimeh = new Register();
        this.memsel = new Register();
        this.rdnmi = new NmiFlagRegister();
        this.timeup = new Register();
        this.hvbjoy = new HvBStatusRegister(console);
        this.rdio = new Register();
        this.rddivl = new Register();
        this.rddivh = new Register();
        this.rdmpyl = new Register();
        this.rdmpyh = new Register();
        this.joy1l = new Register();
        this.joy1h = new Register();
        this.joy2l = new Register();
        this.joy2h = new Register();
        this.joy3l = new Register();
        this.joy3h = new Register();
        this.joy4l = new Register();
        this.joy4h = new Register();

        this.wmdata = new Register();
        this.wmadd = new WramMemoryAddressRegister();

        this.dma0 = new DmaChannel(console, 0);
        this.dma1 = new DmaChannel(console, 1);
        this.dma2 = new DmaChannel(console, 2);
        this.dma3 = new DmaChannel(console, 3);
        this.dma4 = new DmaChannel(console, 4);
        this.dma5 = new DmaChannel(console, 5);
        this.dma6 = new DmaChannel(console, 6);
        this.dma7 = new DmaChannel(console, 7);

        this.mdmaen = new DmaEnableRegister(console, [
            this.dma0,
            this.dma1,
            this.dma2,
            this.dma3,
            this.dma4,
            this.dma5,
            this.dma6,
            this.dma7,
        ]);
        this.hdmaen = new HdmaEnableRegister(console);
    }

}
