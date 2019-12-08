import {Operation, OpContext} from "./Opcodes";
import {Read} from "../bus/Read";
import {Address} from "../bus/Address";
import {Bit} from "../util/Bit";
import {Register, Registers} from "./Registers";
import {Objects} from "../util/Objects";

/**
 *  Fetches the address of the first data that will be used by the instruction.
 *
 *  https://wiki.superfamicom.org/65816-reference
 *  https://github.com/michielvoo/SNES/wiki/CPU
 *  http://6502.org/tutorials/65c816opcodes.html#5.7
 */
export interface IAddressingMode  {
    getValue(context: OpContext) : Read;
    getAddressing(context: OpContext) : Addressing;
}

export enum AddressingType {
    BYTE, WORD,
}

export class Addressing {

    public type: AddressingType;

    private readonly low: number;
    private readonly high: number;
    private readonly cycles: number;

    constructor(low: number, high: number, type: AddressingType, cycles?: number) {
        Objects.requireNonNull(low);
        Objects.requireNonNull(type);

        this.low = low;
        this.high = high || 0;
        this.cycles = cycles || 0;
        this.type = type;
    }

    public getAddr(): Address {
        return Address.create(this.low);
    }

    public getLowAddr(): Address {
        return Address.create(this.low);
    }

    public getHighAddr(): Address {
        if (this.type != AddressingType.WORD) {
            throw new Error("Invalid Addressing access");
        }
        return Address.create(this.high);
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getType(): AddressingType {
        return this.type;
    }

    public static createWord(low: number, high: number, cycles? : number) {
        return new Addressing(low, high, AddressingType.WORD, cycles);
    }

    public static createByte(low: number, cycles? : number) {
        return new Addressing(low, null, AddressingType.BYTE, cycles);
    }
}


// Note that although the 65C816 has a 24-bit address space,
// the Program Counter is only a 16-bit register and
// the Program Bank Register is a separate (8-bit) register.
// This means that instruction execution wraps at bank boundaries.
// This is true even if the bank boundary occurs in the middle of the instruction.

export class AbsoluteJump implements IAddressingMode {

    public label: string = "Absolute Jump";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getAddr();
        let loByte: Read = context.bus.readByte(loAddr);

        let cycles: number = result.getCycles() + loByte.getCycles();

        return Read.byte(loByte.get(), cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let HH: number = context.registers.k.get();
        let MM: Read = context.getOperand(0);
        let LL: Read = context.getOperand(1);

        let data: number = Bit.toUint24(HH, MM.get(), LL.get());
        let cycles: number = MM.getCycles() + LL.getCycles();

        return Addressing.createByte(data, cycles);
    }
}

export class Absolute implements IAddressingMode {

    public label: string = "Absolute";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLowAddr();
        let hiAddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loAddr);
        let hiByte: Read = context.bus.readByte(hiAddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let MM: Read = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let dataLow: number = Bit.toUint24(HH, MM.get(), LL.get());
        let dataHigh: number = dataLow + 1;

        return Addressing.createWord(dataLow, dataHigh, cycles);
    }
}

export class AbsoluteX implements IAddressingMode {

    public label: string = "Absolute X";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLowAddr();
        let hiAddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loAddr);
        let hiByte: Read = context.bus.readByte(hiAddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let MM: Read = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let address: number = Bit.toUint24(HH, MM.get(), LL.get());
        let low: number = address + context.registers.x.get();
        let high: number = low + 1;

        return Addressing.createWord(low, high, cycles);
    }
}

export class AbsoluteY implements IAddressingMode {

    public label: string = "Absolute Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLowAddr();
        let hiAddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loAddr);
        let hiByte: Read = context.bus.readByte(hiAddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let MM: Read = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let address: number = Bit.toUint24(HH, MM.get(), LL.get());
        let low: number = address + context.registers.y.get();
        let high: number = low + 1;

        return Addressing.createWord(low, high, cycles);
    }
}

export class AbsoluteLong implements IAddressingMode {

    public label: string = "(Absolute)";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getAddr();
        let value: Read = context.bus.readByte(addr);

        let cycles: number = result.getCycles();

        return Read.byte(value.get(), cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: Read = context.getOperand(0);
        let high: Read = context.getOperand(1);

        let laddr: Address = Address.create(Bit.toUint16(high.get(), low.get()));
        let haddr: Address = Address.create(Bit.toUint16(high.get(), low.get()));

        let LL: Read = context.bus.readByte(laddr);
        let MM: Read = context.bus.readByte(haddr);
        let HH: number = context.registers.k.get();

        let cycles: number = LL.getCycles() + MM.getCycles();
        let address: number = Bit.toUint24(HH, MM.get(), LL.get());

        return Addressing.createByte(address, cycles);
    }
}

