
import {Mode} from "../Modes";
import {Objects} from "../util/Objects";
import {Result} from "../bus/Result";
import Console from "../Console";
import {Address} from "../bus/Address";
import {Cpu} from "./Cpu";
import {Bus} from "../bus/Bus";
import {Registers} from "./Registers";
import {Addressing, DirectX, IAddressing} from "./Addressing";

export class OpContext {

    public opaddr: Address;
    public opcode: Operation;

    public console: Console;
    public cpu: Cpu;
    public bus: Bus;
    public registers: Registers;

    constructor(opaddr: Address, opcode: Operation, console: Console) {
        this.opaddr = opaddr;
        this.opcode = opcode;

        this.console = console;
        this.cpu = console.cpu;
        this.bus = console.bus;
        this.registers = console.cpu.registers;
    }

    // zero indexed
    public getOperand(index: number): Result {
        if (index < 0) {
            throw new Error("Invalid operand request");
        }


        let address: Address = Address.create(this.opaddr.toValue() + index + 1);
        return this.bus.readByte(address);
    }
}

export class Operation {
    public name: string;
    public code: number;
    public cycle: number;
    public size: number[];
    public mode: IAddressing;

    constructor(code: number, cycle: number, cycleOptions: number[], size: number[], mode: IAddressing) {
        Objects.requireNonNull(mode);

        this.cycle = cycle;
        this.mode = mode;
        this.size = size;
    }

    public execute(context: OpContext): number {
        return null;
    }

    public getCycle(): number {
        let additionals = 0;

        return this.cycle + additionals;
    }

    public getSize(): number {
        if (this.size == null || this.size.length == 0) {
            throw new Error("Invalid hcounter set");
        }

        // TODO
        return this.size[0];
    }

    // C carry
    // Z zero
    // V overflow
    // N negative

    protected setFlagC(context: OpContext, val: number): void {
        if (val == null || val  < 0 || context == null) {
            throw new Error("Invalid flag calculation!");
        }

        //let isOverflow: boolean = val > context.mode.size;
        if (val > 0xFF) {
            context.registers.p.setC(1);
        } else {
            context.registers.p.setC(0);
        }
    }


    protected setFlagZ(context: OpContext, val: number): void {
        if (val == null || val < 0 || context == null) {
            throw new Error("Invalid flag calculation!");
        }

        if (val == 0) {
            context.cpu.registers.p.setZ(1);
        } else {
            context.cpu.registers.p.setZ(0);
        }
    }

    protected setFlagV(context: OpContext, a: number, b: number): void {
        if (a == null || b == null || a < 0 || b < 0 || context) {
            throw new Error("Invalid flag calculation!");
        }

        let sum = a + b;

        //let isOverflow = (((a ^ b) >> context.mode.size) != 0) && (((a ^ sum) >> context.mode.size) != 0);
        //context.cpu.registers.p.setV(isOverflow ? 1 : 0);

    }

    protected setFlagN(context: OpContext, val: number): void {
        if (val == null || context) {
            throw new Error("Invalid flag calculation!");
        }

        let isNegative: boolean = ((val >> 7) & 1) == 1;
        context.cpu.registers.p.setN(isNegative ? 1 : 0);
    }

}

export class ADC extends Operation {
    public name: string = "ADC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let a: number = context.cpu.registers.a.get();
        let b: number = 0;
        let c: number = context.cpu.registers.p.getC();

        let result: number = a + b + c;

        this.setFlagN(context, result);
        this.setFlagV(context, a, c)
        this.setFlagZ(context, result);
        this.setFlagC(context, result);

        context.cpu.registers.a.set(result);
        return null;
    }
}

export class AND extends Operation {
    public name: string = "AND";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let a: number = context.cpu.registers.a.get();
        let b: number = 0;

        let result: number = a & b;

        this.setFlagZ(context, result);
        this.setFlagN(context, result);

        context.cpu.registers.a.set(result);

        return null;
    }
}

export class ASL extends Operation {
    public name: string = "ASL";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let mode: Mode = context.cpu.registers.e.getMode();
        let result: Result = this.mode.getValue(context);

        let a: number = result.getValue();
        let c: number = (a >> mode.size) & 1;

        a = (a << 1) % mode.size;

        this.setFlagN(context, a);
        this.setFlagN(context, a);
        this.setFlagC(context, a);

        context.cpu.registers.a.set(a);

        return null;
    }

}

export class BCC extends Operation {
    public name: string = "BCC";

    public execute(context: OpContext): number {
        if (context.registers.p.getC() == 0) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }
        return this.getCycle();
    }
}

export class BCS extends Operation {
    public name: string = "BCS";

    public execute(context: OpContext): number {
        if (context.registers.p.getC() == 1) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }
        return this.getCycle();
    }
}

export class BEQ extends Operation {
    public name: string = "BEQ";

    public execute(context: OpContext): number {
        if (context.registers.p.getZ() == 0) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }
        return this.getCycle();
    }
}

