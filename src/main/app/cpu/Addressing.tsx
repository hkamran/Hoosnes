import {Opcode, OpContext} from "./Opcodes";
import {Result} from "../bus/Result";
import {Address} from "../bus/Address";
import {Bit} from "../util/Bit";
import {Register, Registers} from "./Registers";

/**
 *  Fetches the address of the first data that will be used by the instruction.
 *
 *  https://wiki.superfamicom.org/65816-reference
 *  https://github.com/michielvoo/SNES/wiki/CPU
 *  http://6502.org/tutorials/65c816opcodes.html#5.7
 */
export interface IAddressing  {
    getValue(context: OpContext) : Result;
    getAddress(context: OpContext) : Result;
}

// Note that although the 65C816 has a 24-bit address space,
// the Program Counter is only a 16-bit register and
// the Program Bank Register is a separate (8-bit) register.
// This means that instruction execution wraps at bank boundaries.
// This is true even if the bank boundary occurs in the middle of the instruction.

export class AbsoluteJump implements IAddressing {

    public label: string = "Absolute Jump";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let loAddr: Address = Address.create(result.getValue());
        let loByte: Result = context.bus.readByte(loAddr);

        let cycles: number = result.getCycles() + loByte.getCycles();

        return new Result([loByte.getValue()], cycles);
    }

    getAddress(context: OpContext): Result {
        let HH: number = context.registers.k.get();
        let MM: Result = context.getOperand(0);
        let LL: Result = context.getOperand(1);

        let data: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let cycles: number = MM.getCycles() + LL.getCycles();

        return new Result([data], cycles);
    }
}

export class Absolute implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let loAddr: Address = Address.create(result.getValue(0));
        let hiAddr: Address = Address.create(result.getValue(1));

        let loByte: Result = context.bus.readByte(loAddr);
        let hiByte: Result = context.bus.readByte(hiAddr);

        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([loByte.getValue(), hiByte.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let dataLow: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let dataHigh: number = dataLow + 1;

        return new Result([dataLow, dataHigh], cycles);
    }
}

export class AbsoluteX implements IAddressing {

    public label: string = "Absolute X";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let loAddr: Address = Address.create(result.getValue(0));
        let hiAddr: Address = Address.create(result.getValue(1));

        let loByte: Result = context.bus.readByte(loAddr);
        let hiByte: Result = context.bus.readByte(hiAddr);

        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([loByte.getValue(), hiByte.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let address: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let low: number = address + context.registers.x.get();
        let high: number = low + 1;

        return new Result([low, high], cycles);
    }
}

export class AbsoluteY implements IAddressing {

    public label: string = "Absolute Y";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let loAddr: Address = Address.create(result.getValue(0));
        let hiAddr: Address = Address.create(result.getValue(1));

        let loByte: Result = context.bus.readByte(loAddr);
        let hiByte: Result = context.bus.readByte(hiAddr);

        let cycles: number = result.getCycles() + loByte.getCycles() + hiByte.getCycles();

        return new Result([loByte.getValue(), hiByte.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: number = context.cpu.registers.dbr.get();

        let cycles: number = LL.getCycles() + MM.getCycles();

        let address: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());
        let low: number = address + context.registers.y.get();
        let high: number = low + 1;

        return new Result([low, high], cycles);
    }
}

export class AbsoluteLong implements IAddressing {

    public label: string = "(Absolute)";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let addr: Address = Address.create(result.getValue());
        let data: Result = context.bus.readByte(addr);

        let cycles: number = result.getCycles();

        return new Result([data.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let low: Result = context.getOperand(0);
        let high: Result = context.getOperand(1);

        let laddr: Address = Address.create(Bit.toUint16(high.getValue(), low.getValue()));
        let haddr: Address = Address.create(Bit.toUint16(high.getValue(), low.getValue()));

        let LL: Result = context.bus.readByte(laddr);
        let MM: Result = context.bus.readByte(haddr);
        let HH: number = context.registers.k.get();

        let cycles: number = LL.getCycles() + MM.getCycles();
        let address: number = Bit.toUint24(HH, MM.getValue(), LL.getValue());

        return new Result([address], cycles);
    }
}

export class AbsoluteLongIndexed implements IAddressing {

