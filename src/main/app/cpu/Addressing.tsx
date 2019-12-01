import {Operation, OpContext} from "./Opcodes";
import {Result} from "../bus/Result";
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
    getValue(context: OpContext) : Result;
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

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getAddr();
        let loByte: Result = context.bus.readByte(loAddr);

        let cycles: number = result.getCycles() + loByte.getCycles();

        return new Result([loByte.getValue()], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let HH: number = context.registers.k.get();
        let MM: Result = context.getOperand(0);
        let LL: Result = context.getOperand(1);

        let data: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let cycles: number = MM.getCycles() + LL.getCycles();

        return Addressing.createByte(data, cycles);
    }
}

export class Absolute implements IAddressingMode {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLowAddr();
        let hiAddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loAddr);
        let hiByte: Result = context.bus.readByte(hiAddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let dataLow: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let dataHigh: number = dataLow + 1;

        return Addressing.createWord(dataLow, dataHigh, cycles);
    }
}

export class AbsoluteX implements IAddressingMode {

    public label: string = "Absolute X";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLowAddr();
        let hiAddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loAddr);
        let hiByte: Result = context.bus.readByte(hiAddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let address: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let low: number = address + context.registers.x.get();
        let high: number = low + 1;

        return Addressing.createWord(low, high, cycles);
    }
}

export class AbsoluteY implements IAddressingMode {

    public label: string = "Absolute Y";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let loAddr: Address = result.getLowAddr();
        let hiAddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loAddr);
        let hiByte: Result = context.bus.readByte(hiAddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let address: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let low: number = address + context.registers.y.get();
        let high: number = low + 1;

        return Addressing.createWord(low, high, cycles);
    }
}

export class AbsoluteLong implements IAddressingMode {

    public label: string = "(Absolute)";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getAddr();
        let value: Result = context.bus.readByte(addr);

        let cycles: number = result.getCycles();

        return new Result([value.getValue()], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: Result = context.getOperand(0);
        let high: Result = context.getOperand(1);

        let laddr: Address = Address.create(Bit.toUint16(high.getValue(), low.getValue()));
        let haddr: Address = Address.create(Bit.toUint16(high.getValue(), low.getValue()));

        let LL: Result = context.bus.readByte(laddr);
        let MM: Result = context.bus.readByte(haddr);
        let HH: number = context.registers.k.get();

        let cycles: number = LL.getCycles() + MM.getCycles();
        let address: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());

        return Addressing.createByte(address, cycles);
    }
}

export class AbsoluteLongIndexed implements IAddressingMode {

    public label: string = "[absolute]";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let addr: Address = result.getAddr();
        let value: Result = context.bus.readByte(addr);

        let cycles: number = result.getCycles();

        return new Result([value.getValue()], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let HH: Result = context.getOperand(1);

        let lowAddr: number = Bit.toUint16(LL.getValue(), HH.getValue()) + 0;
        let midAddr: number = Bit.toUint16(LL.getValue(), HH.getValue()) + 1;
        let highAddr: number =Bit.toUint16(LL.getValue(), HH.getValue()) + 2;

        let low: Result = context.bus.readByte(Address.create(lowAddr));
        let mid: Result = context.bus.readByte(Address.create(midAddr));
        let high: Result = context.bus.readByte(Address.create(highAddr));

        let value: number = Bit.toUint24(high.getValue(), mid.getValue(), low.getValue());
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

    public getValue(context: OpContext): Result {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return new Result([low, high], 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return Addressing.createWord(low, high, 0);
    }
}

export class Direct implements IAddressingMode {

    public label: string = "DIRECT";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let loByte: Result = context.bus.readByte(result.getLowAddr());
        let hiByte: Result = context.bus.readByte(result.getHighAddr());

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let low: Result = context.getOperand(0);

        if (context.registers.p.get() == 1 && context.registers.d.getLower() == 0x00) {
            let loAddr: number = low.getValue();
            let hiAddr: number = context.registers.d.getUpper();

            return Addressing.createWord(loAddr, hiAddr, low.getCycles());
        } else {
            let loAddr: number = context.registers.d.get() + low.getValue();
            let hiAddr: number = loAddr + 1;

            return Addressing.createWord(loAddr, hiAddr, low.getCycles());
        }
    }
}

export class DirectX implements IAddressingMode {