export class AbsoluteLongIndexed implements IAddressingMode {

    public label: string = "[absolute]";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getAddr();
        let value: Read = context.bus.readByte(addr);

        let cycles: number = result.getCycles();

        return Read.byte(value.get(), cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let HH: Read = context.getOperand(1);

        let lowAddr: number = Bit.toUint16(LL.get(), HH.get()) + 0;
        let midAddr: number = Bit.toUint16(LL.get(), HH.get()) + 1;
        let highAddr: number =Bit.toUint16(LL.get(), HH.get()) + 2;

        let low: Read = context.bus.readByte(Address.create(lowAddr));
        let mid: Read = context.bus.readByte(Address.create(midAddr));
        let high: Read = context.bus.readByte(Address.create(highAddr));

        let value: number = Bit.toUint24(high.get(), mid.get(), low.get());
        let cycles: number = LL.getCycles() +
            HH.getCycles() +
            low.getCycles() +
            mid.getCycles() +
            high.getCycles();

        return Addressing.createByte(value, cycles);
    }

}

export class Accumulator implements  IAddressingMode {

    public label: string = "ACCUMULATOR";

    public getValue(context: OpContext): Read {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return Read.word(low, high, 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return Addressing.createWord(low, high, 0);
    }
}

export class Direct implements IAddressingMode {

    public label: string = "DIRECT";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loByte: Read = context.bus.readByte(result.getLowAddr());
        let hiByte: Read = context.bus.readByte(result.getHighAddr());

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: Read = context.getOperand(0);

        if (context.registers.p.get() == 1 && context.registers.d.getLower() == 0x00) {
            let loAddr: number = low.get();
            let hiAddr: number = context.registers.d.getUpper();

            return Addressing.createWord(loAddr, hiAddr, low.getCycles());
        } else {
            let loAddr: number = context.registers.d.get() + low.get();
            let hiAddr: number = loAddr + 1;

            return Addressing.createWord(loAddr, hiAddr, low.getCycles());
        }
    }
}

export class DirectX implements IAddressingMode {

    public label: string = "DIRECT,X";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        if (result.getType() == AddressingType.BYTE) {
            let low: Read = context.bus.readByte(result.getAddr());

            let cycles: number = result.getCycles() + low.getCycles();
            return Read.byte(low.get(), cycles);
        } else {
            let loByte: Read = context.bus.readByte(result.getLowAddr());
            let hiByte: Read = context.bus.readByte(result.getHighAddr());

            let value: number = Bit.toUint16(hiByte.get(), loByte.get());
            let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

            return Read.byte(value, cycles);
        }
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        if (context.registers.p.get() == 1 && context.registers.d.getLower() == 0x00) {
            let loaddr: number = LL.get() + context.registers.x.get();
            let hiaddr: number = context.registers.d.getUpper();

            let addr = Bit.toUint16(hiaddr, loaddr);

            return Addressing.createWord(addr, LL.getCycles());
        } else {
            let loaddr: number = context.registers.d.getUpper() +
                LL.get() +
                context.registers.x.get();

            let hiaddr: number = loaddr + 1;

            return Addressing.createWord(loaddr, hiaddr, LL.getCycles());
        }
    }
}

export class DirectY implements IAddressingMode {

    public label: string = "DIRECT,Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        if (result.getType() == AddressingType.BYTE) {
            let loaddr: Address = result.getLowAddr();
            let low: Read = context.bus.readByte(loaddr);

            let cycles: number = result.getCycles() + low.getCycles();
            return Read.byte(low.get(), cycles);
        } else {
            let loaddr: Address = result.getLowAddr();
            let hiaddr: Address = result.getHighAddr();

            let loByte: Read = context.bus.readByte(loaddr);
            let hiByte: Read = context.bus.readByte(hiaddr);

            let value: number = Bit.toUint16(hiByte.get(), loByte.get());
            let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

            return Read.byte(value, cycles);
        }
    }

    public getAddressing(context: OpContext): Addressing {
        let d = context.registers.d.get();
        let LL: Read = context.getOperand(0);
        let y = context.registers.y.get();

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let loaddr: number = Bit.toUint16(dh, LL.get() + y);
            let cycles: number = LL.getCycles();

            return Addressing.createByte(loaddr, cycles);
        } else {
            let loaddr: number = d + LL.get() + y;
            let hiaddr: number = loaddr + 1;
            let cycles: number = LL.getCycles();

            return Addressing.createWord(loaddr, hiaddr, cycles);
        }
    }
}

