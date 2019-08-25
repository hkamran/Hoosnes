
import {Cpu} from './Cpu';
import {Memory} from "../Memory";
import {Mode} from "../Modes";
import {Address, Addressing} from "./Addressing";
import {Objects} from "../util/Objects";

export class OpContext {

    public pc: number;
    public opaddr: number;
    public op: Opcode;
    public mode: Mode;
    public cpu: Cpu;

    constructor(pc: number, opaddr: number, op: Opcode, mode: Mode, cpu: Cpu) {
        this.pc = pc;
        this.opaddr = opaddr;
        this.op = op;
        this.mode = mode;
        this.cpu = cpu;
    }
}

export class OpCalculation {

    public operands: number[] = [];
    public result: number = 0;
    public cycle: number = 0;

    constructor(operands: number[], result: number) {
        this.operands = this.operands;
        this.result = result;
    }

    public getOperand(index: number): number {
        if (this.operands == null || index > this.operands.length) return 0;
        if (index < 0) return 0;
    }

    public getResult(): number {
        return this.result;
    }

}

export class OpCycle {


}

export class Opcode {
    public name: string;
    public cycle: number;
    public size: number[];
    private mode: Address;

    constructor(cycle: number, cycleOptions: number[], size: number[], mode: Address) {
        Objects.requireNonNull(mode);

        this.cycle = cycle;
        this.mode = mode;
        this.size = size;
    }

    public execute(context: OpContext): void {
    }

    public getCycle(): number {
        let additionals = 0;

        return this.cycle + additionals;
    }

    public getSize(): number {
        if (this.size == null || this.size.length == 0) {
            throw new Error("Invalid cycle set");
        }

        // TODO
        return this.size[0];
    }

    public getOperand(state: OpContext): number {
        return this.mode.get(state.opaddr);
    }

    // C carry
    // Z zero
    // V overflow
    // N negative

    protected setFlagC(context: OpContext, output: OpCalculation): void {
        if (output == null || context) {
            throw new Error("Invalid flag calculation!");
        }

        let val = output.getResult();
        let isOverflow: boolean = val > context.mode.size;
        context.cpu.registers.p.setC(isOverflow ? 1 : 0);
    }


    protected setFlagZ(context: OpContext, output: OpCalculation): void {
        if (output == null || context) {
            throw new Error("Invalid flag calculation!");
        }

        let val = output.getResult();
        let isZero: boolean = (val & context.mode.mask) == 0;
        context.cpu.registers.p.setZ(isZero ? 1 : 0);
    }

    protected setFlagV(context: OpContext, output: OpCalculation): void {
        if (output == null || context) {
            throw new Error("Invalid flag calculation!");
        }

        let a = output.getOperand(0);
        let b = output.getOperand(1);
        let sum = output.getResult();

        let isOverflow = (((a ^ b) >> context.mode.size) != 0) && (((a ^ sum) >> context.mode.size) != 0);
        context.cpu.registers.p.setV(isOverflow ? 1 : 0);

    }

    protected setFlagN(context: OpContext, output: OpCalculation): void {
        if (output == null || context) {
            throw new Error("Invalid flag calculation!");
        }

        let val = output.getResult();
        let isNegative: boolean = ((val >> context.mode.size) & 1) == 1;
        context.cpu.registers.p.setN(isNegative ? 1 : 0);
    }

}

export class ADC extends Opcode {
    public name: string = "ADC";

    public execute(context: OpContext): void {
        console.log(this.name);

        let a: number = context.cpu.registers.a.get();
        let b: number = this.getOperand(context);
        let c: number = context.cpu.registers.p.getC();

        let result: number = a + b + c;
        let output: OpCalculation = new OpCalculation([a, b], result);

        this.setFlagN(context, output);
        this.setFlagV(context, output);
        this.setFlagZ(context, output);
        this.setFlagC(context, output);

        context.cpu.registers.a.set(result);
    }
}

export class AND extends Opcode {
    public name: string = "AND";