    public label: string = "DIRECT,X";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        if (result.getType() == AddressingType.BYTE) {
            let low: Result = context.bus.readByte(result.getAddr());

            let cycles: number = result.getCycles() + low.getCycles();
            return new Result([low.getValue()], cycles);
        } else {
            let loByte: Result = context.bus.readByte(result.getLowAddr());
            let hiByte: Result = context.bus.readByte(result.getHighAddr());

            let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
            let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

            return new Result([value], cycles);
        }
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        if (context.registers.p.get() == 1 && context.registers.d.getLower() == 0x00) {
            let loaddr: number = LL.getValue() + context.registers.x.get();
            let hiaddr: number = context.registers.d.getUpper();

            let addr = Bit.toUint16(hiaddr, loaddr);

            return Addressing.createWord(addr, LL.getCycles());
        } else {
            let loaddr: number = context.registers.d.getUpper() +
                LL.getValue() +
                context.registers.x.get();

            let hiaddr: number = loaddr + 1;

            return Addressing.createWord(loaddr, hiaddr, LL.getCycles());
        }
    }
}

export class DirectY implements IAddressingMode {

    public label: string = "DIRECT,Y";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        if (result.getType() == AddressingType.BYTE) {
            let loaddr: Address = result.getLowAddr();
            let low: Result = context.bus.readByte(loaddr);

            let cycles: number = result.getCycles() + low.getCycles();
            return new Result([low.getValue()], cycles);
        } else {
            let loaddr: Address = result.getLowAddr();
            let hiaddr: Address = result.getHighAddr();

            let loByte: Result = context.bus.readByte(loaddr);
            let hiByte: Result = context.bus.readByte(hiaddr);

            let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
            let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

            return new Result([value], cycles);
        }
    }

    public getAddressing(context: OpContext): Addressing {
        let d = context.registers.d.get();
        let LL: Result = context.getOperand(0);
        let y = context.registers.y.get();

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let loaddr: number = Bit.toUint16(dh, LL.getValue() + y);
            let cycles: number = LL.getCycles();

            return Addressing.createByte(loaddr, cycles);
        } else {
            let loaddr: number = d + LL.getValue() + y;
            let hiaddr: number = loaddr + 1;
            let cycles: number = LL.getCycles();

            return Addressing.createWord(loaddr, hiaddr, cycles);
        }
    }
}

export class DirectIndirect implements IAddressingMode {

    public label: string = "(DIRECT)";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let registers: Registers = context.registers;
        let LL: Result = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = 0;

        if (registers.p.getE() == 1 && registers.d.getLower() == 0x00) {
            let dh: number = registers.d.getUpper();

            loPointer = Bit.toUint16(dh, LL.getValue());
            hiPointer = loPointer + 1;
            cycles += LL.getCycles();

            let ll: Result = context.bus.readByte(Address.create(loPointer));
            let hh: Result = context.bus.readByte(Address.create(hiPointer));
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh.getValue(), ll.getValue());
            let hiaddr = loaddr + 1;

            cycles += ll.getCycles() + hh.getCycles();
            return Addressing.createWord(loaddr, hiaddr, cycles);
        } else {
            let d: number = registers.d.get();

            loPointer = d + LL.getValue();
            hiPointer = loPointer + 1;
            cycles += LL.getCycles();

            let ll: Result = context.bus.readByte(Address.create(loPointer));
            let hh: Result = context.bus.readByte(Address.create(hiPointer));
            let rr: number = context.registers.dbr.get();

            let loaddr = Bit.toUint24(rr, hh.getValue(), ll.getValue());
            let hiaddr = loaddr + 1;

            cycles += ll.getCycles() + hh.getCycles();
            return Addressing.createWord(loaddr, hiaddr, cycles);
        }
    }
}

