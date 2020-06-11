import {OpContext} from "./Opcodes";
import {Bit} from "../../util/Bit";
import {Registers} from "./Registers";
import {Objects} from "../../util/Objects";

/**
 *  Fetches the address of the first data that will be used by the instruction.
 *
 *  https://wiki.superfamicom.org/65816-reference
 *  https://github.com/michielvoo/SNES/wiki/CPU
 *  http://6502.org/tutorials/65c816opcodes.html#5.7
 */
export interface IAddressingMode {
    label: string;
    getValue(context: OpContext): number;
    getAddressing(context: OpContext): Addressing;
}

export enum AddressingType {
    BYTE, WORD,
}

/**
 * Holds the addresses that leads to a byte or a word.
 */
export class Addressing {

    private static singleton: Addressing = new Addressing(0, 0, AddressingType.WORD);

    public type: AddressingType;

    private low: number = 0;
    private high: number = 0;

    constructor(low: number, high: number, type: AddressingType) {
        Objects.requireNonNull(low);
        Objects.requireNonNull(high);
        Objects.requireNonNull(type);

        this.low = low;
        this.high = high || 0;
        this.type = type;
    }

    public toLow(): number {
        return this.low;
    }

    public toHigh(): number {
        return this.high;
    }

    public getType(): AddressingType {
        return this.type;
    }

    public static toWord(low: number, high: number, cycles?: number) {
        this.singleton.low = low;
        this.singleton.high = high;
        this.singleton.type = AddressingType.WORD;

        return this.singleton;
    }

    public static toByte(low: number, cycles?: number) {
        this.singleton.low = low;
        this.singleton.high = low;
        this.singleton.type = AddressingType.BYTE;

        return this.singleton;
    }
}


// Note that although the 65C816 has a 24-bit address space,
// the Program Counter is only a 16-bit register and
// the Program Bank Register is a separate (8-bit) register.
// This means that instruction execution wraps at bank boundaries.
// This is true even if the bank boundary occurs in the middle of the instruction.


/**
 * Design: all addressing returns a pointer to a word.
 */
export class AbsoluteJump implements IAddressingMode {

    public label: string = "Absolute Jump";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let addr: number = result.toLow();
        let byte: number = context.bus.readByte(addr);

        return byte;
    }

    public getAddressing(context: OpContext): Addressing {
        let HH: number = context.registers.k.get();
        let MM: number = context.getOperand(1);
        let LL: number = context.getOperand(0);

        let data: number = Bit.toUint24(HH, MM, LL);
        return Addressing.toByte(data);
    }
}

export class Absolute implements IAddressingMode {

    public label: string = "ABSOLUTE";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let HH: number = context.getOperand(1);
        let rr: number = context.cpu.registers.dbr.get();

        let dataLow: number = (rr << 16) | Bit.toUint16(HH, LL);
        let dataHigh: number = dataLow + 1;

        return Addressing.toWord(dataLow, dataHigh);
    }
}

export class AbsoluteX implements IAddressingMode {

    public label: string = "ABSOLUTE, X";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let MM: number = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let address: number = Bit.toUint24(HH, MM, LL);
        let low: number = address + context.registers.x.get();
        let high: number = low + 1;

        return Addressing.toWord(low, high);
    }
}

export class AbsoluteY implements IAddressingMode {

    public label: string = "ABSOLUTE, Y";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let MM: number = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let address: number = Bit.toUint24(HH, MM, LL);
        let low: number = address + context.registers.y.get();
        let high: number = low + 1;

        return Addressing.toWord(low, high);
    }
}

export class AbsoluteLong implements IAddressingMode {

    public label: string = "(ABSOLUTE)";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let addr: number = result.toLow();
        let value: number = context.bus.readByte(addr);

        return value;
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.getOperand(0);
        let high: number = context.getOperand(1);

        let addr: number = Bit.toUint16(high, low);

        let laddr: number = addr + 0;
        let haddr: number = addr + 1;

        let LL: number = context.bus.readByte(laddr);
        let MM: number = context.bus.readByte(haddr);
        let HH: number = context.registers.k.get();

        let address: number = Bit.toUint24(HH, MM, LL);
        return Addressing.toByte(address);
    }
}

export class AbsoluteLongIndexed implements IAddressingMode {

    public label: string = "[ABSOLUTE]";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let addr: number = result.toLow();
        let value: number = context.bus.readByte(addr);