    public execute(context: OpContext): void {
        console.log(this.name);

        let a: number = context.cpu.registers.a.get();
        let b: number = this.getOperand(context);

        let result: number = a & b;
        let output: OpCalculation = new OpCalculation([b], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        context.cpu.registers.a.set(result);
    }
}

export class ASL extends Opcode {
    public name: string = "ASL";

    public execute(context: OpContext): void {
        console.log(this.name);

        let mode: Mode = context.cpu.registers.e.getMode();
        let a: number = this.getOperand(context);
        let c: number = (a >> mode.size) & 1;

        a = (a << 1) % mode.size;
        let output: OpCalculation = new OpCalculation([c, a], c);

        this.setFlagN(context, output);
        this.setFlagN(context, output);
        this.setFlagC(context, output);

        context.cpu.registers.a.set(a);
    }

    public getOperand(state: OpContext): number {
        return super.getOperand(state);
    }

}

export class BCC extends Opcode {
    public name: string = "BCC";

    public execute(context: OpContext): void {
        console.log(this.name);
        let c: number = context.cpu.registers.p.getC();
        let operand: number = this.getOperand(context);
        if (c == 0) {
            context.cpu.registers.pc.set(operand);
        }

    }
}

export class BCS extends Opcode {
    public name: string = "BCS";

    public execute(context: OpContext): void {
        console.log(this.name);
        let c: number = context.cpu.registers.p.getC();
        let operand: number = this.getOperand(context);
        if (c != 0) {
            context.cpu.registers.pc.set(operand);
        }
    }
}

export class BEQ extends Opcode {
    public name: string = "BEQ";

    public execute(context: OpContext): void {
        console.log(this.name);
        let z: number = context.cpu.registers.p.getZ();
        let operand: number = this.getOperand(context);
        if (z != 0) {
            context.cpu.registers.pc.set(operand);
        }
    }
}

export class BIT extends Opcode {
    public name: string = "BIT";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);

        context.cpu.registers.p.setN((operand >> 7) & 1);
        context.cpu.registers.p.setN((operand >> 6) & 1);


        let result: number = operand & context.cpu.registers.a.get();
        context.cpu.registers.p.setZ((result & context.mode.mask) == 0 ? 1 : 0);
    }
}

class BMI extends Opcode {
    public name: string = "BMI";

    public execute(context: OpContext): void {
        console.log(this.name);
        let n: number = context.cpu.registers.p.getN();
        let operand: number = this.getOperand(context);
        if (n == 1) {
            context.cpu.registers.pc.set(operand);
        }
    }

}

class BNE extends Opcode {
    public name: string = "BNE";

    public execute(context: OpContext): void {
        console.log(this.name);
        let z: number = context.cpu.registers.p.getZ();
        let operand: number = this.getOperand(context);
        if (z == 0) {
            context.cpu.registers.pc.set(operand);
        }
    }
}

class BPL extends Opcode {
    public name: string = "BPL";

    public execute(context: OpContext): void {
        console.log(this.name);
        let n: number = context.cpu.registers.p.getN();
        let operand: number = this.getOperand(context);
        if (n == 0) {
            context.cpu.registers.pc.set(operand);
        }
    }

}

class CMP extends Opcode {
    public name: string = "CMP";

    public execute(context: OpContext): void {
        console.log(this.name);

        let a: number = context.cpu.registers.a.get();
        let b: number = this.getOperand(context);
        let result: number = a - b;

        let output: OpCalculation = new OpCalculation([a, b], result);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);
        this.setFlagC(context, output);
    }

}

class COP extends Opcode {
    public name: string = "COP";

    public execute(state: OpContext): void {
        console.log(this.name);

        // Useless
    }

}

class CPX extends Opcode {
    public name: string = "CPX";

    public execute(context: OpContext): void {
        console.log(this.name);

        let a: number = context.cpu.registers.x.get();
        let b: number = this.getOperand(context);
        let result: number = a - b;

        let output: OpCalculation = new OpCalculation([a, b], result);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);
        this.setFlagC(context, output);
    }

}

class CPY extends Opcode {
    public name: string = "CPY";

    public execute(context: OpContext): void {
        console.log(this.name);

        let a: number = context.cpu.registers.y.get();
        let b: number = this.getOperand(context);
        let result: number = a - b;

        let output: OpCalculation = new OpCalculation([a, b], result);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);
        this.setFlagC(context, output);
    }
}