    public label: string = "[absolute]";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let addr: Address = Address.create(result.getValue());
        let data: Result = context.bus.readByte(addr);

        let cycles: number = result.getCycles();

        return new Result([data.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
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

        return new Result([value], cycles);
    }

}

export class Accumulator implements  IAddressing {

    public label: string = "ACCUMULATOR";

    getAddress(context: OpContext): Result {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return new Result([low, high], 0);
    }

    getValue(context: OpContext): Result {
        let low: number = context.registers.a.getLower();
        let high: number = context.registers.a.getUpper();

        return new Result([low, high], 0);
    }
}

export class Direct implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let low: Result = context.bus.readByte(Address.create(result.getValue(0)));
        let high: Result = context.bus.readByte(Address.create(result.getValue(1)));

        let cycles: number = result.getCycles() + low.getCycles() + high.getCycles();
        return new Result([low.getValue(), high.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let low: Result = context.getOperand(0);

        if (context.registers.e.get() == 1 && context.registers.d.getLower() == 0x00) {
            let loaddr: number = low.getValue();
            let hiaddr: number = context.registers.d.getUpper();

            return new Result([loaddr, hiaddr], low.getCycles());
        }

        let loaddr: number = context.registers.d.get() + low.getValue();
        let hiaddr: number = loaddr + 1;

        return new Result([loaddr, hiaddr], low.getCycles());
    }
}

export class DirectX implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        if (result.getSize() == 1) {
            let low: Result = context.bus.readByte(Address.create(result.getValue(0)));

            let cycles: number = result.getCycles() + low.getCycles();
            return new Result([low.getValue()], cycles);
        }

        let low: Result = context.bus.readByte(Address.create(result.getValue(0)));
        let high: Result = context.bus.readByte(Address.create(result.getValue(1)));

        let cycles: number = result.getCycles() + low.getCycles() + high.getCycles();
        return new Result([low.getValue(), high.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);

        if (context.registers.e.get() == 1 && context.registers.d.getLower() == 0x00) {
            let loaddr: number = LL.getValue() + context.registers.x.get();
            let hiaddr: number = context.registers.d.getUpper();

            let addr = Bit.toUint16(hiaddr, loaddr);
            return new Result([addr], LL.getCycles());
        }

        let loaddr: number = context.registers.d.getUpper() +
            LL.getValue() +
            context.registers.x.get();

        let hiaddr: number = loaddr + 1;

        return new Result([loaddr, hiaddr], LL.getCycles());
    }
}

export class DirectY implements IAddressing {

    public label: string = "Direct Y";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = result.getSize() > 0 ? Address.create(result.getValue(1)) : null;

        if (result.getSize() == 1) {
            let low: Result = context.bus.readByte(loaddr);

            let cycles: number = result.getCycles() + low.getCycles();
            return new Result([low.getValue()], cycles);
        }

        let low: Result = context.bus.readByte(loaddr);
        let high: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + low.getCycles() + high.getCycles();
        return new Result([low.getValue(), high.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let d = context.registers.d.get();
        let LL: Result = context.getOperand(0);
        let y = context.registers.y.get();

        if (context.registers.e.get() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let loaddr: number = Bit.toUint16(dh, LL.getValue() + y);
            let cycles: number = LL.getCycles();

            return new Result([loaddr], cycles);
        }

        let loaddr: number = d + LL.getValue() + y;
        let hiaddr: number = loaddr + 1;
        let cycles: number = LL.getCycles();

        return new Result([loaddr, hiaddr], cycles);
    }
}

export class DirectIndirect implements IAddressing {

    public label: string = "(Direct)";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();

        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let registers: Registers = context.registers;
        let LL: Result = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = 0;

        if (registers.e.get() == 1 && registers.d.getLower() == 0x00) {
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
            return new Result([loaddr, hiaddr], cycles);
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
            new Result([loaddr, hiaddr], cycles);
        }
    }
}

export class DirectIndexedIndirect implements IAddressing {