        return value;
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let HH: number = context.getOperand(1);

        let base: number = Bit.toUint16(HH, LL);

        let lowAddr: number = (base + 0) & 0xFFFF;
        let midAddr: number = (base + 1) & 0xFFFF;
        let highAddr: number = (base + 2) & 0xFFFF;

        let low: number = context.bus.readByte(lowAddr);
        let mid: number = context.bus.readByte(midAddr);
        let high: number = context.bus.readByte(highAddr);

        let value: number = Bit.toUint24(high, mid, low);
        return Addressing.toByte(value);
    }

}

export class AbsoluteIndirect implements IAddressingMode {

    public label: string = "(ABSOLUTE, X)";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let addr: number = result.toLow();
        let value: number = context.bus.readByte(addr);

        return value;
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.getOperand(0);
        let high: number = context.getOperand(1);
        let k: number = context.cpu.registers.k.get();
        let x: number = context.cpu.registers.x.get();

        let offset: number = Bit.toUint16(high, low) + x;
        let base: number = (k << 16) | offset;

        let laddr: number = base + 0;
        let haddr: number = base + 1;

        let LL: number = context.bus.readByte(laddr);
        let MM: number = context.bus.readByte(haddr);
        let HH: number = k;

        let address: number = Bit.toUint24(HH, MM, LL);

        return Addressing.toByte(address);
    }
}


export class Accumulator implements IAddressingMode {

    public label: string = "ACCUMULATOR";

    public getValue(context: OpContext): number {
        let low: number = context.registers.a.getA();
        let high: number = context.registers.a.getB();

        return Bit.toUint16(high, low);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.registers.a.getA();
        let high: number = context.registers.a.getB();

        return Addressing.toWord(low, high, 0);
    }
}

export class Direct implements IAddressingMode {

    public label: string = "DIRECT";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.getOperand(0);

        if (context.op.name == "PEI" &&
            context.registers.p.getE() == 1 &&
            context.registers.d.getDL() == 0x00) {
            let loAddr: number = low;
            let hiAddr: number = context.registers.d.getDH();

            let result: number = Bit.toUint16(hiAddr, loAddr);

            return Addressing.toByte(result);
        } else {
            let loAddr: number = context.registers.d.get() + low;
            let hiAddr: number = loAddr + 1;

            return Addressing.toWord(loAddr, hiAddr);
        }
    }
}

export class DirectX implements IAddressingMode {

    public label: string = "DIRECT,X";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loByte: number = context.bus.readByte(result.toLow());
        let hiByte: number = result.getType() == AddressingType.WORD ?
            context.bus.readByte(result.toHigh()) : 0;

        let value: number = Bit.toUint16(hiByte, loByte);

        return value;
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let d = context.registers.d.get();
        let x = context.registers.x.get();

        if (context.registers.p.getE() == 1 && context.registers.d.getDL() == 0x00) {
            let loaddr: number = (LL + x) & 0xFF;
            let hiaddr: number = context.registers.d.getDH();

            let addr = Bit.toUint16(hiaddr, loaddr);

            return Addressing.toWord(addr, 0);
        } else {
            let loaddr: number = (d + LL + x) & 0xFFFF;
            let hiaddr: number = (loaddr + 1) & 0xFFFF;

            return Addressing.toWord(loaddr, hiaddr);
        }
    }
}

export class DirectY implements IAddressingMode {

    public label: string = "DIRECT,Y";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loaddr: number = result.toLow();
        let hiaddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = result.getType() == AddressingType.BYTE ?
            0 : context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return value;
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let y = context.registers.y.get();
        let d = context.registers.d.get();

        if (context.registers.p.getE() == 1 && context.registers.d.getDL() == 0x00) {
            let loaddr: number = (LL + y) & 0xFF;
            let hiaddr: number = context.registers.d.getDH();

            let addr = Bit.toUint16(hiaddr, loaddr);
            return Addressing.toByte(addr, 0);
        } else {
            let loaddr: number = (d + LL + y) & 0xFFFF;
            let hiaddr: number = (loaddr + 1) & 0xFFFF;

            return Addressing.toWord(loaddr, hiaddr, 0);
        }
    }
}

export class DirectIndirect implements IAddressingMode {

    public label: string = "(DIRECT)";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let registers: Registers = context.registers;
        let LL: number = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = 0;

