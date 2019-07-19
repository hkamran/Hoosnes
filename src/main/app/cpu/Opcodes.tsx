import {Log} from "typescript-logger";

export class Opcode {

}

export class Opcodes {

    public Log = Log.create('Opcodes');

    private opcodes : Map<number, Opcode>;

    constructor() {

    }

    public get(code : number) : Opcode {
        let opcode : Opcode = this.opcodes.get(code);
        if (opcode == null) {
            this.Log.warn("got null opcode: " + code);
        }
        return opcode;
    }


}