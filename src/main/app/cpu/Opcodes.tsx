import {Log, Level} from 'typescript-logger/build/index';
import {Cpu} from './Cpu';
import {Memory} from "../Memory";
import {Mode} from "../Modes";
import {Addressing} from "./Addressing";

export class OpState {

}

export class Opcode {
    public name: string;
    public cycles: number[];
    public size: number[];
    public mode: Addressing;

    constructor(cycles: number[], size: number[], mode: Addressing) {
        this.cycles = cycles;
        this.mode = mode;
        this.size = size;
    }

    public execute(state: OpState): number {
        return -1;
    }
}

export class ADC extends Opcode {
    public name: string = "ADC";
}

export class AND extends Opcode {
    public name: string = "AND";
}

export class ASL extends Opcode {
    public name: string = "ASL";
}

export class BCC extends Opcode {
    public name: string = "BCC";
}

export class BCS extends Opcode {
    public name: string = "BCS";
}

export class BEQ extends Opcode {
    public name: string = "BEQ";
}

export class BIT extends Opcode {
    public name: string = "BIT";
}

class BMI extends Opcode {
    public name: string = "BMI";

}

class BNE extends Opcode {
    public name: string = "BNE";
}

class BPL extends Opcode {
    public name: string = "BPL";

}

class CMP extends Opcode {
    public name: string = "CMP";

}

class COP extends Opcode {
    public name: string = "COP";

}

class CPX extends Opcode {
    public name: string = "CPX";

}

class CPY extends Opcode {
    public name: string = "CPY";


}

class CLC extends Opcode {
    public name: string = "CLC";


}

class CLD extends Opcode {
    public name: string = "CLD";

}

class CLI extends Opcode {
    public name: string = "CLI";

}

class CLV extends Opcode {
    public name: string = "CLV";


}

class BRA extends Opcode {
    public name: string = "BRA";


}

class BRK extends Opcode {
    public name: string = "BRK";

}

class BVS extends Opcode {
    public name: string = "BVS";

}

class BVC extends Opcode {
    public name: string = "BVC";

}

class BRL extends Opcode {
    public name: string = "BRL";

}

class DEC extends Opcode {
    public name: string = "DEC";

}

class DEX extends Opcode {
    public name: string = "DEX";


}

class DEY extends Opcode {
    public name: string = "DEY";


}

class EOR extends Opcode {
    public name: string = "EOR";


}

class INC extends Opcode {
    public name: string = "INC";


}

class INY extends Opcode {
    public name: string = "INY";


}

class XCE extends Opcode {
    public name: string = "XCE";


}

class XBA extends Opcode {
    public name: string = "XBA";

}

class WDM extends Opcode {
    public name: string = "WDM";


}

class WAI extends Opcode {
    public name: string = "WAI";


}

class TYX extends Opcode {
    public name: string = "TYX";


}

class TYA extends Opcode {
    public name: string = "TYA";

}

class TXY extends Opcode {
    public name: string = "TXY";


}

class TAX extends Opcode {
    public name: string = "TAX";


}

class TAY extends Opcode {
    public name: string = "TAY";

}

class TCD extends Opcode {
    public name: string = "TCD";


}

class TCS extends Opcode {
    public name: string = "TCS";


}

class TDC extends Opcode {
    public name: string = "TDC";


}

class TRB extends Opcode {
    public name: string = "TRB";


}

class TXS extends Opcode {
    public name: string = "TXS";

}

class TSB extends Opcode {
    public name: string = "TSB";


}

class TXA extends Opcode {
    public name: string = "TXA";

}

class TSX extends Opcode {
    public name: string = "TSX";


}

class TSC extends Opcode {
    public name: string = "TSC";


}

class STZ extends Opcode {
    public name: string = "STZ";


}

class JMP extends Opcode {
    public name: string = "JMP";


}

class JSR extends Opcode {
    public name: string = "JSR";


}

class LDA extends Opcode {
    public name: string = "LDA";


}

class LDX extends Opcode {
    public name: string = "LDX";


}

