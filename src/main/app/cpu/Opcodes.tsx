import {Log, Level} from 'typescript-logger/build/index';
import {Cpu} from './Cpu';
import {Memory} from "../Memory";
import {Mode} from "../Modes";
import {Addressing} from "./Addressing";

export class OpState {

}

export class Opcode {
    public name : string;
    public cycles : number[];
    public size : number[];
    public mode : Addressing;

    constructor(cycles : number[], size : number[], mode : Addressing) {
        this.cycles  = cycles;
        this.mode = mode;
        this.size = size;
    }

    public execute(state : OpState) : number {
        return -1;
    }
}

export class ADC extends Opcode {
    public name : string = "ADC";
}

export class AND extends Opcode {
    public name : string = "AND";
}

export class ASL extends Opcode {
    public name : string = "ASL";
}

export class BCC extends Opcode {
    public name : string = "BCC";
}

export class BCS extends Opcode {
    public name : string = "BCS";
}

export class BEQ extends Opcode {
    public name : string = "BEQ";
}

export class BIT extends Opcode {
    public name : string = "BIT";
}

class BMI extends Opcode {

}

class BNE extends Opcode {


}

class BPL extends Opcode {

}

class CMP extends Opcode {

}

class COP extends Opcode {

}

class CPX extends Opcode {

}

class CPY extends Opcode {


}

class CLC extends Opcode {


}

class CLD extends Opcode {

}

class CLI extends Opcode {

}

class CLV extends Opcode {


}

class BRA extends Opcode {


}

class BRK extends Opcode {

}

class BVS extends Opcode {

}

class BVC extends Opcode {

}

class BRL extends Opcode {

}

class DEC extends Opcode {

}

class DEX extends Opcode {


}

class DEY extends Opcode {


}

class EOR extends Opcode {


}

class INC extends Opcode {


}

class INY extends Opcode {


}

class XCE extends Opcode {


}

class XBA extends Opcode {

}

class WDM extends Opcode {


}

class WAI extends Opcode {


}

class TYX extends Opcode {


}

class TYA extends Opcode {

}

class TXY extends Opcode {


}

class TAX extends Opcode {


}

class TAY extends Opcode {

}

class TCD extends Opcode {


}

class TCS extends Opcode {


}

class TDC extends Opcode {


}

class TRB extends Opcode {


}

class TXS extends Opcode {

}

class TSB extends Opcode {


}

class TXA extends Opcode {

}

class TSX extends Opcode {


}

class TSC extends Opcode {


}

class STZ extends Opcode {


}

export class Opcodes {

    public Log = Log.create('Opcodes');

    private opcodes : Map<number, Opcode> = new Map<number, Opcode>();

    constructor() {

        this.opcodes.set(0x61, new ADC([1, 2, 3], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x63, new ADC([4, 1], [2], Addressing.stackRelative));
        this.opcodes.set(0x65, new ADC([4, 1], [2], Addressing.direct));
        this.opcodes.set(0x67, new ADC([6, 1, 2], [2], Addressing.directIndirectIndexedLong));
        this.opcodes.set(0x69, new ADC([2, 1], [2, 12], Addressing.immediate));
        this.opcodes.set(0x6D, new ADC([4, 1], [3], Addressing.absolute));
        this.opcodes.set(0x6D, new ADC([5, 1], [4], Addressing.absoluteLong));
        this.opcodes.set(0x71, new ADC([5, 1, 2, 3], [2], Addressing.absoluteLong));
        this.opcodes.set(0x73, new ADC([7, 1], [2], Addressing.directIndexedWithY));
        this.opcodes.set(0x75, new ADC([4, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x77, new ADC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x79, new ADC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x7D, new ADC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x7F, new ADC([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x21, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x23, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x25, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x27, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x29, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x2D, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x2F, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x31, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x32, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x33, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x35, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x37, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x39, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x3D, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x3F, new AND([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x06, new ASL([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x0A, new ASL([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x0E, new ASL([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x16, new ASL([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x1E, new ASL([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x90, new BCC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xB0, new BCS([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xF0, new BEQ([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x24, new BIT([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x2C, new BIT([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x34, new BIT([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x3C, new BIT([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x89, new BIT([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x30, new BMI([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD0, new BNE([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x10, new BPL([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x80, new BRA([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x00, new BRK([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x82, new BRL([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x50, new BVC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x70, new BVS([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x18, new CLC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD8, new CLD([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x58, new CLI([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xB8, new CLV([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0xC1, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC3, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC5, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC7, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC9, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xCD, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xCF, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD1, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD2, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD3, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD5, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD7, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD9, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xDD, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xDF, new CMP([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x02, new COP([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0xE0, new CPX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xE4, new CPX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xEC, new CPX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC0, new CPY([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC4, new CPY([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xCC, new CPY([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x3A, new DEC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC6, new DEC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xCE, new DEC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xD6, new DEC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xDE, new DEC([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0xCA, new DEX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x88, new DEY([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x41, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x43, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x45, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x47, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x49, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x4D, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x4F, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x41, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x51, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x52, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x53, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x55, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x57, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x59, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x5D, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x5F, new EOR([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0x5F, new INC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xE6, new INC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xEE, new INC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xF6, new INC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xFE, new INC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xC8, new INY([6, 1, 2], [2], Addressing.directIndexedWithX));




        this.opcodes.set(0x64, new STZ([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x74, new STZ([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x9C, new STZ([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x9E, new STZ([6, 1, 2], [2], Addressing.directIndexedWithX));

        this.opcodes.set(0xAA, new TAX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xA8, new TAY([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x5B, new TCD([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x1B, new TCS([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x7B, new TDC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x14, new TRB([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x1C, new TRB([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x04, new TSB([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x0C, new TSB([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x3B, new TSC([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xBA, new TSX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x8A, new TXA([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x9A, new TXS([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x9B, new TXY([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x98, new TYA([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xBB, new TYX([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xCB, new WAI([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0x42, new WDM([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xEB, new XBA([6, 1, 2], [2], Addressing.directIndexedWithX));
        this.opcodes.set(0xFB, new XCE([6, 1, 2], [2], Addressing.directIndexedWithX));

    }

    public get(code : number) : Opcode {
        let opcode : Opcode = this.opcodes.get(code);
        if (opcode == null) {
            this.Log.warn("got null opcode: " + code);
        }
        return opcode;
    }
}