        if (registers.p.getE() == 1 && registers.d.getDL() == 0x00) {
            let dh: number = registers.d.getDH();

            loPointer = Bit.toUint16(dh, (LL + 0) & 0xFF);
            hiPointer = Bit.toUint16(dh, (LL + 1) & 0xFF);

            let ll: number = context.bus.readByte(loPointer);
            let hh: number = context.bus.readByte(hiPointer);
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh, ll);
            let hiaddr = (loaddr + 1) % 0xFFFFFF;

            return Addressing.toWord(loaddr, hiaddr, cycles);
        } else {
            let d: number = registers.d.get();

            loPointer = d + LL;
            hiPointer = loPointer + 1;

            let ll: number = context.bus.readByte(loPointer);
            let hh: number = context.bus.readByte(hiPointer);
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh, ll);
            let hiaddr = (loaddr + 1) % 0xFFFFFF;

            return Addressing.toWord(loaddr, hiaddr, cycles);
        }
    }
}

export class DirectIndirectIndexed implements IAddressingMode {

    public label: string = "(DIRECT,X)";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loaddr: number = result.toLow();
        let hiaddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return value;
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);

        if (context.registers.p.getE() == 1 && context.registers.d.getDL() == 0x00) {
            let dh: number = context.registers.d.getDH();
            let x: number = context.registers.x.get();

            let loPointer: number = Bit.toUint16(dh, (LL + x + 0) % 0xFF);
            let hiPointer: number = Bit.toUint16(dh, (LL + x + 1) % 0xFF);

            let ll: number = context.bus.readByte(loPointer);
            let hh: number = context.bus.readByte(hiPointer);
            let rr: number = 0;

            let addr: number = Bit.toUint24(rr, hh, ll);
            let loaddr: number = addr;
            let hiaddr: number = (addr + 1) % 0xFFFFFF;

            return Addressing.toWord(loaddr, hiaddr);
        } else {
            let d: number = context.registers.d.get();
            let x: number = context.registers.x.get();

            let loPointer: number = (d + LL + x + 0) % 0xFFFF;
            let hiPointer: number = (d + LL + x + 1) % 0xFFFF;

            let ll: number = context.bus.readByte(loPointer);
            let hh: number = context.bus.readByte(hiPointer);
            let rr: number = context.registers.dbr.get();

            let addr: number = Bit.toUint24(rr, hh, ll);
            let loaddr: number = addr;
            let hiaddr: number = (addr + 1) % 0xFFFFFF;

            return Addressing.toWord(loaddr, hiaddr);
        }
    }
}

export class DirectIndirectLong implements IAddressingMode {

    public label: string = "(DIRECT),Y";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;

        if (context.registers.p.getE() == 1 && context.registers.d.getDL() == 0x00) {
            let dh: number = context.registers.d.getDH();

            let lo: number = (LL + 0) & 0xFF;
            let hi: number = (LL + 1) & 0xFF;

            loPointer = Bit.toUint24(0, dh, lo);
            hiPointer = Bit.toUint24(0, dh, hi);
        } else {
            let d: number = context.registers.d.getDH();

            let lo: number = d + LL;
            let hi: number = d + LL + 1;

            loPointer = lo;
            hiPointer = hi;
        }

        let ll: number = context.bus.readByte(loPointer);
        let hh: number = context.bus.readByte(hiPointer);
        let rr: number = context.registers.dbr.get();

        let y: number = context.registers.y.get();

        let addr: number = Bit.toUint24(rr, hh, ll);
        let loaddr: number = addr + y;
        let hiaddr: number = addr + y + 1;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class DirectIndexedIndirect implements IAddressingMode {

    public label: string = "[DIRECT]";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loaddr: number = result.toLow();
        let hiaddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let d: number = context.registers.d.get();

        let loPointer: number = (d + LL + 0) & 0xFFFF;
        let miPointer: number = (d + LL + 1) & 0xFFFF;
        let hiPointer: number = (d + LL + 2) & 0xFFFF;

        let ll: number = context.bus.readByte(loPointer);
        let mm: number = context.bus.readByte(miPointer);
        let hh: number = context.bus.readByte(hiPointer);

        let loaddr: number = Bit.toUint24(hh, mm, ll);
        let hiaddr: number = (loaddr + 1) % 0xFFFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class DirectIndirectIndexedLong implements IAddressingMode {

    public label: string = "[DIRECT],Y";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let y: number = context.registers.y.get();
        let d: number = context.registers.d.get();

        let base: number = (d + LL) & 0xFFFF;

        let loPointer: number = context.bus.readByte(base + 0);
        let midPointer: number = context.bus.readByte(base + 1);
        let hiPointer: number = context.bus.readByte(base + 2);

        let addr: number = Bit.toUint24(hiPointer, midPointer, loPointer);

        let loaddr: number = (addr + y + 0) % 0xFFFFFF;
        let hiaddr: number = (addr + y + 1) % 0xFFFFFF;

        return Addressing.toWord(loaddr, hiaddr, 0);
    }
}

export class ImmediateX implements IAddressingMode {