class LDY extends Opcode {
    public name: string = "LDY";

}

class LSR extends Opcode {
    public name: string = "LSR";


}

class MVN extends Opcode {
    public name: string = "MVN";

}

class MVP extends Opcode {
    public name: string = "MVP";

}

class NOP extends Opcode {
    public name: string = "NOP";


}

class ORA extends Opcode {
    public name: string = "ORA";


}

class PEA extends Opcode {
    public name: string = "PEA";

}

class PEI extends Opcode {
    public name: string = "PEI";


}

class PER extends Opcode {
    public name: string = "PER";

}

class PHA extends Opcode {
    public name: string = "PHA";

}

class PHB extends Opcode {
    public name: string = "PHB";


}

class SBC extends Opcode {
    public name: string = "SBC";


}

class STA extends Opcode {
    public name: string = "STA";

}

class ROL extends Opcode {
    public name: string = "ROL";


}

class ROR extends Opcode {
    public name: string = "ROR";

}

class STY extends Opcode {
    public name: string = "STY";

}

class PHD extends Opcode {
    public name: string = "PHD";


}

class PHK extends Opcode {
    public name: string = "PHK";


}

class PHP extends Opcode {
    public name: string = "PHP";


}

class PHX extends Opcode {
    public name: string = "PHX";


}

class PHY extends Opcode {
    public name: string = "PHY";


}

class PLA extends Opcode {
    public name: string = "PLA";


}

class PLB extends Opcode {
    public name: string = "PLB";


}

class PLD extends Opcode {
    public name: string = "PLD";

}

class PLP extends Opcode {
    public name: string = "PLP";


}

class PLX extends Opcode {
    public name: string = "PLX";


}

class PLY extends Opcode {
    public name: string = "PLY";

}

class REP extends Opcode {
    public name: string = "REP";


}

class STX extends Opcode {
    public name: string = "STX";


}

class STP extends Opcode {
    public name: string = "STP";


}

class RTI extends Opcode {
    public name: string = "RTI";

}

class RTL extends Opcode {
    public name: string = "RTL";


}

class RTS extends Opcode {
    public name: string = "RTS";


}

class SEC extends Opcode {
    public name: string = "SEC";


}

class SED extends Opcode {
    public name: string = "SED";


}

class SEI extends Opcode {
    public name: string = "SEI";


}

class SEP extends Opcode {
    public name: string = "SEP";

}

export class Opcodes {

    public Log = Log.create('Opcodes');

    private opcodes: Opcode[] = new Array<Opcode>(256);