    public label: string = "[Direct]";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
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
        return new Result([loaddr, hiaddr], cycles);
    }
}

export class DirectIndirectIndexed implements IAddressing {

    public label: string = "(DIRECT,X)";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);

        if (context.registers.e.get() == 1 && context.registers.d.getLower() == 0x00) {
            let dh: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = LL.getValue() + x;
            let hiPointer: number = LL.getValue() + x + 1;

            let cycles: number = LL.getCycles();

            return new Result([
                Bit.toUint24(0, dh, loPointer),
                Bit.toUint24(0, dh, hiPointer),
            ], cycles);
        } else {
            let d: number = context.registers.d.getUpper();
            let x: number = context.registers.x.get();

            let loPointer: number = d + LL.getValue() + x;
            let hiPointer: number = d + LL.getValue() + x + 1;

            let cycles: number = LL.getCycles();

            return new Result([loPointer, hiPointer], cycles);
        }
    }
}

export class DirectIndirectLong implements IAddressing {

    public label: string = "(DIRECT),Y";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);

        let loPointer: number;
        let hiPointer: number;
        let cycles: number = LL.getCycles();

        if (context.registers.e.get() == 1 && context.registers.d.getLower() == 0x00) {
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
        return new Result([loaddr, hiaddr], cycles);
    }
}

export class DirectIndirectIndexedLong implements IAddressing {

    public label: string = "[DIRECT],Y";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let y: number = context.registers.y.get();

        let loPointer: number = context.registers.d.get() + LL.getValue();
        let midPointer: number = context.registers.d.get() + LL.getValue() + 1;
        let hiPointer: number = context.registers.d.get() + LL.getValue() + 2;

        let addr: number = Bit.toUint24(hiPointer, midPointer, loPointer);
        let loaddr: number = addr + y;
        let hiaddr: number = addr + y + 1;

        let cycles: number = LL.getCycles();
        return new Result([loaddr, hiaddr], cycles);
    }
}

export class ImmediateX implements IAddressing {

    public label: string = "Immediate X";
    public immediate8: Immediate8 = new Immediate8();
    public immediate16: Immediate16 = new Immediate16();

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        if (result.getSize() == 1) {
            return this.immediate8.getValue(context);
        } else {
            return this.immediate16.getValue(context);
        }
    }

    public getAddress(context: OpContext): Result {
        if (context.registers.p.getX() == 1) {
            return this.immediate8.getAddress(context);
        } else {
            return this.immediate16.getAddress(context);
        }
    }
}

export class ImmediateM implements IAddressing {

    public label: string = "Immediate M";
    public immediate8: Immediate8 = new Immediate8();
    public immediate16: Immediate16 = new Immediate16();

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        if (result.getSize() == 1) {
            return this.immediate8.getValue(context);
        } else {
            return this.immediate16.getValue(context);
        }
    }

    public getAddress(context: OpContext): Result {
        if (context.registers.p.getM() == 1) {
            return this.immediate8.getAddress(context);
        } else {
            return this.immediate16.getAddress(context);
        }
    }
}

export class Immediate8 implements IAddressing {

    public label: string = "Immediate 8";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);

        let loaddr: Address = Address.create(result.getValue(0));
        let lodata: Result = context.bus.readByte(loaddr);

        let cycles: number = result.getCycles() + lodata.getCycles();
        return new Result([lodata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);

        let cycles: number = LL.getCycles();
        return new Result([LL.getValue()], cycles);
    }
}

export class Immediate16 implements IAddressing {

    public label: string = "Immediate 16";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let HH: Result = context.getOperand(1);

        let cycles: number = LL.getCycles() + HH.getCycles();
        return new Result([LL.getValue(), HH.getValue()], cycles);
    }
}

export class Implied implements IAddressing {

    public getValue(context: OpContext): Result {
        let opaddr: number = context.opaddr.toValue();
        return new Result([opaddr], 0);
    }

    public getAddress(context: OpContext): Result {
        let opaddr: number = context.opaddr.toValue();
        return new Result([opaddr], 0);
    }
}

export class Long implements IAddressing {

    public label: string = " LONG";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: Result = context.getOperand(2);

