import {OpContext} from "./Opcodes";
import {Read} from "../bus/Read";
import {Address} from "../bus/Address";
import {Bit} from "../util/Bit";
import {Registers} from "./Registers";
import {Objects} from "../util/Objects";

/**
 *  Fetches the address of the first data that will be used by the instruction.
 *
 *  https://wiki.superfamicom.org/65816-reference
 *  https://github.com/michielvoo/SNES/wiki/CPU
 *  http://6502.org/tutorials/65c816opcodes.html#5.7
 */
export interface IAddressingMode {
    label: string;
    getValue(context: OpContext): Read;
    getAddressing(context: OpContext): Addressing;
}

export enum AddressingType {
    BYTE, WORD,
}

/**
 * Holds the addresses that leads to a byte or a word.
 */
export class Addressing {

    public type: AddressingType;

    private readonly low: Address;
    private readonly high: Address;
    private readonly cycles: number;

    constructor(low: Address, high: Address, type: AddressingType, cycles?: number) {
        Objects.requireNonNull(low);
        Objects.requireNonNull(high);
        Objects.requireNonNull(type);

        this.low = low;
        this.high = high;
        this.cycles = cycles || 0;
        this.type = type;
    }

    public getLow(): Address {
        return this.low;
    }

    public getHigh(): Address {
        return this.high;
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getType(): AddressingType {
        return this.type;
    }

    public static toWord(low: number, high: number, cycles?: number) {
        let lowAddr: Address = Address.create(low);
        let highAddr: Address = Address.create(high);
        return new Addressing(lowAddr, highAddr, AddressingType.WORD, cycles);
    }

    public static toByte(low: number, cycles?: number) {
        let lowAddr: Address = Address.create(low);
        return new Addressing(lowAddr, lowAddr, AddressingType.BYTE, cycles);
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getLow();
        let byte: number = context.bus.readByte(addr);

        return Read.byte(byte, 0);
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLow();
        let hiAddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Read.word(loByte, hiByte);
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLow();
        let hiAddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Read.word(loByte, hiByte);
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLow();
        let hiAddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loAddr);
        let hiByte: number = context.bus.readByte(hiAddr);

        return Read.word(loByte, hiByte);
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

    public label: string = "( ABSOLUTE )";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getLow();
        let value: number = context.bus.readByte(addr);

        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.getOperand(0);
        let high: number = context.getOperand(1);

        let addr: number = Bit.toUint16(high, low);

        let laddr: Address = Address.create(addr);
        let haddr: Address = Address.create(addr + 1);

        let LL: number = context.bus.readByte(laddr);
        let MM: number = context.bus.readByte(haddr);
        let HH: number = context.registers.k.get();

        let address: number = Bit.toUint24(HH, MM, LL);
        return Addressing.toByte(address);
    }
}

export class AbsoluteLongIndexed implements IAddressingMode {

    public label: string = "[ABSOLUTE]";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getLow();
        let value: number = context.bus.readByte(addr);

        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let HH: number = context.getOperand(1);

        let base: number = Bit.toUint16(LL, HH);

        let lowAddr: number = base + 0;
        let midAddr: number = base + 1;
        let highAddr: number = base + 2;

        let low: number = context.bus.readByte(Address.create(lowAddr));
        let mid: number = context.bus.readByte(Address.create(midAddr));
        let high: number = context.bus.readByte(Address.create(highAddr));

        let value: number = Bit.toUint24(high, mid, low);
        return Addressing.toByte(value);
    }

}

export class AbsoluteIndirect implements IAddressingMode {

    public label: string = "(ABSOLUTE, X)";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getLow();
        let value: number = context.bus.readByte(addr);

        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.getOperand(0);
        let high: number = context.getOperand(1);
        let k: number = context.cpu.registers.dbr.get();
        let x: number = context.cpu.registers.x.get();

        let offset: number = Bit.toUint16(high, low) + x;
        let base: number = (k << 16) | offset;

        let laddr: Address = Address.create(base);
        let haddr: Address = Address.create(base + 1);

        let LL: number = context.bus.readByte(laddr);
        let MM: number = context.bus.readByte(haddr);
        let HH: number = context.registers.k.get();

        let address: number = Bit.toUint24(HH, MM, LL);

        return Addressing.toByte(address);
    }
}


export class Accumulator implements IAddressingMode {