export class DirectIndirect implements IAddressingMode {

    public label: string = "(DIRECT)";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let registers: Registers = context.registers;
        let LL: Read = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = 0;

        if (registers.p.getE() == 1 && registers.d.getLower() == 0x00) {
            let dh: number = registers.d.getUpper();

            loPointer = Bit.toUint16(dh, LL.get());
            hiPointer = loPointer + 1;
            cycles += LL.getCycles();

            let ll: Read = context.bus.readByte(Address.create(loPointer));
            let hh: Read = context.bus.readByte(Address.create(hiPointer));
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh.get(), ll.get());
            let hiaddr = loaddr + 1;

            cycles += ll.getCycles() + hh.getCycles();
            return Addressing.createWord(loaddr, hiaddr, cycles);
        } else {
            let d: number = registers.d.get();

            loPointer = d + LL.get();
            hiPointer = loPointer + 1;
            cycles += LL.getCycles();

            let ll: Read = context.bus.readByte(Address.create(loPointer));
            let hh: Read = context.bus.readByte(Address.create(hiPointer));
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh.get(), ll.get());
            let hiaddr = loaddr + 1;

            cycles += ll.getCycles() + hh.getCycles();
            return Addressing.createWord(loaddr, hiaddr, cycles);
        }
    }
}

export class DirectIndexedIndirect implements IAddressingMode {

    public label: string = "[DIRECT]";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let d: number = context.registers.d.get();

        let loPointer: number = d + LL.get();
        let miPointer: number = loPointer + 1;
        let hiPointer: number = miPointer + 1;

        let ll: Read = context.bus.readByte(Address.create(loPointer));
        let mm: Read = context.bus.readByte(Address.create(miPointer));
        let hh: Read = context.bus.readByte(Address.create(hiPointer));

        let hiaddr: number = Bit.toUint24(hh.get(), mm.get(), ll.get());
        let loaddr: number = hiaddr + 1;

        let cycles = LL.getCycles() + ll.getCycles() + mm.getCycles() + hh.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class DirectIndirectIndexed implements IAddressingMode {

    public label: string = "(DIRECT,X)";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = LL.get() + x;
            let hiPointer: number = LL.get() + x + 1;

            let cycles: number = LL.getCycles();

            return Addressing.createWord(
                Bit.toUint24(0, dh, loPointer),
                Bit.toUint24(0, dh, hiPointer), cycles);
        } else {
            let d: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = d + LL.get() + x;
            let hiPointer: number = d + LL.get() + x + 1;

            let cycles: number = LL.getCycles();

            return Addressing.createWord(loPointer, hiPointer, cycles);
        }
    }
}

export class DirectIndirectLong implements IAddressingMode {

    public label: string = "(DIRECT),Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = LL.getCycles();

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();

            let lo: number = LL.get();
            let hi: number = LL.get() + 1;

            loPointer = Bit.toUint24(0, dh, lo);
            hiPointer = Bit.toUint24(0, dh, hi);
        } else {
            let d: number = context.registers.d.getUpper();

            let lo: number = d + LL.get();
            let hi: number = d + LL.get() + 1;

            loPointer = lo;
            hiPointer = hi;
        }

        let ll: Read = context.bus.readByte(Address.create(loPointer));
        let hh: Read = context.bus.readByte(Address.create(hiPointer));
        let rr: number = context.registers.dbr.get();

        let y: number = context.registers.y.get();

        let addr: number = Bit.toUint24(rr, hh.get(), ll.get());
        let loaddr: number = addr + y;
        let hiaddr: number = addr + y + 1;

        cycles += ll.getCycles() + hh.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class DirectIndirectIndexedLong implements IAddressingMode {

    public label: string = "[DIRECT],Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let y: number = context.registers.y.get();

        let loPointer: number = context.registers.d.get() + LL.get();
        let midPointer: number = context.registers.d.get() + LL.get() + 1;
        let hiPointer: number = context.registers.d.get() + LL.get() + 2;

        let addr: number = Bit.toUint24(hiPointer, midPointer, loPointer);
        let loaddr: number = addr + y;
        let hiaddr: number = addr + y + 1;

        let cycles: number = LL.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class ImmediateX implements IAddressingMode {

    public label: string = "Immediate X";
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

    public label: string = "Immediate M";
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

    public label: string = "Immediate 8";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);

        let loaddr: Address = result.getLowAddr();
        let lodata: Read = context.bus.readByte(loaddr);

        let cycles: number = result.getCycles() + lodata.getCycles();
        return Read.byte(lodata.get(), cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        let cycles: number = LL.getCycles();
        return Addressing.createByte(LL.get(), cycles);
    }
}

