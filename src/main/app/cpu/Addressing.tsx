import {Opcode, OpContext} from "./Opcodes";
import {Result} from "../bus/Result";
import {Address} from "../bus/Address";

/**
 *  Fetches the address of the first data that will be used by the instruction.
 */
export interface IAddressing  {
    getValue(context: OpContext) : Result;
    getAddress(context: OpContext) : Result;
}

export class Absolute implements IAddressing {

    public label: string = "Absolute";
    //  16 bit

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let high: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));

        let cycles: number = addr.cycles + low.cycles + high.cycles;
        let value: number = (high.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));

        let high: number = context.console.cpu.registers.dbr.get();
        let mid: number = firstOperand.value;
        let low: number = secondOperand.value;

        let cycles: number = firstOperand.cycles + secondOperand.cycles;
        let address: number = (high << 16 | mid << 8 | low);

        return new Result(context.opaddr.address, address, cycles);
    }

}

export class AbsoluteLong implements IAddressing {

    public label: string = "Absolute";
    //  16 bit

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
        let high: Result = context.console.bus.readByte(Address.create(addr.address.source + 2));

        let cycles: number = addr.cycles + low.cycles + high.cycles;
        let value: number = (high.value << 16 | mid.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));
        let thirdOperand: Result = context.console.bus.readByte(context.getOperand(2));

        let high: number = thirdOperand.value;
        let mid: number = firstOperand.value;
        let low: number = secondOperand.value;

        let cycles: number = firstOperand.cycles + secondOperand.cycles + thirdOperand.value;
        let address: number = (high << 16 | mid << 8 | low);

        return new Result(context.opaddr.address, address, cycles);
    }

}

export class AbsoluteLongIndexed implements IAddressing {

    public label: string = "Absolute";
    //  16 bit

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
        let high: Result = context.console.bus.readByte(Address.create(addr.address.source + 2));

        let cycles: number = addr.cycles + low.cycles + high.cycles;
        let value: number = (high.value << 16 | mid.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));
        let thirdOperand: Result = context.console.bus.readByte(context.getOperand(2));

        let high: number = thirdOperand.value;
        let mid: number = firstOperand.value;
        let low: number = secondOperand.value;

        let cycles: number = firstOperand.cycles + secondOperand.cycles + thirdOperand.value;
        let address: number = (high << 16 | mid << 8 | low);

        return new Result(context.opaddr.address, address, cycles);
    }

}

export class AbsoluteIndexedWithXAddressing implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let high: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));

        let cycles: number = addr.cycles + low.cycles + high.cycles;
        let value: number = (high.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));

        let high: number = context.console.cpu.registers.dbr.get();
        let mid: number = secondOperand.value + context.console.cpu.registers.x.get();
        let low: number = firstOperand.value + context.console.cpu.registers.x.get();

        let cycles: number = firstOperand.cycles + secondOperand.cycles;

        let address: number = (high << 16 | mid << 8 | low);
        let result: Result = new Result(context.opaddr.address, address, cycles);
        return result;
    }
}

export class AbsoluteIndexedWithYAddressing implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let high: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));

        let cycles: number = addr.cycles + low.cycles + high.cycles;
        let value: number = (high.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));

        let low: number = firstOperand.value + context.console.cpu.registers.y.get();
        let mid: number = secondOperand.value + context.console.cpu.registers.y.get();
        let high: number = context.console.cpu.registers.dbr.get();

        let cycles: number = firstOperand.cycles + secondOperand.cycles;

        let address: number = (high << 16 | mid << 8 | low);
        let result: Result = new Result(context.opaddr.address, address, cycles);
        return result;
    }
}

export class AbsoluteIndexedIndirect implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
        let high: number = context.console.cpu.registers.k.get();

        let cycles: number = addr.cycles + low.cycles + mid.cycles;
        let value: number = (high << 16 | mid.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));

        let low: number = firstOperand.value;
        let mid: number = secondOperand.value;
        let high: number = context.console.cpu.registers.k.get();

        let cycles: number = firstOperand.cycles + secondOperand.cycles;

        let address: number = (high << 16 | mid << 8 | low) + context.console.cpu.registers.x.get();
        let result: Result = new Result(context.opaddr.address, address, cycles);
        return result;
    }
}

export class AbsoluteIndirect implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
        let high: number = context.console.cpu.registers.k.get();

        let cycles: number = addr.cycles + low.cycles + mid.cycles;
        let value: number = (high << 16 | mid.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));

        let low: number = firstOperand.value;
        let mid: number = secondOperand.value;
        let high: number = 0;

        let cycles: number = firstOperand.cycles + secondOperand.cycles;

        let address: number = (high << 16 | mid << 8 | low);
        let result: Result = new Result(context.opaddr.address, address, cycles);
        return result;
    }
}

export class AbsoluteIndirectLong implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        let addr: Result = this.getAddress(context);

        let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
        let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
        let high: Result = context.console.bus.readByte(Address.create(addr.address.source + 2));

        let cycles: number = addr.cycles + low.cycles + mid.cycles;
        let value: number = (high.value << 16 | mid.value << 8 | low.value);

        return new Result(context.opaddr.address, value, cycles);
    }

    public getAddress(context: OpContext): Result {
        let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));
        let secondOperand: Result = context.console.bus.readByte(context.getOperand(1));

        let low: number = firstOperand.value;
        let mid: number = secondOperand.value;
        let high: number = 0;

        let cycles: number = firstOperand.cycles + secondOperand.cycles;

        let address: number = (high << 16 | mid << 8 | low);
        let result: Result = new Result(context.opaddr.address, address, cycles);
        return result;
    }
}

