import {Register} from "./Register";
import {Mode, Modes} from "../Modes";

export class StatusRegister extends Register {

    public getC() : number {
        return 0;
    }

    public getZ() : number {
        return 0;
    }

    public getIRQ() : number {
        return 0;
    }

    public getD() : number {
        return 0;
    }

    public getX() : number {
        return 0;
    }

    public getM() : number {
        return 0;
    }

    public getV() : number {
        return 0;
    }

    public getN() : number {
        return 0;
    }

}

export class Registers {

    p : StatusRegister = new StatusRegister(Modes.bit8);
    a : Register = new Register(Modes.bit16);
    x : Register = new Register(Modes.bit16);
    y : Register = new Register(Modes.bit8);
    sp : Register = new Register(Modes.bit16);
    dp : Register = new Register(Modes.bit16);
    pc : Register = new Register(Modes.bit8);
    pb : Register = new Register(Modes.bit8);
    e : Register = new Register(Modes.bit8);

    public setMode(mode : Mode) {
        this.a.setMode(mode);
        this.x.setMode(mode);
        this.y.setMode(mode);
    }

}