    public label: string = "IMMEDIATE X";
    public immediate8: Immediate8 = new Immediate8();
    public immediate16: Immediate16 = new Immediate16();

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);
        if (result.getType() == AddressingType.BYTE) {
            return this.immediate8.getValue(context);
        } else {
            return this.immediate16.getValue(context);
        }
    }

    public getAddressing(context: OpContext): Addressing {
        if (context.registers.p.getX() == 1) {
            return this.immediate8.getAddressing(context);
        } else {
            return this.immediate16.getAddressing(context);
        }
    }
}

export class ImmediateM implements IAddressingMode {

    public label: string = "IMMEDIATE M";
    public immediate8: Immediate8 = new Immediate8();
    public immediate16: Immediate16 = new Immediate16();

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);
        if (result.getType() == AddressingType.BYTE) {
            return this.immediate8.getValue(context);
        } else {
            return this.immediate16.getValue(context);
        }
    }

    public getAddressing(context: OpContext): Addressing {
        if (context.registers.p.getM() == 1) {
            return this.immediate8.getAddressing(context);
        } else {
            return this.immediate16.getAddressing(context);
        }
    }
}

export class Immediate8 implements IAddressingMode {

    public label: string = "IMMEDIATE 8";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let loByte: number = context.bus.readByte(loAddr);

        return loByte;
    }

    public getAddressing(context: OpContext): Addressing {
        let addr: number = context.getOperandAddress(0);
        return Addressing.toByte(addr, 0);
    }
}

export class Immediate16 implements IAddressingMode {

    public label: string = "IMMEDIATE 16";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let loaddr: number = context.getOperandAddress(0);
        let hiaddr: number = context.getOperandAddress(1);
        return Addressing.toWord(loaddr, hiaddr, 0);
    }
}

export class Implied implements IAddressingMode {

    public label: string = "IMPLIED";

    public getValue(context: OpContext): number {
        let opaddr: number = context.opaddr;
        return opaddr;
    }

    public getAddressing(context: OpContext): Addressing {
        let opaddr: number = context.opaddr;
        return Addressing.toByte(opaddr, 0);
    }
}

export class Long implements IAddressingMode {

    public label: string = "LONG";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let MM: number = context.getOperand(1);
        let HH: number = context.getOperand(2);

        let addr: number = Bit.toUint24(HH, MM, LL);

        let loaddr: number = addr;
        let hiaddr: number = (addr + 1) & 0xFFFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class LongX implements IAddressingMode {

    public label: string = "LONG,X";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let MM: number = context.getOperand(1);
        let HH: number = context.getOperand(2);

        let addr: number = Bit.toUint24(HH, MM, LL);

        let loaddr: number = (addr + context.registers.x.get() + 0) & 0xFFFFFF;
        let hiaddr: number = (addr + context.registers.x.get() + 1) & 0xFFFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class Relative8 implements IAddressingMode {

    public label: string = "RELATIVE 8";

    public getValue(context: OpContext): number {
        throw new Error("Not supported");
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let pc: number = context.registers.pc.get();

        if (0x00 <= LL && LL <= 0x7F) {
            return Addressing.toByte((pc + LL) & 0xFFFF, 0);
        } else {
            return Addressing.toByte((pc + LL - 0x100) & 0xFFFF, 0);
        }
    }
}

export class Relative16 implements IAddressingMode {

    public label: string = "RELATIVE 16";

    public getValue(context: OpContext): number {
        throw new Error("Not implemented!");
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let HH: number = context.getOperand(1);
        let pc: number = context.cpu.registers.pc.get();

        let base: number = (pc + Bit.toUint16(HH, LL)) & 0xFFFF;

        return Addressing.toByte(base, 0);
    }
}

export class SourceDestination implements IAddressingMode {

    public label: string = "SOURCE,DESTINATION";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loaddr: number = result.toLow();
        let hiaddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let sBank: number = context.getOperand(1);
        let dBank: number = context.getOperand(0);

        let sPage: number;
        let dPage: number;
        if (context.registers.p.getX() == 1) {
            sPage = context.registers.x.getXL();
            dPage = context.registers.y.getYL();
        } else {
            sPage = context.registers.x.get();
            dPage = context.registers.y.get();
        }

        let sAddr: number = Bit.toUint24(sBank, 0, sPage);
        let dAddr: number = Bit.toUint24(dBank, 0, dPage);

        return Addressing.toWord(sAddr, dAddr);
    }
}

export class Stack implements IAddressingMode {