export class DirectIndexedIndirect implements IAddressingMode {

    public label: string = "[DIRECT]";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let d: number = context.registers.d.get();

        let loPointer: number = d + LL.getValue();
        let miPointer: number = loPointer + 1;
        let hiPointer: number = miPointer + 1;

        let ll: Result = context.bus.readByte(Address.create(loPointer));
        let mm: Result = context.bus.readByte(Address.create(miPointer));
        let hh: Result = context.bus.readByte(Address.create(hiPointer));

        let hiaddr: number = Bit.toUint24(hh.getValue(), mm.getValue(), ll.getValue());
        let loaddr: number = hiaddr + 1;

        let cycles = LL.getCycles() + ll.getCycles() + mm.getCycles() + hh.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class DirectIndirectIndexed implements IAddressingMode {

    public label: string = "(DIRECT,X)";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = LL.getValue() + x;
            let hiPointer: number = LL.getValue() + x + 1;

            let cycles: number = LL.getCycles();

            return Addressing.createWord(
                Bit.toUint24(0, dh, loPointer),
                Bit.toUint24(0, dh, hiPointer), cycles);
        } else {
            let d: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = d + LL.getValue() + x;
            let hiPointer: number = d + LL.getValue() + x + 1;

            let cycles: number = LL.getCycles();

            return Addressing.createWord(loPointer, hiPointer, cycles);
        }
    }
}

export class DirectIndirectLong implements IAddressingMode {

    public label: string = "(DIRECT),Y";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = LL.getCycles();

        if (context.registers.p.getE() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();

            let lo: number = LL.getValue();
            let hi: number = LL.getValue() + 1;

            loPointer = Bit.toUint24(0, dh, lo);
            hiPointer = Bit.toUint24(0, dh, hi);
        } else {
            let d: number = context.registers.d.getUpper();

            let lo: number = d + LL.getValue();
            let hi: number = d + LL.getValue() + 1;

            loPointer = lo;
            hiPointer = hi;
        }

        let ll: Result = context.bus.readByte(Address.create(loPointer));
        let hh: Result = context.bus.readByte(Address.create(hiPointer));
        let rr: number = context.registers.dbr.get();

        let y: number = context.registers.y.get();

        let addr: number = Bit.toUint24(rr, hh.getValue(), ll.getValue());
        let loaddr: number = addr + y;
        let hiaddr: number = addr + y + 1;

        cycles += ll.getCycles() + hh.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class DirectIndirectIndexedLong implements IAddressingMode {

    public label: string = "[DIRECT],Y";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let y: number = context.registers.y.get();

        let loPointer: number = context.registers.d.get() + LL.getValue();
        let midPointer: number = context.registers.d.get() + LL.getValue() + 1;
        let hiPointer: number = context.registers.d.get() + LL.getValue() + 2;

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

    public getValue(context: OpContext): Result {
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

    public getValue(context: OpContext): Result {
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

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);

        let loaddr: Address = result.getLowAddr();
        let lodata: Result = context.bus.readByte(loaddr);

        let cycles: number = result.getCycles() + lodata.getCycles();
        return new Result([lodata.getValue()], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        let cycles: number = LL.getCycles();
        return Addressing.createByte(LL.getValue(), cycles);
    }
}

export class Immediate16 implements IAddressingMode {

    public label: string = "Immediate 16";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + hiByte.getCycles() + loByte.getCycles();
        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let HH: Result = context.getOperand(1);

        let cycles: number = LL.getCycles() + HH.getCycles();
        return Addressing.createWord(LL.getValue(), HH.getValue(), cycles);
    }
}

export class Implied implements IAddressingMode {

    public getValue(context: OpContext): Result {
        let opaddr: number = context.opaddr.toValue();
        return new Result([opaddr], 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let opaddr: number = context.opaddr.toValue();
        return Addressing.createByte(opaddr, 0);
    }
}

export class Long implements IAddressingMode {