    public label: string = "ACCUMULATOR";

    public getValue(context: OpContext): Read {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return Read.word(low, high, 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return Addressing.toWord(low, high, 0);
    }
}

export class Direct implements IAddressingMode {

    public label: string = "DIRECT";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loByte: number = context.bus.readByte(result.getLow());
        let hiByte: number = context.bus.readByte(result.getHigh());

        return Read.word(loByte, hiByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.getOperand(0);

        if (context.op.name == "PEI" &&
            context.registers.p.getE() == 1 &&
            context.registers.d.getLower() == 0x00) {
            let loAddr: number = low;
            let hiAddr: number = context.registers.d.getUpper();

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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loByte: number = context.bus.readByte(result.getLow());
        let hiByte: number = result.getType() == AddressingType.WORD ?
            context.bus.readByte(result.getHigh()) : 0;

        let value: number = Bit.toUint16(hiByte, loByte);

        return Read.word(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let d = context.registers.d.get();
        let x = context.registers.x.get();

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let loaddr: number = (LL + x) & 0xFF;
            let hiaddr: number = context.registers.d.getUpper();

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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = result.getType() == AddressingType.BYTE ?
            0 : context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let y = context.registers.y.get();
        let d = context.registers.d.get();

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let loaddr: number = (LL + y) & 0xFF;
            let hiaddr: number = context.registers.d.getUpper();

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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        return Read.word(loByte, hiByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let registers: Registers = context.registers;
        let LL: number = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = 0;

        if (registers.p.getE() == 1 && registers.d.getLower() == 0x00) {
            let dh: number = registers.d.getUpper();

            loPointer = Bit.toUint16(dh, (LL + 0) & 0xFF);
            hiPointer = Bit.toUint16(dh, (LL + 1) & 0xFF);

            let ll: number = context.bus.readByte(Address.create(loPointer));
            let hh: number = context.bus.readByte(Address.create(hiPointer));
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh, ll);
            let hiaddr = (loaddr + 1) % 0xFFFFFF;

            return Addressing.toWord(loaddr, hiaddr, cycles);
        } else {
            let d: number = registers.d.get();

            loPointer = d + LL;
            hiPointer = loPointer + 1;

            let ll: number = context.bus.readByte(Address.create(loPointer));
            let hh: number = context.bus.readByte(Address.create(hiPointer));
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh, ll);
            let hiaddr = (loaddr + 1) % 0xFFFFFF;

            return Addressing.toWord(loaddr, hiaddr, cycles);
        }
    }
}

export class DirectIndirectIndexed implements IAddressingMode {

    public label: string = "(DIRECT,X)";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.word(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = (LL + x + 0) & 0xFF;
            let hiPointer: number = (LL + x + 1) & 0xFF;

            return Addressing.toWord(
                Bit.toUint24(0, dh, loPointer),
                Bit.toUint24(0, dh, hiPointer));
        } else {
            let d: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = (d + LL + x + 0) % 0xFFFFFF;
            let hiPointer: number = (d + LL + x + 1) % 0xFFFFFF;

            return Addressing.toWord(loPointer, hiPointer);
        }
    }
}

export class DirectIndirectLong implements IAddressingMode {

    public label: string = "(DIRECT),Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();

            let lo: number = (LL + 0) & 0xFF;
            let hi: number = (LL + 1) & 0xFF;

            loPointer = Bit.toUint24(0, dh, lo);
            hiPointer = Bit.toUint24(0, dh, hi);
        } else {
            let d: number = context.registers.d.getUpper();

            let lo: number = d + LL;
            let hi: number = d + LL + 1;

            loPointer = lo;
            hiPointer = hi;
        }