        let addr: number = Bit.toUint24(HH.getValue(), MM.getValue(), LL.getValue());

        let loaddr: number = addr;
        let hiaddr: number = addr + 1;

        let cycles: number = LL.getCycles() + MM.getCycles() + HH.getCycles();
        return new Result([loaddr, hiaddr], cycles);
    }
}

export class LongX implements IAddressing {

    public label: string = "LONG,X";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let MM: Result = context.getOperand(1);
        let HH: Result = context.getOperand(2);

        let addr: number = Bit.toUint24(HH.getValue(), MM.getValue(), LL.getValue());

        let loaddr: number = addr + context.registers.x.get();
        let hiaddr: number = addr + context.registers.x.get() + 1;

        let cycles: number = LL.getCycles() + MM.getCycles() + HH.getCycles();
        return new Result([loaddr, hiaddr], cycles);
    }
}

export class Relative8 implements IAddressing {

    public label: string = "RELATIVE 8";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        return result;
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);

        if (LL.getValue() < 0x80) {
            let cycles: number = LL.getCycles();
            return new Result([LL.getValue()], cycles);
        }

        let cycles: number = LL.getCycles();
        return new Result([LL.getValue() - 0x100], cycles);
    }
}

export class Relative16 implements IAddressing {

    public label: string = "RELATIVE 16";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));

        let lodata: Result = context.bus.readByte(loaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() ;
        return new Result([lodata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);
        let HH: Result = context.getOperand(1);

        let addr: number = Bit.toUint16(HH.getValue(), LL.getValue());

        let cycles: number = LL.getCycles() + HH.getCycles();
        return new Result([addr], cycles);
    }
}

export class SourceDestination implements IAddressing {

    public label: string = " SOURCE,DESTINATION";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let sBank: Result = context.getOperand(0);
        let dBank: Result = context.getOperand(1)

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
        return new Result([sAddr, dAddr], cycles);
    }
}

export class Stack implements IAddressing {

    public label: string = "STACK,S";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
        let LL: Result = context.getOperand(0);

        let loaddr: number = LL.getValue() + context.registers.sp.get();
        let hiaddr: number = LL.getValue() + context.registers.sp.get() + 1;

        let cycles: number = LL.getCycles();
        return new Result([loaddr, hiaddr], cycles);
    }
}

export class StackY implements IAddressing {

    public label: string = "(STACK,S),Y";

    public getValue(context: OpContext): Result {
        let result: Result = this.getAddress(context);
        let loaddr: Address = Address.create(result.getValue(0));
        let hiaddr: Address = Address.create(result.getValue(1));

        let lodata: Result = context.bus.readByte(loaddr);
        let hidata: Result = context.bus.readByte(hiaddr);

        let cycles: number = result.getCycles() + lodata.getCycles() + hidata.getCycles();
        return new Result([lodata.getValue(), hidata.getValue()], cycles);
    }

    public getAddress(context: OpContext): Result {
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
        return new Result([loaddr, hiaddr], cycles);
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

export class Addressing {
    public static implied : IAddressing = new Implied();
    public static immediate : IAddressing = new Immediate16();
    public static relative : IAddressing = new Long();
    public static relativeLong : IAddressing = new LongX();

    public static stackRelative : IAddressing;
    public static stackRelativeIndirectIndexed : IAddressing;
    public static impliedAccumulator : IAddressing;
    public static blockMove : IAddressing;

    public static direct : IAddressing = new Direct();
    public static directIndexedWithX : IAddressing = new DirectX();
    public static directIndexedWithY : IAddressing = new DirectY();
    public static directIndirect : IAddressing = new DirectIndirect();
    public static directIndexedIndirect : IAddressing = new DirectIndirect();
    public static directIndirectIndexed : IAddressing = new DirectIndirectIndexed();
    public static directIndirectLong : IAddressing = new DirectIndirectLong();
    public static directIndirectIndexedLong : IAddressing = new DirectIndirectIndexedLong();

    public static absolute : IAddressing = new Absolute();
    public static absoluteLong : IAddressing = new AbsoluteLong();
    public static absoluteLongIndex : IAddressing = new AbsoluteLongIndexed();
}