export class BIT extends Operation {
    public name: string = "BIT";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class BMI extends Operation {
    public name: string = "BMI";

    public execute(context: OpContext): number {
        if (context.registers.p.getN() == 0) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }

        return this.getCycle();
    }

}

class BNE extends Operation {
    public name: string = "BNE";

    public execute(context: OpContext): number {
        if (context.registers.p.getN() == 1) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }

        return this.getCycle();
    }
}

class BPL extends Operation {
    public name: string = "BPL";

    public execute(context: OpContext): number {
        if (context.registers.p.getN() == 0) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }

        return this.getCycle();
    }

}

class CMP extends Operation {
    public name: string = "CMP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class COP extends Operation {
    public name: string = "COP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;

        // Useless
    }

}

class CPX extends Operation {
    public name: string = "CPX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class CPY extends Operation {
    public name: string = "CPY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class CLC extends Operation {
    public name: string = "CLC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        context.cpu.registers.p.setC(0);
        return null;
    }
}

class CLD extends Operation {
    public name: string = "CLD";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        context.cpu.registers.p.setD(0);
        return null;
    }

}

class CLI extends Operation {
    public name: string = "CLI";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        context.cpu.registers.p.setI(0);
        return null;
    }

}

class CLV extends Operation {
    public name: string = "CLV";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        context.cpu.registers.p.setV(0);
        return null;
    }


}

class BRA extends Operation {
    public name: string = "BRA";

    public execute(context: OpContext): number {
        let result: Result = this.mode.getValue(context);

        let current: number = context.registers.pc.get();
        let next: number = current + result.getValue();

        context.registers.pc.set(next & 0xFF);

        return this.getCycle() + (next > 0xFF ? 1: 0);
    }
}

class BRK extends Operation {
    public name: string = "BRK";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;

        // Useless
    }

}

class BVS extends Operation {
    public name: string = "BVS";

    public execute(context: OpContext): number {
        if (context.registers.p.getV() == 1) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }
        return this.getCycle();
    }

}

class BVC extends Operation {
    public name: string = "BVC";

    public execute(context: OpContext): number {
        if (context.registers.p.getV() == 0) {
            let result: Result = this.mode.getValue(context);

            let current: number = context.registers.pc.get();
            let next: number = current + result.getValue();

            context.registers.pc.set(next & 0xFF);

            return this.getCycle() + (next > 0xFF ? 1: 0);
        }
        return this.getCycle();
    }

}

class BRL extends Operation {
    public name: string = "BRL";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class DEC extends Operation {
    public name: string = "DEC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;


        // TODO
        // context.cpu.bus.writeBytes(0x00, context.opaddr, result & context.mode.mask, 2);
    }

}

class DEX extends Operation {
    public name: string = "DEX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;

    }

}

class DEY extends Operation {
    public name: string = "DEY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;

    }

}

class EOR extends Operation {
    public name: string = "EOR";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;



    }

}

class INC extends Operation {
    public name: string = "INC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);


        return null;

        // TODO
        // context.cpu.bus.writeBytes(0x00, context.opaddr, result & context.mode.mask, 2);
    }

}

class INY extends Operation {
    public name: string = "INY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class XCE extends Operation {
    public name: string = "XCE";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class XBA extends Operation {
    public name: string = "XBA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class WDM extends Operation {
    public name: string = "WDM";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class WAI extends Operation {
    public name: string = "WAI";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class TYX extends Operation {
    public name: string = "TYX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.y.get();
        let to: number = context.cpu.registers.x.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.x.set(from);
        return null;
    }
}

class TYA extends Operation {
    public name: string = "TYA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.y.get();
        let to: number = context.cpu.registers.a.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.a.set(from);
        return null;
    }
}

class TXY extends Operation {
    public name: string = "TXY";

    public execute(context: OpContext): number {
        console.log(this.name);

        let from: number = context.cpu.registers.x.get();
        let to: number = context.cpu.registers.y.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.y.set(from);
        return null;
    }

}

class TAX extends Operation {
    public name: string = "TAX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.x.get();


        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.x.set(from);
        return null;
    }

}

class TAY extends Operation {
    public name: string = "TAY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.y.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.y.set(from);
        return null;
    }
}

class TCD extends Operation {
    public name: string = "TCD";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.d.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.d.set(from);
        return null;
    }

}

class TCS extends Operation {
    public name: string = "TCS";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.sp.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.sp.set(from);
        return null;
    }

}

class TDC extends Operation {
    public name: string = "TDC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.d.get();
        let to: number = context.cpu.registers.a.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.a.set(from);
        return null;
    }

}

class TRB extends Operation {
    public name: string = "TRB";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let operand: number = 0;
        let a: number = context.cpu.registers.a.get();

        //let mask = Math.pow(2, context.mode.size) - 1;
        let complementOfA = ~a & 0;
        let result = (a & operand) & complementOfA;

        this.setFlagZ(context, result);