        let ll: number = context.bus.readByte(Address.create(loPointer));
        let hh: number = context.bus.readByte(Address.create(hiPointer));
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.word(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let d: number = context.registers.d.get();

        let loPointer: number = (d + LL + 0) & 0xFFFF;
        let miPointer: number = (d + LL + 1) & 0xFFFF;
        let hiPointer: number = (d + LL + 2) & 0xFFFF;

        let ll: number = context.bus.readByte(Address.create(loPointer));
        let mm: number = context.bus.readByte(Address.create(miPointer));
        let hh: number = context.bus.readByte(Address.create(hiPointer));

        let loaddr: number = Bit.toUint24(hh, mm, ll);
        let hiaddr: number = (loaddr + 1) % 0xFFFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class DirectIndirectIndexedLong implements IAddressingMode {

    public label: string = "[DIRECT],Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let y: number = context.registers.y.get();
        let d: number = context.registers.d.get();

        let base: number = (d + LL) & 0xFFFF;

        let loPointer: number = context.bus.readByte(Address.create(base + 0));
        let midPointer: number = context.bus.readByte(Address.create(base + 1));
        let hiPointer: number = context.bus.readByte(Address.create(base + 2));

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

    public getValue(context: OpContext): Read {
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

    public getValue(context: OpContext): Read {
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loaddr: Address = result.getLow();
        let lodata: number = context.bus.readByte(loaddr);

        return Read.byte(lodata);
    }

    public getAddressing(context: OpContext): Addressing {
        let addr: Address = context.getOperandAddress(0);
        return Addressing.toByte(addr.toValue(), 0);
    }
}

export class Immediate16 implements IAddressingMode {

    public label: string = "IMMEDIATE 16";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        return Read.word(loByte, hiByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let loaddr: Address = context.getOperandAddress(0);
        let hiaddr: Address = context.getOperandAddress(1);
        return Addressing.toWord(loaddr.toValue(), hiaddr.toValue(), 0);
    }
}

export class Implied implements IAddressingMode {

    public label: string = "IMPLIED";

    public getValue(context: OpContext): Read {
        let opaddr: number = context.opaddr.toValue();
        return Read.byte(opaddr, 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let opaddr: number = context.opaddr.toValue();
        return Addressing.toByte(opaddr, 0);
    }
}

export class Long implements IAddressingMode {

    public label: string = "LONG";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.word(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let MM: number = context.getOperand(1);
        let HH: number = context.getOperand(2);

        let addr: number = Bit.toUint24(HH, MM, LL);

        let loaddr: number = addr;
        let hiaddr: number = addr + 1;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class LongX implements IAddressingMode {

    public label: string = "LONG,X";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        return Read.word(loByte, hiByte);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let MM: number = context.getOperand(1);
        let HH: number = context.getOperand(2);

        let addr: number = Bit.toUint24(HH, MM, LL);

        let loaddr: number = addr + context.registers.x.get();
        let hiaddr: number = addr + context.registers.x.get() + 1;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class Relative8 implements IAddressingMode {

    public label: string = "RELATIVE 8";

    public getValue(context: OpContext): Read {
        throw new Error("Not supported");
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);
        let pc: number = context.registers.pc.get();

        if (0x00 <= LL && LL <= 0x7F) {
            return Addressing.toByte((pc + LL) & 0xFFFF, 0);
        } else {

            return Addressing.toByte((pc - 0x100 + LL) & 0xFFFF, 0);
        }
    }
}

export class Relative16 implements IAddressingMode {

    public label: string = "RELATIVE 16";

    public getValue(context: OpContext): Read {
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let sBank: number = context.getOperand(1);
        let dBank: number = context.getOperand(0);

        let sPage: number;
        let dPage: number;
        if (context.registers.p.getX() == 1) {
            sPage = context.registers.x.getLower();
            dPage = context.registers.y.getLower();
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

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.word(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);

        let loaddr: number = (LL + context.registers.sp.get() + 0) & 0xFFFF;
        let hiaddr: number = (LL + context.registers.sp.get() + 1) & 0xFFFF;

        return Addressing.toWord(loaddr, hiaddr);
    }
}

export class StackY implements IAddressingMode {

    public label: string = "(STACK,S),Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLow();
        let hiaddr: Address = result.getHigh();

        let loByte: number = context.bus.readByte(loaddr);
        let hiByte: number = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte, loByte);
        return Read.byte(value);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: number = context.getOperand(0);

        let loPointer: number = (LL + context.registers.sp.get() + 0) & 0xFFFF;
        let hiPointer: number = (LL + context.registers.sp.get() + 1) & 0xFFFF;

        let ll: number = context.bus.readByte(Address.create(loPointer));
        let hh: number = context.bus.readByte(Address.create(hiPointer));
        let rr: number = context.registers.dbr.get();

        let addr: number = Bit.toUint24(rr, hh, ll);
        let loaddr: number = addr + context.registers.y.get();
        let hiaddr: number = addr + context.registers.y.get() + 1;

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