export class Direct implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let addr: Result = this.getAddress(context);

            let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
            let mid: number = 0;
            let high: number = 0;

            let cycles: number = addr.cycles + low.cycles;
            let value: number = (0 << 16 | 0 << 8 | low.value);

            return new Result(context.opaddr.address, value, cycles);
        } else {
            let addr: Result = this.getAddress(context);

            let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
            let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
            let high: number = 0;

            let cycles: number = addr.cycles + low.cycles + mid.value;
            let value: number = (0 << 16 | mid.value << 8 | low.value);

            return new Result(context.opaddr.address, value, cycles);
        }
    }

    public getAddress(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let low: number = firstOperand.value;
            let mid: number = context.console.cpu.registers.d.getUpper();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | mid << 8 | low);
            return new Result(context.opaddr.address, address, cycles);
        } else {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let low: number = firstOperand.value;
            let mid: number = context.console.cpu.registers.d.get();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | ((mid + low)) & 0xFFFF);
            return new Result(context.opaddr.address, address, cycles);
        }
    }
}

export class DirectX implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let addr: Result = this.getAddress(context);

            let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
            let mid: number = 0;
            let high: number = 0;

            let cycles: number = addr.cycles + low.cycles;
            let value: number = (0 << 16 | 0 << 8 | low.value);

            return new Result(context.opaddr.address, value, cycles);
        } else {
            let addr: Result = this.getAddress(context);

            let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
            let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
            let high: number = 0;

            let cycles: number = addr.cycles + low.cycles + mid.value;
            let value: number = (0 << 16 | mid.value << 8 | low.value);

            return new Result(context.opaddr.address, value, cycles);
        }
    }

    public getAddress(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let x: number = context.console.cpu.registers.x.get();

            let low: number = firstOperand.value + x;
            let mid: number = context.console.cpu.registers.d.getUpper();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | mid << 8 | low);
            return new Result(context.opaddr.address, address, cycles);
        } else {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let x: number = context.console.cpu.registers.x.get();

            let low: number = firstOperand.value;
            let mid: number = context.console.cpu.registers.d.get();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | ((mid + low) + x) & 0xFFFF);
            return new Result(context.opaddr.address, address, cycles);
        }
    }
}

export class DirectY implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let addr: Result = this.getAddress(context);

            let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
            let mid: number = 0;
            let high: number = 0;

            let cycles: number = addr.cycles + low.cycles;
            let value: number = (0 << 16 | 0 << 8 | low.value);

            return new Result(context.opaddr.address, value, cycles);
        } else {
            let addr: Result = this.getAddress(context);

            let low: Result = context.console.bus.readByte(Address.create(addr.address.source + 0));
            let mid: Result = context.console.bus.readByte(Address.create(addr.address.source + 1));
            let high: number = 0;

            let cycles: number = addr.cycles + low.cycles + mid.value;
            let value: number = (0 << 16 | mid.value << 8 | low.value);

            return new Result(context.opaddr.address, value, cycles);
        }
    }

    public getAddress(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let y: number = context.console.cpu.registers.x.get();

            let low: number = firstOperand.value + y;
            let mid: number = context.console.cpu.registers.d.getUpper();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | mid << 8 | low);
            return new Result(context.opaddr.address, address, cycles);
        } else {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let y: number = context.console.cpu.registers.y.get();

            let low: number = firstOperand.value;
            let mid: number = context.console.cpu.registers.d.get();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | ((mid + low) + y) & 0xFFFF);
            return new Result(context.opaddr.address, address, cycles);
        }
    }
}

export class DirectIndirect implements IAddressing {

    public label: string = "Absolute";

    public getValue(context: OpContext): Result {
        return null;
    }

    public getAddress(context: OpContext): Result {
        if (context.console.cpu.registers.e.get() == 1) {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let y: number = context.console.cpu.registers.x.get();

            let low: number = firstOperand.value + y;
            let mid: number = context.console.cpu.registers.d.getUpper();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | mid << 8 | low);
            return new Result(context.opaddr.address, address, cycles);
        } else {
            let firstOperand: Result = context.console.bus.readByte(context.getOperand(0));

            let y: number = context.console.cpu.registers.y.get();

            let low: number = firstOperand.value;
            let mid: number = context.console.cpu.registers.d.get();
            let high: number = 0;

            let cycles: number = firstOperand.cycles;

            let address: number = (high << 16 | ((mid + low) + y) & 0xFFFF);
            return new Result(context.opaddr.address, address, cycles);
        }
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
        let opaddr: Address = context.getOpAddress();
        let operand: Result = context.bus.readByte(opaddr);
        return operand;
    }

    public getAddress(context: OpContext): Result {
        return context.opaddr;
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
    public static absoluteIndexedWithX : IAddressing = new AbsoluteIndexedWithXAddressing();
    public static absoluteIndexedWithY : IAddressing = new AbsoluteIndexedWithYAddressing();
    public static absoluteIndexedIndirect : IAddressing = new AbsoluteIndexedIndirect();
    public static absoluteIndirect : IAddressing = new AbsoluteIndirect();
    public static absoluteIndirectLong : IAddressing = new AbsoluteIndirectLong();
}