        // TODO write to bus
        return null;
    }

}

class TXS extends Operation {
    public name: string = "TXS";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.x.get();
        context.cpu.registers.sp.set(from);
        return null;
    }
}

class TSB extends Operation {
    public name: string = "TSB";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let operand: number = 0;
        let a: number = context.cpu.registers.a.get();

        let result = operand & a;

        // TODO write to bus
        return null;
    }

}

class TXA extends Operation {
    public name: string = "TXA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.x.get();
        let to: number = context.cpu.registers.a.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.a.set(from);
        return null;
    }
}

class TSX extends Operation {
    public name: string = "TSX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.stack.popByte();
        if (context.cpu.registers.p.getX() == 0) {
            from = (from << 8) || context.cpu.stack.popByte();
        }
        let to: number = context.cpu.registers.x.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.x.set(from);
        return null;
    }

}

class TSC extends Operation {
    public name: string = "TSC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let from: number = context.cpu.registers.sp.get();
        let to: number = context.cpu.registers.a.get();

        this.setFlagN(context, from);
        this.setFlagZ(context, from);

        context.cpu.registers.a.set(from);
        return null;
    }

}

class STZ extends Operation {
    public name: string = "STZ";

    public execute(context: OpContext): number {
        //TODO
        let val: Result = this.mode.getAddress(context);
        let addr: Address = Address.create(val.getValue());
        context.bus.writeByte(addr, 0);

        return this.getCycle();
    }

}

class JMP extends Operation {
    public name: string = "JMP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class JSR extends Operation {
    public name: string = "JSR";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class LDA extends Operation {
    public name: string = "LDA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result: number = 0;

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        // TODO
        context.cpu.registers.a.set(result);
        return null;
    }

}

class LDX extends Operation {
    public name: string = "LDX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result: number = 0;

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        // TODO
        context.cpu.registers.x.set(result);
        return null;
    }

}

class LDY extends Operation {
    public name: string = "LDY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result: number = 0;

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        // TODO
        context.cpu.registers.y.set(result);
        return null;
    }
}

class LSR extends Operation {
    public name: string = "LSR";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class MVN extends Operation {
    public name: string = "MVN";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class MVP extends Operation {
    public name: string = "MVP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class NOP extends Operation {
    public name: string = "NOP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class ORA extends Operation {
    public name: string = "ORA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class PEA extends Operation {
    public name: string = "PEA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class PEI extends Operation {
    public name: string = "PEI";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class PER extends Operation {
    public name: string = "PER";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class PHA extends Operation {
    public name: string = "PHA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class PHB extends Operation {
    public name: string = "PHB";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class SBC extends Operation {
    public name: string = "SBC";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class STA extends Operation {
    public name: string = "STA";

    public execute(context: OpContext): number{
        //TODO
        console.log(this.name);

        let result : number = context.cpu.registers.a.get();
        // context.cpu.console.bus.writeByte(context.opaddr, result);
        return null;
    }
}

class ROL extends Operation {
    public name: string = "ROL";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class ROR extends Operation {
    public name: string = "ROR";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class STY extends Operation {
    public name: string = "STY";

    public execute(context: OpContext): number{
        //TODO
        console.log(this.name);

        let result : number = context.cpu.registers.y.get();
        // context.cpu.console.bus.writeByte(context.opaddr, result);
        return null;
    }
}

class PHD extends Operation {

    public name: string = "PHD";

    public execute(context: OpContext): number {
        //TODO
        let result : number = context.cpu.registers.d.get();
        context.cpu.stack.pushWord(result);

        return this.getCycle();
    }

}

class PHK extends Operation {

    public name: string = "PHK";

    public execute(context: OpContext): number {
        //TODO
        let result : number = context.cpu.registers.k.get();
        context.cpu.stack.pushByte(result);

        return this.getCycle();
    }

}

class PHP extends Operation {
    public name: string = "PHP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result : number = context.cpu.registers.p.get();
        context.cpu.stack.pushByte(result);
        return null;
    }

}

class PHX extends Operation {
    public name: string = "PHX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result : number = context.cpu.stack.popByte();

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        context.cpu.registers.x.set(result);
        return null;
    }

}

class PHY extends Operation {
    public name: string = "PHY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result : number = context.cpu.stack.popByte();

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        context.cpu.registers.y.set(result);
        return null;
    }

}

class PLA extends Operation {
    public name: string = "PLA";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result : number = context.cpu.stack.popByte();

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        context.cpu.registers.a.set(result);
        return null;
    }

}

class PLB extends Operation {
    public name: string = "PLB";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result : number = context.cpu.stack.popByte();

        this.setFlagN(context, result);
        this.setFlagZ(context, result);

        context.cpu.registers.dbr.set(result);
        return null;
    }

}

class PLD extends Operation {
    public name: string = "PLD";

    public execute(context: OpContext): number {
        //TODO
        let value: number = context.cpu.stack.popWord();
        context.registers.d.set(value);

        return this.getCycle();
    }
}

class PLP extends Operation {
    public name: string = "PLP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class PLX extends Operation {
    public name: string = "PLX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class PLY extends Operation {
    public name: string = "PLY";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class REP extends Operation {
    public name: string = "REP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }

}

class STX extends Operation {
    public name: string = "STX";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let result : number = context.cpu.registers.x.get();
        // context.cpu.console.bus.writeByte(context.opaddr, result);

        // TODO
        return null;
    }

}

class STP extends Operation {
    public name: string = "STP";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;

        // Useless
    }
}

class RTI extends Operation {
    public name: string = "RTI";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);
        return null;
    }
}

