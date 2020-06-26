
import {Bit} from "../../util/Bit";
import {DmaChannel, DmaEnableRegister} from "./Dma";
import {Objects} from "../../util/Objects";
import {Console} from "../Console";
import {ScreenRegion} from "../ppu/Screen";
import {
    HdmaEnableRegister,
} from "./Hdma";
import {joy1, joy2} from "../controller/Controller";
import {AbstractRegister} from "../../interfaces/AbstractRegister";

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

// NVMXDIZC
export class StatusRegister extends AbstractRegister {

    public readonly LABEL = "STATUS";
    public readonly WIDTH = 8;

    protected e : number = 0;

    // Emulation Mode
    public getE() : number {
        return this.e & 0x1;
    }

    // Carry
    public getC() : number {
        return (this.get() >> 0) & 0x1;
    }

    // Zero
    public getZ() : number {
        return (this.get() >> 1) & 0x1;
    }

    // IRQ Disable
    public getI() : number {
        return (this.get() >> 2) & 0x1;
    }

    // Decimal Mode
    public getD() : number {
        return (this.get() >> 3) & 0x1;
    }

    // Break Flag
    public getX() : number {
        return (this.get() >> 4) & 0x1;
    }

    // Accumulator register transferSize
    public getM() : number {
        return (this.get() >> 5) & 0x1;
    }

    // Overflow
    public getV() : number {
        return (this.get() >> 6) & 0x1;
    }

    // Negative
    public getN() : number {
        return (this.get() >> 7) & 0x1;
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
        let result = this.get();
        result &= ~(1 << 0);
        result |= value << 0;
        this.set(result);
    }

    // Zero
    public setZ(value : number) : void {
        let result = this.get();
        result &= ~(1 << 1);
        result |= value << 1;
        this.set(result);
    }

    // IRQ Disable
    public setI(value : number) : void {
        let result = this.get();
        result &= ~(1 << 2);
        result |= value << 2;
        this.set(result);
    }

    // Decimal Mode
    public setD(value : number) : void {
        let result = this.get();
        result &= ~(1 << 3);
        result |= value << 3;
        this.set(result);
    }

    // Break Flag
    public setX(value : number) : void {
        let result = this.get();
        result &= ~(1 << 4);
        result |= value << 4;
        this.set(result);
    }

    //  Accumulator register transferSize (native mode only)
    // (0 = 16-bit, 1 = 8-bit)
    public setM(value : number) : void {
        let result = this.get();
        result &= ~(1 << 5);
        result |= value << 5;
        this.set(result);
    }

    // Overflow
    public setV(value : number) : void {
        let result = this.get();
        result &= ~(1 << 6);
        result |= value << 6;
        this.set(result);
    }

    // Negative
    public setN(value : number) : void {
        let result = this.get();
        result &= ~(1 << 7);
        result |= value << 7;
        this.set(result);
    }

}

export class AccumulatorRegister extends AbstractRegister {

    public readonly LABEL = "ACCUMULATOR";

    public getA(): number {
        return this.get(0);
    }

    public setA(value: number): void {
        this.set(value, 0);
    }

    public getB(): number {
        return this.get(1);
    }

    public setB(value: number): void {
        this.set(value, 1);
    }

    public getC(): number {
        return this.get();
    }

    public setC(value: number): void {
        this.set(value);
    }
}

export class DataBankRegister extends AbstractRegister {

    public readonly LABEL = "DBR";

}

export class DirectPageRegister extends AbstractRegister {

    public readonly LABEL = "D";

    public getD(): number {
        return this.get();
    }

    public getDL(): number {
        return this.get(0);
    }

    public getDH(): number {
        return this.get(1);
    }

    public setD(value: number): void {
        this.set(value);
    }

    public setDL(value: number): void {
        this.setDL(value);
    }

    public setDH(value: number): void {
        this.setDH(value);
    }
}

export class ProgramBankRegister extends AbstractRegister {

    public readonly LABEL = "K";
}

export class ProgramCounterRegister extends AbstractRegister {

    public readonly LABEL = "PC";

}

export class StackPointerRegister extends AbstractRegister {

    public readonly LABEL = "SP";

    public setSL(value: number): void {
        this.set(value, 0);
    }

    public setSH(value: number): void {
        this.set(value, 1);
    }

    public getSL(): number {
        return this.get(0);
    }

    public getSH(): number {
        return this.get(1);
    }

}


export class IndirectYRegister extends AbstractRegister {

    public setYL(value: number): void {
        this.set(value, 0);
    }

    public setYH(value: number): void {
        this.set(value, 1);
    }

    public getYL(): number {
        return this.get(0);
    }

    public getYH(): number {
        return this.get(1);
    }
}

export class IndirectXRegister extends AbstractRegister {

    public setXL(value: number): void {
        this.set(value, 0);
    }

    public setXH(value: number): void {
        this.set(value, 1);
    }

    public getXL(): number {
        return this.get(0);
    }

    public getXH(): number {
        return this.get(1);
    }
}

export class Registers {

    public a : AccumulatorRegister;
    public dbr : DataBankRegister;
    public d : DirectPageRegister;
    public k : ProgramBankRegister;
    public pc : ProgramCounterRegister;
    public p : StatusRegister;
    public sp : StackPointerRegister;
    public x : IndirectXRegister;
    public y : IndirectYRegister;

    constructor(console: Console) {
        Objects.requireNonNull(console);

        this.a = new AccumulatorRegister(console);
        this.dbr = new DataBankRegister(console);
        this.d = new DirectPageRegister(console);
        this.k = new ProgramBankRegister(console);
        this.pc = new ProgramCounterRegister(console);
        this.p = new StatusRegister(console);
        this.sp = new StackPointerRegister(console);
        this.x = new IndirectXRegister(console);
        this.y = new IndirectYRegister(console);
    }

    public reset(): void {
        this.p.setE(0x1);

        this.p.set(0x0);
        this.p.setI(0x1);
        this.p.setZ(0x0);
        this.p.setX(0x1);
        this.p.setM(0x1);
        this.p.setD(0x0);

        this.a.set(0x0);
        this.x.set(0x0000);
        this.y.set(0x0000);
        this.sp.set(0x1FF);
        this.d.set(0x0000);
        this.dbr.set(0x00);
        this.k.set(0x00);

        this.pc.set(0x0000);
    }

}