export class Immediate16 implements IAddressingMode {

    public label: string = "Immediate 16";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + hiByte.getCycles() + loByte.getCycles();
        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let HH: Read = context.getOperand(1);

        let cycles: number = LL.getCycles() + HH.getCycles();
        return Addressing.createWord(LL.get(), HH.get(), cycles);
    }
}

export class Implied implements IAddressingMode {

    public getValue(context: OpContext): Read {
        let opaddr: number = context.opaddr.toValue();
        return Read.byte(opaddr, 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let opaddr: number = context.opaddr.toValue();
        return Addressing.createByte(opaddr, 0);
    }
}

export class Long implements IAddressingMode {

    public label: string = " LONG";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();
        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let MM: Read = context.getOperand(1);
        let HH: Read = context.getOperand(2);

        let addr: number = Bit.toUint24(HH.get(), MM.get(), LL.get());

        let loaddr: number = addr;
        let hiaddr: number = addr + 1;

        let cycles: number = LL.getCycles() + MM.getCycles() + HH.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class LongX implements IAddressingMode {

    public label: string = "LONG,X";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + hiByte.getCycles() + loByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let MM: Read = context.getOperand(1);
        let HH: Read = context.getOperand(2);

        let addr: number = Bit.toUint24(HH.get(), MM.get(), LL.get());

        let loaddr: number = addr + context.registers.x.get();
        let hiaddr: number = addr + context.registers.x.get() + 1;

        let cycles: number = LL.getCycles() + MM.getCycles() + HH.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class Relative8 implements IAddressingMode {

    public label: string = "RELATIVE 8";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        return Read.byte(result.getAddr().toValue(), 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        if (LL.get() < 0x80) {
            let cycles: number = LL.getCycles();
            return Addressing.createByte(LL.get(), cycles);
        } else {
            let cycles: number = LL.getCycles();
            return Addressing.createByte(LL.get() - 0x100, cycles);
        }
    }
}

export class Relative16 implements IAddressingMode {

    public label: string = "RELATIVE 16";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getAddr();

        let lodata: Read = context.bus.readByte(loaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() ;
        return Read.byte(lodata.get(), cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);
        let HH: Read = context.getOperand(1);

        let addr: number = Bit.toUint16(HH.get(), LL.get());

        let cycles: number = LL.getCycles() + HH.getCycles();

        return Addressing.createByte(addr, cycles);
    }
}

export class SourceDestination implements IAddressingMode {

    public label: string = " SOURCE,DESTINATION";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let sBank: Read = context.getOperand(0);
        let dBank: Read = context.getOperand(1);

        let sOffset: number;
        let dOffset: number;
        if (context.registers.p.getX() == 1) {
            sOffset = context.registers.x.getLower();
            dOffset = context.registers.y.getLower();
        } else {
            sOffset = context.registers.x.get();
            dOffset = context.registers.y.get();
        }

        let sAddr: number = Bit.toUint24(sBank.get(), sOffset);
        let dAddr: number = Bit.toUint24(dBank.get(), dOffset);

        let cycles: number = sBank.getCycles() + dBank.getCycles();
        return Addressing.createWord(sAddr, dAddr, cycles);
    }
}

export class Stack implements IAddressingMode {

    public label: string = "STACK,S";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        let loaddr: number = LL.get() + context.registers.sp.get();
        let hiaddr: number = LL.get() + context.registers.sp.get() + 1;

        let cycles: number = LL.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class StackY implements IAddressingMode {

    public label: string = "(STACK,S),Y";

    public getValue(context: OpContext): Read {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Read = context.bus.readByte(loaddr);
        let hiByte: Read = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.get(), loByte.get());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return Read.byte(value, cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Read = context.getOperand(0);

        let loPointer: number = LL.get() + context.registers.sp.get();
        let hiPointer: number = LL.get() + context.registers.sp.get() + 1;

        let ll: Read = context.bus.readByte(Address.create(loPointer));
        let hh: Read = context.bus.readByte(Address.create(hiPointer));
        let rr: number = context.registers.dbr.get();

        let addr: number = Bit.toUint24(rr, hh.get(), ll.get());
        let loaddr: number = addr + context.registers.y.get();
        let hiaddr: number = addr + context.registers.y.get() + 1;

        let cycles: number = LL.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
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