class RTL extends Operation {
    public name: string = "RTL";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let lowByte : number = context.cpu.stack.popByte();
        let highByte : number = context.cpu.stack.popByte();

        let pb : number = context.cpu.stack.popByte();
        let result : number = lowByte << 8 | highByte;

        context.cpu.registers.pc.set(result);
        context.cpu.registers.k.set(pb);
        return null;
    }

}

class RTS extends Operation {
    public name: string = "RTS";

    public execute(context: OpContext): number {
        //TODO
        console.log(this.name);

        let lowByte : number = context.cpu.stack.popByte();
        let highByte : number = context.cpu.stack.popByte();
        let result : number = lowByte << 8 | highByte;

        context.cpu.registers.pc.set(result);
        return null;
    }

}

class SEC extends Operation {
    public name: string = "SEC";

    public execute(context: OpContext): number {
        //TODO
        context.registers.p.setC(1);
        return null;
    }

}

class SED extends Operation {
    public name: string = "SED";

    public execute(context: OpContext): number {
        //TODO
        context.registers.p.setD(1);
        return null;
    }

}

class SEI extends Operation {
    public name: string = "SEI";

    public execute(context: OpContext): number {
        //TODO
        context.registers.p.setI(1);
        return null;
    }

}

class SEP extends Operation {
    public name: string = "SEP";

    public execute(context: OpContext): number {
        //TODO
        return null;
    }
}

export class Opcodes {

    private opcodes: Operation[] = new Array<Operation>(256);