    public label: string = "STACK,S";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let s: number = context.registers.sp.get();

        let loaddr: number = (LL + s + 0) & 0xFFFF;
        let hiaddr: number = (LL + s + 1) & 0xFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class StackY implements IAddressingMode {

    public label: string = "(STACK,S),Y";

    public getValue(context: OpContext): number {
        let result: Addressing = this.getAddressing(context);

        let loAddr: number = result.toLow();
        let hiAddr: number = result.toHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Bit.toUint16(hiByte, loByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let s: number = context.registers.sp.get();

        let loPointer: number = (LL + s + 0) & 0xFFFF;
        let hiPointer: number = (LL + s + 1) & 0xFFFF;

        let ll: number = context.bus.readByte(loPointer);
        let hh: number = context.bus.readByte(hiPointer);
        let rr: number = context.registers.dbr.get();

        let addr: number = Bit.toUint24(rr, hh, ll);
        let loaddr: number = (addr + context.registers.y.get() + 0) & 0xFFFFFF;
        let hiaddr: number = (addr + context.registers.y.get() + 1) & 0xFFFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

//
// Name           Native   Nocash
// Implied        -        A,X,Y,S,P
// Immediate      #nn      nn
// Zero Page      nn       [nn]
// Zero Page,X    nn,X     [nn+X]
// Zero Page,Y    nn,Y     [nn+Y]
// Absolute       nnnn     [nnnn]
// Absolute,X     nnnn,X   [nnnn+X]
// Absolute,Y     nnnn,Y   [nnnn+Y]
// (Indirect,X)   (nn,X)   [[nn+X]]
// (Indirect),Y   (nn),Y   [[nn]+Y]

export class AddressingModes {
    public static accumulator: IAddressingMode = new Accumulator();

    public static absoluteJump: IAddressingMode = new AbsoluteJump();
    public static absolute: IAddressingMode = new Absolute();
    public static absoluteX: IAddressingMode = new AbsoluteX();
    public static absoluteY: IAddressingMode = new AbsoluteY();
    public static absoluteLong: IAddressingMode = new AbsoluteLong();
    public static absoluteIndirect: IAddressingMode = new AbsoluteIndirect();
    public static absoluteLongIndexed: IAddressingMode = new AbsoluteLongIndexed();

    public static direct: IAddressingMode = new Direct();
    public static directX: IAddressingMode = new DirectX();
    public static directY: IAddressingMode = new DirectY();
    public static directIndexedIndirect: IAddressingMode = new DirectIndexedIndirect();
    public static directIndirect: IAddressingMode = new DirectIndirect();
    public static directIndirectIndexed: IAddressingMode = new DirectIndirectIndexed();
    public static directIndirectIndexedLong: IAddressingMode = new DirectIndirectIndexedLong();
    public static directIndirectLong: IAddressingMode = new DirectIndirectLong();


    public static immediateX: IAddressingMode = new ImmediateX();
    public static immediateM: IAddressingMode = new ImmediateM();
    public static immediate8: IAddressingMode = new Immediate8();
    public static immediate16: IAddressingMode = new Immediate16();

    public static implied: IAddressingMode = new Implied();

    public static long: IAddressingMode = new Long();
    public static longX: IAddressingMode = new LongX();

    public static relative8: IAddressingMode = new Relative8();
    public static relative16: IAddressingMode = new Relative16();

    public static sourceDestination: IAddressingMode = new SourceDestination();

    public static stack: IAddressingMode = new Stack();
    public static stackY: IAddressingMode = new StackY();

}