    public label: string = " LONG";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();
        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: Result = context.getOperand(2);

        let addr: number = Bit.toUint24(HH.getValue(), MM.getValue(), LL.getValue());

        let loaddr: number = addr;
        let hiaddr: number = addr + 1;

        let cycles: number = LL.getCycles() + MM.getCycles() + HH.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class LongX implements IAddressingMode {

    public label: string = "LONG,X";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + hiByte.getCycles() + loByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: Result = context.getOperand(2);

        let addr: number = Bit.toUint24(HH.getValue(), MM.getValue(), LL.getValue());

        let loaddr: number = addr + context.registers.x.get();
        let hiaddr: number = addr + context.registers.x.get() + 1;

        let cycles: number = LL.getCycles() + MM.getCycles() + HH.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class Relative8 implements IAddressingMode {

    public label: string = "RELATIVE 8";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        return new Result([result.getAddr().toValue()], 0);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        if (LL.getValue() < 0x80) {
            let cycles: number = LL.getCycles();
            return Addressing.createByte(LL.getValue(), cycles);
        } else {
            let cycles: number = LL.getCycles();
            return Addressing.createByte(LL.getValue() - 0x100, cycles);
        }
    }
}

export class Relative16 implements IAddressingMode {

    public label: string = "RELATIVE 16";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getAddr();

        let lodata: Result = context.bus.readByte(loaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() ;
        return new Result([lodata.getValue()], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);
        let HH: Result = context.getOperand(1);

        let addr: number = Bit.toUint16(HH.getValue(), LL.getValue());

        let cycles: number = LL.getCycles() + HH.getCycles();

        return Addressing.createByte(addr, cycles);
    }
}

export class SourceDestination implements IAddressingMode {

    public label: string = " SOURCE,DESTINATION";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let sBank: Result = context.getOperand(0);
        let dBank: Result = context.getOperand(1);

        let sOffset: number;
        let dOffset: number;
        if (context.registers.p.getX() == 1) {
            sOffset = context.registers.x.getLower();
            dOffset = context.registers.y.getLower();
        } else {
            sOffset = context.registers.x.get();
            dOffset = context.registers.y.get();
        }

        let sAddr: number = Bit.toUint24(sBank.getValue(), sOffset);
        let dAddr: number = Bit.toUint24(dBank.getValue(), dOffset);

        let cycles: number = sBank.getCycles() + dBank.getCycles();
        return Addressing.createWord(sAddr, dAddr, cycles);
    }
}

export class Stack implements IAddressingMode {

    public label: string = "STACK,S";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        let loaddr: number = LL.getValue() + context.registers.sp.get();
        let hiaddr: number = LL.getValue() + context.registers.sp.get() + 1;

        let cycles: number = LL.getCycles();
        return Addressing.createWord(loaddr, hiaddr, cycles);
    }
}

export class StackY implements IAddressingMode {

    public label: string = "(STACK,S),Y";

    public getValue(context: OpContext): Result {
        let result: Addressing = this.getAddressing(context);
        let loaddr: Address = result.getLowAddr();
        let hiaddr: Address = result.getHighAddr();

        let loByte: Result = context.bus.readByte(loaddr);
        let hiByte: Result = context.bus.readByte(hiaddr);

        let value: number = Bit.toUint16(hiByte.getValue(), loByte.getValue());
        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([value], cycles);
    }

    public getAddressing(context: OpContext): Addressing {
        let LL: Result = context.getOperand(0);

        let loPointer: number = LL.getValue() + context.registers.sp.get();
        let hiPointer: number = LL.getValue() + context.registers.sp.get() + 1;

        let ll: Result = context.bus.readByte(Address.create(loPointer));
        let hh: Result = context.bus.readByte(Address.create(hiPointer));
        let rr: number = context.registers.dbr.get();

        let addr: number = Bit.toUint24(rr, hh.getValue(), ll.getValue());
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