    constructor() {

        this.opcodes[0x61] = new ADC(0x61,1, [2, 3], [2], Addressing.directX);
        this.opcodes[0x63] = new ADC(0x63,4, [1], [2], Addressing.stack);
        this.opcodes[0x65] = new ADC(0x65,4, [1], [2], Addressing.direct);
        this.opcodes[0x67] = new ADC(0x67,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0x69] = new ADC(0x69,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0x6D] = new ADC(0x6D,4, [1], [3], Addressing.absolute);
        this.opcodes[0x71] = new ADC(0x71,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0x72] = new ADC(0x72,7, [1], [2], Addressing.direct);
        this.opcodes[0x73] = new ADC(0x73,7, [1], [2], Addressing.stackY);
        this.opcodes[0x75] = new ADC(0x75,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x77] = new ADC(0x77,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0x79] = new ADC(0x79,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0x7D] = new ADC(0x7D,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0x7F] = new ADC(0x7F,5, [1], [4], Addressing.longX);

        this.opcodes[0x21] = new AND(0x21,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0x23] = new AND(0x23,4, [1], [2], Addressing.stack);
        this.opcodes[0x25] = new AND(0x25,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x27] = new AND(0x27,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0x29] = new AND(0x29,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0x2D] = new AND(0x2D,4, [1], [3], Addressing.absolute);
        this.opcodes[0x2F] = new AND(0x2F,5, [1], [4], Addressing.long);
        this.opcodes[0x31] = new AND(0x31,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0x32] = new AND(0x32,5, [1, 2], [2], Addressing.direct);
        this.opcodes[0x33] = new AND(0x33,7, [1], [2], Addressing.stack);
        this.opcodes[0x35] = new AND(0x35,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x37] = new AND(0x37,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0x39] = new AND(0x39,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0x3D] = new AND(0x3D,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0x3F] = new AND(0x3F,5, [1], [4], Addressing.longX);

        this.opcodes[0x06] = new ASL(0x06,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0x0A] = new ASL(0x0A,2, [], [1], Addressing.accumulator);
        this.opcodes[0x0E] = new ASL(0x0E,6, [4], [3], Addressing.absolute);
        this.opcodes[0x16] = new ASL(0x16,6, [2, 4], [2], Addressing.directIndirectIndexed);
        this.opcodes[0x1E] = new ASL(0x1E,7, [4], [3], Addressing.absoluteX);

        this.opcodes[0x90] = new BCC(0x90,2, [5, 6], [2], Addressing.relative8);
        this.opcodes[0xB0] = new BCS(0xB0,2, [5, 6], [2], Addressing.relative8);
        this.opcodes[0xF0] = new BEQ(0xF0,2, [5, 6], [2], Addressing.relative8);

        this.opcodes[0x24] = new BIT(0x24,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x2C] = new BIT(0x2C,4, [1], [3], Addressing.absolute);
        this.opcodes[0x34] = new BIT(0x34,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x3C] = new BIT(0x3C,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0x89] = new BIT(0x89,2, [1], [2, 12], Addressing.immediateM);

        this.opcodes[0x30] = new BMI(0x30,2, [5, 6], [2], Addressing.relative8);
        this.opcodes[0xD0] = new BNE(0xD0,2, [5, 6], [2], Addressing.relative8);
        this.opcodes[0x10] = new BPL(0x10,2, [5, 6], [2], Addressing.relative8);
        this.opcodes[0x80] = new BRA(0x80,3, [6], [2], Addressing.relative8);
        this.opcodes[0x00] = new BRK(0x00,7, [7], [2, 13], Addressing.stack);
        this.opcodes[0x82] = new BRL(0x82,4, [], [3], Addressing.relative16);
        this.opcodes[0x50] = new BVC(0x50,2, [5, 6], [2], Addressing.relative8);
        this.opcodes[0x70] = new BVS(0x70,2, [5, 6], [2], Addressing.relative8);

        this.opcodes[0x18] = new CLC(0x18,2, [], [1], Addressing.implied);
        this.opcodes[0xD8] = new CLD(0xD8,2, [], [1], Addressing.implied);
        this.opcodes[0x58] = new CLI(0x58,2, [], [1], Addressing.implied);
        this.opcodes[0xB8] = new CLV(0xB8,2, [], [1], Addressing.implied);
        this.opcodes[0xC1] = new CMP(0xC1,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0xC3] = new CMP(0xC3,4, [1], [2], Addressing.stack);
        this.opcodes[0xC5] = new CMP(0xC5,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0xC7] = new CMP(0xC7,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0xC9] = new CMP(0xC9,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0xCD] = new CMP(0xCD,4, [1], [3], Addressing.absolute);
        this.opcodes[0xCF] = new CMP(0xCF,5, [1], [4], Addressing.long);
        this.opcodes[0xD1] = new CMP(0xD1,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0xD2] = new CMP(0xD2,5, [1, 2], [2], Addressing.direct);
        this.opcodes[0xD3] = new CMP(0xD3,7, [1], [2], Addressing.stackY);
        this.opcodes[0xD5] = new CMP(0xD5,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0xD7] = new CMP(0xD7,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0xD9] = new CMP(0xD9,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0xDD] = new CMP(0xDD,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0xDF] = new CMP(0xDF,5, [1], [4], Addressing.longX);

        this.opcodes[0x02] = new COP(0x02,7, [7], [2, 13], Addressing.stack);

        this.opcodes[0xE0] = new CPX(0xE0,2, [8], [2, 14], Addressing.immediateX);
        this.opcodes[0xE4] = new CPX(0xE4,3, [2, 8], [2], Addressing.direct);
        this.opcodes[0xEC] = new CPX(0xEC,4, [8], [3], Addressing.absolute);
        this.opcodes[0xC0] = new CPY(0xC0,2, [], [2, 14], Addressing.immediateX);
        this.opcodes[0xC4] = new CPY(0xC4,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0xCC] = new CPY(0xCC,6, [4], [3], Addressing.absolute);

        this.opcodes[0x3A] = new DEC(0x3A,2, [], [1], Addressing.accumulator);
        this.opcodes[0xC6] = new DEC(0xC6,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0xCE] = new DEC(0xCE,6, [4], [3], Addressing.absolute);
        this.opcodes[0xD6] = new DEC(0xD6,6, [2, 4], [2], Addressing.directX);
        this.opcodes[0xDE] = new DEC(0xDE,7, [4], [3], Addressing.absoluteX);

        this.opcodes[0xCA] = new DEX(0xCA,2, [], [1], Addressing.implied);
        this.opcodes[0x88] = new DEY(0x88,2, [], [1], Addressing.implied);

        this.opcodes[0x41] = new EOR(0x41,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0x43] = new EOR(0x43,4, [1], [2], Addressing.stack);
        this.opcodes[0x45] = new EOR(0x45,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x47] = new EOR(0x47,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0x49] = new EOR(0x49,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0x4D] = new EOR(0x4D,4, [1], [3], Addressing.absolute);
        this.opcodes[0x4F] = new EOR(0x4F,5, [1], [4], Addressing.long);
        this.opcodes[0x51] = new EOR(0x51,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0x52] = new EOR(0x52,5, [1, 2], [2], Addressing.direct);
        this.opcodes[0x53] = new EOR(0x53,7, [1], [2], Addressing.stackY);
        this.opcodes[0x55] = new EOR(0x55,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x57] = new EOR(0x57,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0x59] = new EOR(0x59,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0x5D] = new EOR(0x5D,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0x5F] = new EOR(0x5F,5, [1], [4], Addressing.longX);

        this.opcodes[0x1A] = new INC(0x1A,2, [], [1], Addressing.accumulator);
        this.opcodes[0xE6] = new INC(0xE6,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0xEE] = new INC(0xEE,6, [4], [3], Addressing.absolute);
        this.opcodes[0xF6] = new INC(0xF6,6, [2, 4], [2], Addressing.directX);
        this.opcodes[0xFE] = new INC(0xFE,7, [4], [3], Addressing.absoluteX);
        this.opcodes[0xE8] = new INC(0xE8,2, [], [1], Addressing.implied);
        this.opcodes[0xC8] = new INY(0xC8,2, [], [1], Addressing.implied);

        this.opcodes[0x4C] = new JMP(0x4C,3, [], [3], Addressing.absoluteJump);
        this.opcodes[0x5C] = new JMP(0x5C,4, [], [4], Addressing.long); // TODO
        this.opcodes[0x6C] = new JMP(0x6C,5, [], [3], Addressing.absoluteJump);
        this.opcodes[0x7C] = new JMP(0x7C,6, [], [3], Addressing.absoluteX); // TODO
        this.opcodes[0xDC] = new JMP(0xDC,6, [], [3], Addressing.absoluteJump);

        this.opcodes[0x20] = new JSR(0x20,6, [], [3], Addressing.absoluteJump);
        this.opcodes[0x22] = new JSR(0x22,8, [], [4], Addressing.absoluteX); // TODO
        this.opcodes[0xFC] = new JSR(0xFC,8, [], [3], Addressing.absoluteX); // TODO

        this.opcodes[0xA1] = new LDA(0xA1,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0xA3] = new LDA(0xA3,4, [1], [2], Addressing.stack);
        this.opcodes[0xA5] = new LDA(0xA5,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0xA7] = new LDA(0xA7,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0xA9] = new LDA(0xA9,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0xAD] = new LDA(0xAD,4, [1], [3], Addressing.absolute);
        this.opcodes[0xAF] = new LDA(0xAF,5, [1], [4], Addressing.long);
        this.opcodes[0xB1] = new LDA(0xB1,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0xB2] = new LDA(0xB2,5, [1, 2], [2], Addressing.direct);
        this.opcodes[0xB3] = new LDA(0xB3,7, [1], [2], Addressing.stackY);
        this.opcodes[0xB5] = new LDA(0xB5,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0xB7] = new LDA(0xB7,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0xB9] = new LDA(0xB9,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0xBD] = new LDA(0xBD,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0xBF] = new LDA(0xBF,5, [1], [4], Addressing.longX);

        this.opcodes[0xA2] = new LDX(0xA2,2, [8], [2, 10], Addressing.immediateX);
        this.opcodes[0xA6] = new LDX(0xA6,3, [2, 8], [2], Addressing.direct);
        this.opcodes[0xAE] = new LDX(0xAE,4, [8], [3], Addressing.absolute);
        this.opcodes[0xB6] = new LDX(0xB6,4, [2, 8], [2], Addressing.directY);
        this.opcodes[0xBE] = new LDX(0xBE,4, [3, 8], [3], Addressing.absoluteY);
        this.opcodes[0xA0] = new LDY(0xA0,2, [8], [2, 14], Addressing.immediateX);
        this.opcodes[0xA4] = new LDY(0xA4,3, [2, 8], [2], Addressing.direct);
        this.opcodes[0xAC] = new LDY(0xAC,4, [8], [3], Addressing.absolute);
        this.opcodes[0xB4] = new LDY(0xB4,4, [2, 8], [2], Addressing.directX);
        this.opcodes[0xBC] = new LDY(0xBC,4, [3, 8], [3], Addressing.absoluteX);

        this.opcodes[0x46] = new LSR(0x46,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0x4A] = new LSR(0x4A,2, [], [1], Addressing.accumulator);
        this.opcodes[0x4E] = new LSR(0x4E,6, [4], [3], Addressing.absolute);
        this.opcodes[0x56] = new LSR(0x56,6, [2, 4], [2], Addressing.directX);
        this.opcodes[0x5E] = new LSR(0x5E,7, [4], [3], Addressing.absoluteX);

        this.opcodes[0x54] = new MVN(0x54,1, [3], [3], Addressing.sourceDestination);
        this.opcodes[0x44] = new MVP(0x44,1, [3], [3], Addressing.sourceDestination);
        this.opcodes[0xEA] = new NOP(0xEA,2, [], [1], Addressing.implied);

        this.opcodes[0x01] = new ORA(0x01,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0x03] = new ORA(0x03,4, [1], [2], Addressing.stack);
        this.opcodes[0x05] = new ORA(0x05,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x07] = new ORA(0x07,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0x09] = new ORA(0x09,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0x0D] = new ORA(0x0D,4, [1], [3], Addressing.absolute);
        this.opcodes[0x0F] = new ORA(0x0F,5, [1], [4], Addressing.long);
        this.opcodes[0x11] = new ORA(0x11,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0x12] = new ORA(0x12,5, [1, 2], [2], Addressing.directIndirectIndexed);
        this.opcodes[0x13] = new ORA(0x13,7, [1], [2], Addressing.stack);
        this.opcodes[0x15] = new ORA(0x15,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x17] = new ORA(0x17,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0x19] = new ORA(0x19,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0x1D] = new ORA(0x1D,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0x1F] = new ORA(0x1F,5, [1], [4], Addressing.longX);

        this.opcodes[0xF4] = new PEA(0xF4,5, [], [3], Addressing.immediate16);
        this.opcodes[0xD4] = new PEI(0xD4,6, [2], [6, 2], Addressing.direct); // TODO
        this.opcodes[0x62] = new PER(0x62,6, [], [3], Addressing.immediate16);
        this.opcodes[0x48] = new PHA(0x48,3, [1], [1], Addressing.stack);
        this.opcodes[0x8B] = new PHB(0x8B,3, [], [1], Addressing.stack);
        this.opcodes[0x0B] = new PHD(0x0B,4, [], [1], Addressing.stack);
        this.opcodes[0x4B] = new PHK(0x4B,3, [], [1], Addressing.stack);
        this.opcodes[0x08] = new PHP(0x08,3, [], [1], Addressing.stack);
        this.opcodes[0xDA] = new PHX(0xDA,3, [8], [1], Addressing.stack);
        this.opcodes[0x5A] = new PHY(0x5A,3, [8], [1], Addressing.stack);

        this.opcodes[0x68] = new PLA(0x68,4, [1], [1], Addressing.stack);
        this.opcodes[0xAB] = new PLB(0xAB,4, [], [1], Addressing.stack);
        this.opcodes[0x2B] = new PLD(0x2B,5, [], [1], Addressing.stack);
        this.opcodes[0x28] = new PLP(0x28,4, [], [1], Addressing.stack);
        this.opcodes[0xFA] = new PLX(0xFA,4, [8], [1], Addressing.stack);
        this.opcodes[0x7A] = new PLY(0x7A,4, [8], [1], Addressing.stack);

        this.opcodes[0xC2] = new REP(0xC2,3, [], [2], Addressing.immediate8);
        this.opcodes[0x26] = new REP(0x26,5, [2, 4], [2], Addressing.direct);

        this.opcodes[0x2A] = new ROL(0x2A,2, [], [1], Addressing.accumulator);
        this.opcodes[0x2E] = new ROL(0x2E,6, [4], [3], Addressing.absolute);
        this.opcodes[0x36] = new ROL(0x36,6, [2, 4], [2], Addressing.directX);
        this.opcodes[0x3E] = new ROL(0x3E,7, [4], [3], Addressing.absoluteX);

        this.opcodes[0x66] = new ROR(0x66,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0x6A] = new ROR(0x6A,2, [], [1], Addressing.accumulator);
        this.opcodes[0x6E] = new ROR(0x6E,6, [4], [3], Addressing.absolute);
        this.opcodes[0x76] = new ROR(0x76,6, [2, 4], [2], Addressing.directX);
        this.opcodes[0x7E] = new ROR(0x7E,7, [4], [3], Addressing.absoluteX);

        this.opcodes[0x40] = new RTI(0x40,6, [7], [1], Addressing.stack);
        this.opcodes[0x6B] = new RTL(0x6B,6, [], [1], Addressing.stack);
        this.opcodes[0x60] = new RTS(0x60,6, [], [1], Addressing.stack);

        this.opcodes[0xE1] = new SBC(0xE1,6, [1, 2], [2], Addressing.immediate16);
        this.opcodes[0xE3] = new SBC(0xE3,4, [1], [2], Addressing.direct); // TODO
        this.opcodes[0xE5] = new SBC(0xE5,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0xE7] = new SBC(0xE7,6, [1, 2], [2], Addressing.directIndexedIndirect);
        this.opcodes[0xE9] = new SBC(0xE9,2, [1], [2, 12], Addressing.immediateM);
        this.opcodes[0xED] = new SBC(0xED,4, [1], [3], Addressing.absolute);
        this.opcodes[0xEF] = new SBC(0xEF,5, [1], [4], Addressing.long);
        this.opcodes[0xF1] = new SBC(0xF1,5, [1, 2, 3], [2], Addressing.directY);
        this.opcodes[0xF2] = new SBC(0xF2,5, [1, 2], [2], Addressing.direct);
        this.opcodes[0xF3] = new SBC(0xF3,7, [1], [2], Addressing.stackY);
        this.opcodes[0xF5] = new SBC(0xF5,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0xF7] = new SBC(0xF7,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0xF9] = new SBC(0xF9,4, [1, 3], [3], Addressing.absoluteX);
        this.opcodes[0xFD] = new SBC(0xFD,4, [1, 3], [3], Addressing.absoluteY);
        this.opcodes[0xFF] = new SBC(0xFF,5, [1], [4], Addressing.longX);

        this.opcodes[0x38] = new SEC(0x38,2, [], [1], Addressing.implied);
        this.opcodes[0xF8] = new SED(0xF8,2, [], [1], Addressing.implied);
        this.opcodes[0x78] = new SEI(0x78,2, [], [1], Addressing.implied);
        this.opcodes[0xE2] = new SEP(0xE2,3, [], [2], Addressing.immediate8);

        this.opcodes[0x81] = new STA(0x81,6, [1, 2], [2], Addressing.directX);
        this.opcodes[0x83] = new STA(0x83,4, [1], [2], Addressing.stack);
        this.opcodes[0x85] = new STA(0x85,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x87] = new STA(0x87,6, [1, 2], [2], Addressing.directIndirectIndexed);
        this.opcodes[0x8D] = new STA(0x8D,4, [1], [3], Addressing.absolute);
        this.opcodes[0x8F] = new STA(0x8F,5, [1], [4], Addressing.long);
        this.opcodes[0x91] = new STA(0x91,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0x92] = new STA(0x92,5, [1, 2], [2], Addressing.directIndirect);
        this.opcodes[0x93] = new STA(0x93,7, [1], [2], Addressing.stackY);
        this.opcodes[0x95] = new STA(0x95,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x97] = new STA(0x97,6, [1, 2], [2], Addressing.directY);
        this.opcodes[0x99] = new STA(0x99,5, [1], [3], Addressing.absoluteY);
        this.opcodes[0x9D] = new STA(0x9D,5, [1], [3], Addressing.absoluteX);
        this.opcodes[0x9F] = new STA(0x9F,5, [1], [4], Addressing.longX);

        this.opcodes[0xDB] = new STP(0xDB,3, [9], [1], Addressing.implied);
        this.opcodes[0x86] = new STX(0x86,3, [2, 8], [2], Addressing.direct);
        this.opcodes[0x8E] = new STX(0x8E,4, [8], [3], Addressing.absolute);
        this.opcodes[0x96] = new STX(0x96,4, [2, 8], [2], Addressing.directY);

        this.opcodes[0x84] = new STY(0x84,3, [2, 8], [2], Addressing.direct);
        this.opcodes[0x8C] = new STY(0x8C,4, [8], [3], Addressing.absolute);
        this.opcodes[0x94] = new STY(0x94,4, [2, 8], [2], Addressing.directX);

        this.opcodes[0x64] = new STZ(0x64,3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x74] = new STZ(0x74,4, [1, 2], [2], Addressing.directX);
        this.opcodes[0x9C] = new STZ(0x9C,4, [1], [3], Addressing.absolute);
        this.opcodes[0x9E] = new STZ(0x9E,5, [1], [3], Addressing.absoluteX);

        this.opcodes[0xAA] = new TAX(0xAA,2, [], [1], Addressing.implied);
        this.opcodes[0xA8] = new TAY(0xA8,2, [], [1], Addressing.implied);
        this.opcodes[0x5B] = new TCD(0x5B,2, [], [1], Addressing.implied);
        this.opcodes[0x1B] = new TCS(0x1B,2, [], [1], Addressing.implied);
        this.opcodes[0x7B] = new TDC(0x7B,2, [], [1], Addressing.implied);
        this.opcodes[0x14] = new TRB(0x14,5, [], [2], Addressing.direct);
        this.opcodes[0x1C] = new TRB(0x1C,6, [3], [3], Addressing.absolute);
        this.opcodes[0x04] = new TSB(0x04,5, [2, 4], [2], Addressing.direct);
        this.opcodes[0x0C] = new TSB(0x0C,6, [4], [3], Addressing.absolute);
        this.opcodes[0x3B] = new TSC(0x3B,2, [], [1], Addressing.implied);
        this.opcodes[0xBA] = new TSX(0xBA,2, [], [1], Addressing.implied);
        this.opcodes[0x8A] = new TXA(0x8A,2, [], [1], Addressing.implied);
        this.opcodes[0x9A] = new TXS(0x9A,2, [], [1], Addressing.implied);
        this.opcodes[0x9B] = new TXY(0x9B,2, [], [1], Addressing.implied);
        this.opcodes[0x98] = new TYA(0x98,2, [], [1], Addressing.implied);
        this.opcodes[0xBB] = new TYX(0xBB,2, [], [1], Addressing.implied);
        this.opcodes[0xCB] = new WAI(0xCB,3, [10], [1], Addressing.implied);
        this.opcodes[0x42] = new WDM(0x42,0, [10], [2], Addressing.implied); // TODO
        this.opcodes[0xEB] = new XBA(0xEB,1, [3], [1], Addressing.implied);
        this.opcodes[0xFB] = new XCE(0xFB,1, [2], [1], Addressing.implied);

    }

    public get(code: number): Operation {
        if (code == null || code < 0 || code > this.opcodes.length) {
            throw new Error("got invalid opcode: " + code);
        }
        let opcode: Operation = this.opcodes[code];
        Objects.requireNonNull(opcode, "got null opcode: " + code);

        return opcode;
    }
}