class CLC extends Opcode {
    public name: string = "CLC";

    public execute(context: OpContext): void {
        console.log(this.name);
        context.cpu.registers.p.setC(0);
    }
}

class CLD extends Opcode {
    public name: string = "CLD";

    public execute(context: OpContext): void {
        console.log(this.name);
        context.cpu.registers.p.setD(0);
    }

}

class CLI extends Opcode {
    public name: string = "CLI";

    public execute(context: OpContext): void {
        console.log(this.name);
        context.cpu.registers.p.setI(0);
    }

}

class CLV extends Opcode {
    public name: string = "CLV";

    public execute(context: OpContext): void {
        console.log(this.name);
        context.cpu.registers.p.setV(0);
    }


}

class BRA extends Opcode {
    public name: string = "BRA";

    public execute(context: OpContext): void {
        console.log(this.name);
        let result: number = this.getOperand(context);
        context.cpu.registers.pc.set(result);
    }
}

class BRK extends Opcode {
    public name: string = "BRK";

    public execute(state: OpContext): void {
        console.log(this.name);

        // Useless
    }

}

class BVS extends Opcode {
    public name: string = "BVS";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        if (context.cpu.registers.p.getV() == 1) {
            context.cpu.registers.pc.set(operand);
        }
    }

}

class BVC extends Opcode {
    public name: string = "BVC";

    public execute(context: OpContext): void {
        console.log(this.name);
        let v: number = context.cpu.registers.p.getV();
        let operand: number = this.getOperand(context);
        if (v == 0) {
            context.cpu.registers.pc.set(operand);
        }
    }

}

class BRL extends Opcode {
    public name: string = "BRL";

    public execute(context: OpContext): void {
        console.log(this.name);
        let v: number = context.cpu.registers.p.getV();
        let operand: number = this.getOperand(context);
        if (v == 1) {
            context.cpu.registers.pc.set(operand);
        }
    }

}

class DEC extends Opcode {
    public name: string = "DEC";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let result = operand - 1;

        let output: OpCalculation = new OpCalculation([operand], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        // TODO
        // context.cpu.memory.writeBytes(0x00, context.opaddr, result & context.mode.mask, 2);
    }

}

class DEX extends Opcode {
    public name: string = "DEX";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let result = operand - 1;

        let output: OpCalculation = new OpCalculation([operand], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        context.cpu.registers.x.set(result);
    }

}

class DEY extends Opcode {
    public name: string = "DEY";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let result = operand - 1;

        let output: OpCalculation = new OpCalculation([operand], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        context.cpu.registers.y.set(result);
    }

}

class EOR extends Opcode {
    public name: string = "EOR";

    public execute(context: OpContext): void {
        console.log(this.name);

        let a: number = this.getOperand(context);
        let b: number = context.cpu.registers.a.get();

        let result = b ^ a;

        let output: OpCalculation = new OpCalculation([a, b], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        context.cpu.registers.a.set(result);
    }

}

class INC extends Opcode {
    public name: string = "INC";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let result = operand + 1;

        let output: OpCalculation = new OpCalculation([operand], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        // TODO
        // context.cpu.memory.writeBytes(0x00, context.opaddr, result & context.mode.mask, 2);
    }

}

class INY extends Opcode {
    public name: string = "INY";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let result = operand + 1;

        let output: OpCalculation = new OpCalculation([operand], result);

        this.setFlagZ(context, output);
        this.setFlagN(context, output);

        context.cpu.registers.y.set(result);
    }

}

class XCE extends Opcode {
    public name: string = "XCE";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class XBA extends Opcode {
    public name: string = "XBA";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class WDM extends Opcode {
    public name: string = "WDM";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class WAI extends Opcode {
    public name: string = "WAI";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class TYX extends Opcode {
    public name: string = "TYX";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.y.get();
        let to: number = context.cpu.registers.x.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.x.set(from);
    }
}

class TYA extends Opcode {
    public name: string = "TYA";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.y.get();
        let to: number = context.cpu.registers.a.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.a.set(from);
    }
}

class TXY extends Opcode {
    public name: string = "TXY";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.x.get();
        let to: number = context.cpu.registers.y.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.y.set(from);
    }

}

class TAX extends Opcode {
    public name: string = "TAX";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.x.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.x.set(from);
    }

}