    constructor() {

        this.opcodes[0x61] = new ADC([1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x63] = new ADC([4, 1], [2], Addressing.stackRelative);
        this.opcodes[0x65] = new ADC([4, 1], [2], Addressing.direct);
        this.opcodes[0x67] = new ADC([6, 1, 2], [2], Addressing.directIndirectIndexedLong);
        this.opcodes[0x69] = new ADC([2, 1], [2, 12], Addressing.immediate);
        this.opcodes[0x6D] = new ADC([4, 1], [3], Addressing.absolute);
        this.opcodes[0x6D] = new ADC([5, 1], [4], Addressing.absoluteLong);
        this.opcodes[0x71] = new ADC([5, 1, 2, 3], [2], Addressing.absoluteLong);
        this.opcodes[0x73] = new ADC([7, 1], [2], Addressing.directIndexedWithY);
        this.opcodes[0x75] = new ADC([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x77] = new ADC([6, 1, 2], [2], Addressing.directIndirectIndexedLong);
        this.opcodes[0x79] = new ADC([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x7D] = new ADC([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x7F] = new ADC([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x21] = new AND([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x23] = new AND([4, 1], [2], Addressing.stackRelative);
        this.opcodes[0x25] = new AND([3, 1, 2], [2], Addressing.direct);
        this.opcodes[0x27] = new AND([6, 1, 2], [2], Addressing.directIndirectIndexedLong);
        this.opcodes[0x29] = new AND([2, 1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0x2D] = new AND([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x2F] = new AND([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x31] = new AND([5, 1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x32] = new AND([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x33] = new AND([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x35] = new AND([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x37] = new AND([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x39] = new AND([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x3D] = new AND([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x3F] = new AND([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x06] = new ASL([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x0A] = new ASL([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x0E] = new ASL([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x16] = new ASL([6, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x1E] = new ASL([7, 4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x90] = new BCC([2, 5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB0] = new BCS([2, 5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF0] = new BEQ([2, 5, 6], [2], Addressing.directIndexedWithX);

        this.opcodes[0x24] = new BIT([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x2C] = new BIT([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x34] = new BIT([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x3C] = new BIT([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x89] = new BIT([2, 1], [2, 12], Addressing.directIndexedWithX);

        this.opcodes[0x30] = new BMI([2, 5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD0] = new BNE([2, 5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x10] = new BPL([2, 5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x80] = new BRA([3, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x00] = new BRK([7, 7], [2, 13], Addressing.directIndexedWithX);
        this.opcodes[0x82] = new BRL([4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x50] = new BVC([2, 5, 6], [2], Addressing.directIndexedWithX);
        this.opcodes[0x70] = new BVS([2, 5, 6], [2], Addressing.directIndexedWithX);

        this.opcodes[0x18] = new CLC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xD8] = new CLD([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x58] = new CLI([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xB8] = new CLV([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xC1] = new CMP([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC3] = new CMP([4, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC5] = new CMP([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC7] = new CMP([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xC9] = new CMP([2, 1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0xCD] = new CMP([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0xCF] = new CMP([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0xD1] = new CMP([5, 1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD2] = new CMP([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD3] = new CMP([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD5] = new CMP([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD7] = new CMP([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xD9] = new CMP([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xDD] = new CMP([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xDF] = new CMP([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x02] = new COP([7, 7], [2, 13], Addressing.directIndexedWithX);

        this.opcodes[0xE0] = new CPX([2, 8], [2, 14], Addressing.directIndexedWithX);
        this.opcodes[0xE4] = new CPX([3, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xEC] = new CPX([4, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xC0] = new CPY([2], [2, 14], Addressing.directIndexedWithX);
        this.opcodes[0xC4] = new CPY([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xCC] = new CPY([6, 4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x3A] = new DEC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xC6] = new DEC([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xCE] = new DEC([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0xD6] = new DEC([6, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xDE] = new DEC([7, 4], [3], Addressing.directIndexedWithX);

        this.opcodes[0xCA] = new DEX([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x88] = new DEY([2], [1], Addressing.directIndexedWithX);

        this.opcodes[0x41] = new EOR([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x43] = new EOR([4, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x45] = new EOR([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x47] = new EOR([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x49] = new EOR([2, 1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0x4D] = new EOR([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x4F] = new EOR([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x51] = new EOR([5, 1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x52] = new EOR([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x53] = new EOR([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x55] = new EOR([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x57] = new EOR([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x59] = new EOR([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x5D] = new EOR([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x5F] = new EOR([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x1A] = new INC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xE6] = new INC([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xEE] = new INC([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0xF6] = new INC([6, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0xFE] = new INC([7, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0xE8] = new INC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xC8] = new INY([2], [1], Addressing.directIndexedWithX);

        this.opcodes[0x4C] = new JMP([3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x5C] = new JMP([4], [4], Addressing.directIndexedWithX);
        this.opcodes[0x6C] = new JMP([5], [3], Addressing.directIndexedWithX);
        this.opcodes[0x7C] = new JMP([6], [3], Addressing.directIndexedWithX);
        this.opcodes[0xDC] = new JMP([6], [3], Addressing.directIndexedWithX);

        this.opcodes[0x20] = new JSR([6], [3], Addressing.directIndexedWithX);
        this.opcodes[0x22] = new JSR([8], [4], Addressing.directIndexedWithX);
        this.opcodes[0xFC] = new JSR([8], [3], Addressing.directIndexedWithX);

        this.opcodes[0xA1] = new LDA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA3] = new LDA([4, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA5] = new LDA([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA7] = new LDA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xA9] = new LDA([2, 1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0xAD] = new LDA([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0xAF] = new LDA([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0xB1] = new LDA([5, 1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB2] = new LDA([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB3] = new LDA([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB5] = new LDA([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB7] = new LDA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xB9] = new LDA([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xBD] = new LDA([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xBF] = new LDA([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0xA2] = new LDX([2, 8], [2, 10], Addressing.directIndexedWithX);
        this.opcodes[0xA6] = new LDX([3, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xAE] = new LDX([4, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xB6] = new LDX([4, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xBE] = new LDX([4, 3, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xA0] = new LDY([2, 8], [2, 14], Addressing.directIndexedWithX);
        this.opcodes[0xA4] = new LDY([3, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xAC] = new LDY([4, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0xB4] = new LDY([4, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0xBC] = new LDY([4, 3, 8], [3], Addressing.directIndexedWithX);

        this.opcodes[0x46] = new LSR([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x4A] = new LSR([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x4E] = new LSR([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x56] = new LSR([6, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x5E] = new LSR([7, 4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x54] = new MVN([1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x44] = new MVP([1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xEA] = new NOP([2], [1], Addressing.directIndexedWithX);

        this.opcodes[0x01] = new ORA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x03] = new ORA([4, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x05] = new ORA([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x07] = new ORA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x09] = new ORA([2, 1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0x0D] = new ORA([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x0F] = new ORA([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x11] = new ORA([5, 1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x12] = new ORA([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x13] = new ORA([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x15] = new ORA([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x17] = new ORA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x19] = new ORA([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x1D] = new ORA([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x1F] = new ORA([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0xF4] = new PEA([5], [3], Addressing.directIndexedWithX);
        this.opcodes[0xD4] = new PEI([6, 2], [6, 2], Addressing.directIndexedWithX);
        this.opcodes[0x62] = new PER([6], [3], Addressing.directIndexedWithX);
        this.opcodes[0x48] = new PHA([3, 1], [1], Addressing.directIndexedWithX);
        this.opcodes[0x8B] = new PHB([3], [1], Addressing.directIndexedWithX);
        this.opcodes[0x0B] = new PHD([4], [1], Addressing.directIndexedWithX);
        this.opcodes[0x4B] = new PHK([3], [1], Addressing.directIndexedWithX);
        this.opcodes[0x08] = new PHP([3], [1], Addressing.directIndexedWithX);
        this.opcodes[0xDA] = new PHX([3, 8], [1], Addressing.directIndexedWithX);
        this.opcodes[0x5A] = new PHY([3, 8], [1], Addressing.directIndexedWithX);

        this.opcodes[0x68] = new PLA([4, 1], [1], Addressing.directIndexedWithX);
        this.opcodes[0xAB] = new PLB([4], [1], Addressing.directIndexedWithX);
        this.opcodes[0x2B] = new PLD([5], [1], Addressing.directIndexedWithX);
        this.opcodes[0x28] = new PLP([4], [1], Addressing.directIndexedWithX);
        this.opcodes[0xFA] = new PLX([4, 8], [1], Addressing.directIndexedWithX);
        this.opcodes[0x7A] = new PLY([4, 8], [1], Addressing.directIndexedWithX);

        this.opcodes[0xC2] = new REP([3], [2], Addressing.directIndexedWithX);
        this.opcodes[0x26] = new REP([5, 2, 4], [2], Addressing.directIndexedWithX);

        this.opcodes[0x2A] = new ROL([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x2E] = new ROL([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x36] = new ROL([6, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x3E] = new ROL([7, 4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x66] = new ROR([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x6A] = new ROR([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x6E] = new ROR([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x76] = new ROR([6, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x7E] = new ROR([7, 4], [3], Addressing.directIndexedWithX);

        this.opcodes[0x40] = new RTI([6, 7], [1], Addressing.directIndexedWithX);
        this.opcodes[0x6B] = new RTL([6], [1], Addressing.directIndexedWithX);
        this.opcodes[0x60] = new RTS([6], [1], Addressing.directIndexedWithX);

        this.opcodes[0xE1] = new SBC([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE3] = new SBC([4, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE5] = new SBC([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE7] = new SBC([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xE9] = new SBC([2, 1], [2, 12], Addressing.directIndexedWithX);
        this.opcodes[0xED] = new SBC([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0xEF] = new SBC([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0xF1] = new SBC([5, 1, 2, 3], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF2] = new SBC([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF3] = new SBC([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF5] = new SBC([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF7] = new SBC([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0xF9] = new SBC([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xFD] = new SBC([4, 1, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0xFF] = new SBC([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0x38] = new SEC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xF8] = new SED([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x78] = new SEI([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xE2] = new SEP([3], [2], Addressing.directIndexedWithX);

        this.opcodes[0x81] = new STA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x83] = new STA([4, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x85] = new STA([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x87] = new STA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x8D] = new STA([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x8F] = new STA([5, 1], [4], Addressing.directIndexedWithX);
        this.opcodes[0x91] = new STA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x92] = new STA([5, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x93] = new STA([7, 1], [2], Addressing.directIndexedWithX);
        this.opcodes[0x95] = new STA([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x97] = new STA([6, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x99] = new STA([5, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x9D] = new STA([5, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x9F] = new STA([5, 1], [4], Addressing.directIndexedWithX);

        this.opcodes[0xDB] = new STP([3, 9], [1], Addressing.directIndexedWithX);
        this.opcodes[0x86] = new STX([3, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0x8E] = new STX([4, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0x96] = new STX([4, 2, 8], [2], Addressing.directIndexedWithX);

        this.opcodes[0x84] = new STY([3, 2, 8], [2], Addressing.directIndexedWithX);
        this.opcodes[0x8C] = new STY([4, 8], [3], Addressing.directIndexedWithX);
        this.opcodes[0x94] = new STY([4, 2, 8], [2], Addressing.directIndexedWithX);

        this.opcodes[0x64] = new STZ([3, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x74] = new STZ([4, 1, 2], [2], Addressing.directIndexedWithX);
        this.opcodes[0x9C] = new STZ([4, 1], [3], Addressing.directIndexedWithX);
        this.opcodes[0x9E] = new STZ([5, 1], [3], Addressing.directIndexedWithX);

        this.opcodes[0xAA] = new TAX([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xA8] = new TAY([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x5B] = new TCD([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x1B] = new TCS([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x7B] = new TDC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x14] = new TRB([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x1C] = new TRB([6, 3], [3], Addressing.directIndexedWithX);
        this.opcodes[0x04] = new TSB([5, 2, 4], [2], Addressing.directIndexedWithX);
        this.opcodes[0x0C] = new TSB([6, 4], [3], Addressing.directIndexedWithX);
        this.opcodes[0x3B] = new TSC([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xBA] = new TSX([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x8A] = new TXA([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x9A] = new TXS([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x9B] = new TXY([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0x98] = new TYA([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xBB] = new TYX([2], [1], Addressing.directIndexedWithX);
        this.opcodes[0xCB] = new WAI([3, 10], [1], Addressing.directIndexedWithX);
        this.opcodes[0x42] = new WDM([0, 10], [2], Addressing.directIndexedWithX);
        this.opcodes[0xEB] = new XBA([1, 3], [1], Addressing.directIndexedWithX);
        this.opcodes[0xFB] = new XCE([1, 2], [1], Addressing.directIndexedWithX);

    }

    public get(code: number): Opcode {
        if (code < 0 || code > this.opcodes.length) {
            this.Log.warn("got invalid opcode: " + code);
            return null;
        }
        let opcode: Opcode = this.opcodes[code];
        if (opcode == null) {
            this.Log.warn("got null opcode: " + code);
            return null;
        }

        return opcode;
    }
}
