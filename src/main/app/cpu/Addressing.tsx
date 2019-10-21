import {Opcode, OpContext} from "./Opcodes";
import {Result} from "../bus/Result";
import {Address} from "../bus/Address";
import {Bit} from "../util/Bit";

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

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class DirectIndirect implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class DirectIndexedIndirect implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class DirectIndirectIndexed implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class DirectIndirectLong implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class DirectIndirectIndexedLong implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class Immediate implements IAddressing {

    public getValue(context: OpContext): Result {

        let high: number = context.cpu.registers.k.get();
        let mid: number = context.cpu.registers.pc.getUpper();
        let low: number = context.cpu.registers.pc.getLower();

        let upper: number = high;
        let lower: number = ((mid << 8 | low));

        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class Implied implements IAddressing {

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class Long implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
    }
}

export class LongX implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        return null;
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
    public static immediate : IAddressing = new Immediate();
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