class TAY extends Opcode {
    public name: string = "TAY";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.y.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.y.set(from);
    }
}

class TCD extends Opcode {
    public name: string = "TCD";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.d.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.d.set(from);
    }

}

class TCS extends Opcode {
    public name: string = "TCS";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.a.get();
        let to: number = context.cpu.registers.sp.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.sp.set(from);
    }

}

class TDC extends Opcode {
    public name: string = "TDC";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.d.get();
        let to: number = context.cpu.registers.a.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.a.set(from);
    }

}

class TRB extends Opcode {
    public name: string = "TRB";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let a: number = context.cpu.registers.a.get();

        let mask = Math.pow(2, context.mode.size) - 1;
        let complementOfA = ~a & mask;
        let result = (a & operand) & complementOfA;

        let output: OpCalculation = new OpCalculation([operand, a], (a & operand));

        this.setFlagZ(context, output);

        // TODO write to memory
    }

}

class TXS extends Opcode {
    public name: string = "TXS";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.x.get();
        context.cpu.registers.sp.set(from);
    }
}

class TSB extends Opcode {
    public name: string = "TSB";

    public execute(context: OpContext): void {
        console.log(this.name);

        let operand: number = this.getOperand(context);
        let a: number = context.cpu.registers.a.get();

        let result = operand & a;
        let output: OpCalculation = new OpCalculation([operand, a], result);

        // TODO write to memory
    }

}

class TXA extends Opcode {
    public name: string = "TXA";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.x.get();
        let to: number = context.cpu.registers.a.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.a.set(from);
    }
}

class TSX extends Opcode {
    public name: string = "TSX";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.memory.stack.popByte();
        if (context.cpu.registers.p.getX() == 0) {
            from = (from << 8) || context.cpu.memory.stack.popByte();
        }
        let to: number = context.cpu.registers.x.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.x.set(from);
    }

}

class TSC extends Opcode {
    public name: string = "TSC";

    public execute(context: OpContext): void {
        console.log(this.name);

        let from: number = context.cpu.registers.sp.get();
        let to: number = context.cpu.registers.a.get();

        let output: OpCalculation = new OpCalculation([from, to], from);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.a.set(from);
    }

}

class STZ extends Opcode {
    public name: string = "STZ";

    public execute(context: OpContext): void {
        console.log(this.name);

        context.cpu.memory.writeByte(context.opaddr, 0x00);
        if (context.cpu.registers.p.getM() == 0) {
            context.cpu.memory.writeByte(context.opaddr, 0x00);
        }

    }

}

class JMP extends Opcode {
    public name: string = "JMP";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class JSR extends Opcode {
    public name: string = "JSR";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class LDA extends Opcode {
    public name: string = "LDA";

    public execute(context: OpContext): void {
        console.log(this.name);

        let result: number = this.getOperand(context);
        let output: OpCalculation = new OpCalculation([], result);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        // TODO
        context.cpu.registers.a.set(result);
    }

}

class LDX extends Opcode {
    public name: string = "LDX";

    public execute(context: OpContext): void {
        console.log(this.name);

        let result: number = this.getOperand(context);
        let output: OpCalculation = new OpCalculation([], result);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        // TODO
        context.cpu.registers.x.set(result);
    }

}

class LDY extends Opcode {
    public name: string = "LDY";

    public execute(context: OpContext): void {
        console.log(this.name);

        let result: number = this.getOperand(context);
        let output: OpCalculation = new OpCalculation([], result);

        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        // TODO
        context.cpu.registers.y.set(result);
    }
}

class LSR extends Opcode {
    public name: string = "LSR";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class MVN extends Opcode {
    public name: string = "MVN";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class MVP extends Opcode {
    public name: string = "MVP";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class NOP extends Opcode {
    public name: string = "NOP";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class ORA extends Opcode {
    public name: string = "ORA";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class PEA extends Opcode {
    public name: string = "PEA";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class PEI extends Opcode {
    public name: string = "PEI";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class PER extends Opcode {
    public name: string = "PER";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class PHA extends Opcode {
    public name: string = "PHA";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class PHB extends Opcode {
    public name: string = "PHB";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class SBC extends Opcode {
    public name: string = "SBC";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class STA extends Opcode {
    public name: string = "STA";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.registers.a.get();
        context.cpu.memory.writeByte(context.opaddr, result);
    }
}

class ROL extends Opcode {
    public name: string = "ROL";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class ROR extends Opcode {
    public name: string = "ROR";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class STY extends Opcode {
    public name: string = "STY";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.registers.y.get();
        context.cpu.memory.writeByte(context.opaddr, result);
    }
}

class PHD extends Opcode {
    public name: string = "PHD";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.registers.d.get();
        context.cpu.memory.stack.pushByte(result);
    }

}

class PHK extends Opcode {
    public name: string = "PHK";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.registers.pb.get();
        context.cpu.memory.stack.pushByte(result);
    }

}

class PHP extends Opcode {
    public name: string = "PHP";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.registers.p.get();
        context.cpu.memory.stack.pushByte(result);
    }

}

class PHX extends Opcode {
    public name: string = "PHX";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.memory.stack.popByte();

        let output: OpCalculation = new OpCalculation([], result);
        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.x.set(result);
    }

}

class PHY extends Opcode {
    public name: string = "PHY";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.memory.stack.popByte();

        let output: OpCalculation = new OpCalculation([], result);
        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.y.set(result);
    }

}

class PLA extends Opcode {
    public name: string = "PLA";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.memory.stack.popByte();

        let output: OpCalculation = new OpCalculation([], result);
        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.a.set(result);
    }

}

class PLB extends Opcode {
    public name: string = "PLB";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.memory.stack.popByte();

        let output: OpCalculation = new OpCalculation([], result);
        this.setFlagN(context, output);
        this.setFlagZ(context, output);

        context.cpu.registers.db.set(result);
    }

}

class PLD extends Opcode {
    public name: string = "PLD";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class PLP extends Opcode {
    public name: string = "PLP";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class PLX extends Opcode {
    public name: string = "PLX";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class PLY extends Opcode {
    public name: string = "PLY";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class REP extends Opcode {
    public name: string = "REP";

    public execute(state: OpContext): void {
        console.log(this.name);
    }

}

class STX extends Opcode {
    public name: string = "STX";

    public execute(context : OpContext): void {
        console.log(this.name);

        let result : number = context.cpu.registers.x.get();
        context.cpu.memory.writeByte(context.opaddr, result);

        // TODO
    }

}

class STP extends Opcode {
    public name: string = "STP";

    public execute(state: OpContext): void {
        console.log(this.name);

        // Useless
    }
}

class RTI extends Opcode {
    public name: string = "RTI";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

class RTL extends Opcode {
    public name: string = "RTL";

    public execute(context : OpContext): void {
        console.log(this.name);

        let lowByte : number = context.cpu.memory.stack.popByte();
        let highByte : number = context.cpu.memory.stack.popByte();

        let pb : number = context.cpu.memory.stack.popByte();
        let result : number = lowByte << 8 | highByte;

        context.cpu.registers.pc.set(result);
        context.cpu.registers.pb.set(pb);
    }

}

class RTS extends Opcode {
    public name: string = "RTS";

    public execute(context : OpContext): void {
        console.log(this.name);

        let lowByte : number = context.cpu.memory.stack.popByte();
        let highByte : number = context.cpu.memory.stack.popByte();
        let result : number = lowByte << 8 | highByte;

        context.cpu.registers.pc.set(result);
    }

}

class SEC extends Opcode {
    public name: string = "SEC";

    public execute(context : OpContext): void {
        console.log(this.name);

        context.cpu.registers.p.setC(1);
    }

}

class SED extends Opcode {
    public name: string = "SED";

    public execute(context : OpContext): void {
        console.log(this.name);

        context.cpu.registers.p.setD(1);
    }

}

class SEI extends Opcode {
    public name: string = "SEI";

    public execute(context : OpContext): void {
        console.log(this.name);

        context.cpu.registers.p.setI(1);
    }

}

class SEP extends Opcode {
    public name: string = "SEP";

    public execute(state: OpContext): void {
        console.log(this.name);
    }
}

export class Opcodes {

    private opcodes: Opcode[] = new Array<Opcode>(256);

    constructor() {

        this.opcodes[0x61] = new ADC(1, [2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x63] = new ADC(4, [1], [2], Addressing.stackRelative);
        this.opcodes[0x65] = new ADC(4, [1], [2], Addressing.direct);
        this.opcodes[0x67] = new ADC(6, [1, 2], [2], Addressing.directIndirectIndexedLong);
        this.opcodes[0x69] = new ADC(2, [1], [2, 12], Addressing.immediate);
        this.opcodes[0x6D] = new ADC(4, [1], [3], Addressing.absolute);
        this.opcodes[0x6D] = new ADC(5, [1], [4], Addressing.absoluteLong);
        this.opcodes[0x71] = new ADC(5, [1, 2, 3], [2], Addressing.absoluteLong);
        this.opcodes[0x73] = new ADC(7, [1], [2], Addressing.directIndexedWithY);
        this.opcodes[0x75] = new ADC(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x77] = new ADC(6, [1, 2], [2], Addressing.directIndirectIndexedLong);
        this.opcodes[0x79] = new ADC(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x7D] = new ADC(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x7F] = new ADC(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x21] = new AND(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x23] = new AND(4, [1], [2], Addressing.stackRelative);
        this.opcodes[0x25] = new AND(3, [1, 2], [2], Addressing.direct);
        this.opcodes[0x27] = new AND(6, [1, 2], [2], Addressing.directIndirectIndexedLong);
        this.opcodes[0x29] = new AND(2, [1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0x2D] = new AND(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x2F] = new AND(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x31] = new AND(5, [1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x32] = new AND(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x33] = new AND(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x35] = new AND(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x37] = new AND(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x39] = new AND(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x3D] = new AND(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x3F] = new AND(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x06] = new ASL(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x0A] = new ASL(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x0E] = new ASL(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x16] = new ASL(6, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x1E] = new ASL(7, [4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x90] = new BCC(2, [5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB0] = new BCS(2, [5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF0] = new BEQ(2, [5, 6], [2], Addressing.directIndexedWithX);

        this.opcodes[0x24] = new BIT(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x2C] = new BIT(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x34] = new BIT(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x3C] = new BIT(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x89] = new BIT(2, [1], [2, 12], Addressing.directIndexedWithX);

        this.opcodes[0x30] = new BMI(2, [5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD0] = new BNE(2, [5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x10] = new BPL(2, [5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x80] = new BRA(3, [6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x00] = new BRK(7, [7], [2, 13], Addressing.directIndexedWithX);
        this.opcodes[0x82] = new BRL(4, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0x50] = new BVC(2, [5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x70] = new BVS(2, [5, 6], [2], Addressing.directIndexedWithX);

        this.opcodes[0x18] = new CLC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xD8] = new CLD(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x58] = new CLI(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xB8] = new CLV(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xC1] = new CMP(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC3] = new CMP(4, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC5] = new CMP(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC7] = new CMP(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC9] = new CMP(2, [1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0xCD] = new CMP(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0xCF] = new CMP(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0xD1] = new CMP(5, [1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD2] = new CMP(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD3] = new CMP(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD5] = new CMP(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD7] = new CMP(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD9] = new CMP(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xDD] = new CMP(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xDF] = new CMP(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x02] = new COP(7, [7], [2, 13], Addressing.directIndexedWithX);

        this.opcodes[0xE0] = new CPX(2, [8], [2, 14], Addressing.directIndexedWithX);
        this.opcodes[0xE4] = new CPX(3, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xEC] = new CPX(4, [8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xC0] = new CPY(2, [], [2, 14], Addressing.directIndexedWithX);
        this.opcodes[0xC4] = new CPY(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xCC] = new CPY(6, [4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x3A] = new DEC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xC6] = new DEC(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xCE] = new DEC(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0xD6] = new DEC(6, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xDE] = new DEC(7, [4], [3], Addressing.directIndexedWithX);

        this.opcodes[0xCA] = new DEX(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x88] = new DEY(2, [], [1], Addressing.directIndexedWithX);

        this.opcodes[0x41] = new EOR(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x43] = new EOR(4, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x45] = new EOR(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x47] = new EOR(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x49] = new EOR(2, [1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0x4D] = new EOR(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x4F] = new EOR(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x51] = new EOR(5, [1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x52] = new EOR(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x53] = new EOR(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x55] = new EOR(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x57] = new EOR(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x59] = new EOR(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x5D] = new EOR(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x5F] = new EOR(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x1A] = new INC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xE6] = new INC(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xEE] = new INC(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0xF6] = new INC(6, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xFE] = new INC(7, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0xE8] = new INC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xC8] = new INY(2, [], [1], Addressing.directIndexedWithX);

        this.opcodes[0x4C] = new JMP(3, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0x5C] = new JMP(4, [], [4], Addressing.directIndexedWithX);
        this.opcodes[0x6C] = new JMP(5, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0x7C] = new JMP(6, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0xDC] = new JMP(6, [], [3], Addressing.directIndexedWithX);

        this.opcodes[0x20] = new JSR(6, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0x22] = new JSR(8, [], [4], Addressing.directIndexedWithX);
        this.opcodes[0xFC] = new JSR(8, [], [3], Addressing.directIndexedWithX);

        this.opcodes[0xA1] = new LDA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA3] = new LDA(4, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA5] = new LDA(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA7] = new LDA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA9] = new LDA(2, [1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0xAD] = new LDA(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0xAF] = new LDA(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0xB1] = new LDA(5, [1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB2] = new LDA(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB3] = new LDA(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB5] = new LDA(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB7] = new LDA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB9] = new LDA(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xBD] = new LDA(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xBF] = new LDA(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0xA2] = new LDX(2, [8], [2, 10], Addressing.directIndexedWithX);
        this.opcodes[0xA6] = new LDX(3, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xAE] = new LDX(4, [8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xB6] = new LDX(4, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xBE] = new LDX(4, [3, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xA0] = new LDY(2, [8], [2, 14], Addressing.directIndexedWithX);
        this.opcodes[0xA4] = new LDY(3, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xAC] = new LDY(4, [8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xB4] = new LDY(4, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xBC] = new LDY(4, [3, 8], [3], Addressing.directIndexedWithX);

        this.opcodes[0x46] = new LSR(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x4A] = new LSR(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x4E] = new LSR(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x56] = new LSR(6, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x5E] = new LSR(7, [4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x54] = new MVN(1, [3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x44] = new MVP(1, [3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xEA] = new NOP(2, [], [1], Addressing.directIndexedWithX);

        this.opcodes[0x01] = new ORA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x03] = new ORA(4, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x05] = new ORA(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x07] = new ORA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x09] = new ORA(2, [1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0x0D] = new ORA(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x0F] = new ORA(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x11] = new ORA(5, [1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x12] = new ORA(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x13] = new ORA(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x15] = new ORA(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x17] = new ORA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x19] = new ORA(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x1D] = new ORA(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x1F] = new ORA(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0xF4] = new PEA(5, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0xD4] = new PEI(6, [2], [6, 2], Addressing.directIndexedWithX);
        this.opcodes[0x62] = new PER(6, [], [3], Addressing.directIndexedWithX);
        this.opcodes[0x48] = new PHA(3, [1], [1], Addressing.directIndexedWithX);
        this.opcodes[0x8B] = new PHB(3, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x0B] = new PHD(4, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x4B] = new PHK(3, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x08] = new PHP(3, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xDA] = new PHX(3, [8], [1], Addressing.directIndexedWithX);
        this.opcodes[0x5A] = new PHY(3, [8], [1], Addressing.directIndexedWithX);

        this.opcodes[0x68] = new PLA(4, [1], [1], Addressing.directIndexedWithX);
        this.opcodes[0xAB] = new PLB(4, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x2B] = new PLD(5, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x28] = new PLP(4, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xFA] = new PLX(4, [8], [1], Addressing.directIndexedWithX);
        this.opcodes[0x7A] = new PLY(4, [8], [1], Addressing.directIndexedWithX);

        this.opcodes[0xC2] = new REP(3, [], [2], Addressing.directIndexedWithX);
        this.opcodes[0x26] = new REP(5, [2, 4], [2], Addressing.directIndexedWithX);

        this.opcodes[0x2A] = new ROL(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x2E] = new ROL(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x36] = new ROL(6, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x3E] = new ROL(7, [4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x66] = new ROR(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x6A] = new ROR(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x6E] = new ROR(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x76] = new ROR(6, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x7E] = new ROR(7, [4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x40] = new RTI(6, [7], [1], Addressing.directIndexedWithX);
        this.opcodes[0x6B] = new RTL(6, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x60] = new RTS(6, [], [1], Addressing.directIndexedWithX);

        this.opcodes[0xE1] = new SBC(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE3] = new SBC(4, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE5] = new SBC(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE7] = new SBC(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE9] = new SBC(2, [1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0xED] = new SBC(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0xEF] = new SBC(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0xF1] = new SBC(5, [1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF2] = new SBC(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF3] = new SBC(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF5] = new SBC(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF7] = new SBC(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF9] = new SBC(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xFD] = new SBC(4, [1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xFF] = new SBC(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x38] = new SEC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xF8] = new SED(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x78] = new SEI(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xE2] = new SEP(3, [], [2], Addressing.directIndexedWithX);

        this.opcodes[0x81] = new STA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x83] = new STA(4, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x85] = new STA(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x87] = new STA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x8D] = new STA(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x8F] = new STA(5, [1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x91] = new STA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x92] = new STA(5, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x93] = new STA(7, [1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x95] = new STA(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x97] = new STA(6, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x99] = new STA(5, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x9D] = new STA(5, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x9F] = new STA(5, [1], [4], Addressing.directIndexedWithX);

        this.opcodes[0xDB] = new STP(3, [9], [1], Addressing.directIndexedWithX);
        this.opcodes[0x86] = new STX(3, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0x8E] = new STX(4, [8], [3], Addressing.directIndexedWithX);
        this.opcodes[0x96] = new STX(4, [2, 8], [2], Addressing.directIndexedWithX);

        this.opcodes[0x84] = new STY(3, [2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0x8C] = new STY(4, [8], [3], Addressing.directIndexedWithX);
        this.opcodes[0x94] = new STY(4, [2, 8], [2], Addressing.directIndexedWithX);

        this.opcodes[0x64] = new STZ(3, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x74] = new STZ(4, [1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x9C] = new STZ(4, [1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x9E] = new STZ(5, [1], [3], Addressing.directIndexedWithX);

        this.opcodes[0xAA] = new TAX(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xA8] = new TAY(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x5B] = new TCD(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x1B] = new TCS(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x7B] = new TDC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x14] = new TRB(5, [], [2], Addressing.directIndexedWithX);
        this.opcodes[0x1C] = new TRB(6, [3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x04] = new TSB(5, [2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x0C] = new TSB(6, [4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x3B] = new TSC(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xBA] = new TSX(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x8A] = new TXA(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x9A] = new TXS(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x9B] = new TXY(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0x98] = new TYA(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xBB] = new TYX(2, [], [1], Addressing.directIndexedWithX);
        this.opcodes[0xCB] = new WAI(3, [10], [1], Addressing.directIndexedWithX);
        this.opcodes[0x42] = new WDM(0, [10], [2], Addressing.directIndexedWithX);
        this.opcodes[0xEB] = new XBA(1, [3], [1], Addressing.directIndexedWithX);
        this.opcodes[0xFB] = new XCE(1, [2], [1], Addressing.directIndexedWithX);

    }

    public get(code: number): Opcode {
        if (code < 0 || code > this.opcodes.length) {
            throw new Error("got invalid opcode: " + code);
        }
        let opcode: Opcode = this.opcodes[code];
        Objects.requireNonNull(opcode, "got null opcode: " + code);

        return opcode;
    }
}
