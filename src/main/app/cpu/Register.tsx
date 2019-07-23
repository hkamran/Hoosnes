import {Mode, Modes} from "../Modes";

export class Register {

    protected val : number;
    protected mode : Mode = Modes.bit8;

    constructor(mode: Mode) {
        this.mode = mode;
    }

    public set(val : number) : void {
        this.val = val & this.mode.mask;
    }

    public get() : number {
        return this.val & this.mode.mask;
    }

    public increment(val : number) : number {
        let maskedVal = val & this.mode.mask;
        this.val = (maskedVal + this.val) & this.mode.mask;
        return this.val;
    }

    public decrement(val : number) : number {
        return this.increment(-1 * val);
    }

    public setMode(mode : Mode) {
        this.mode = mode;
        this.val = this.val & mode.mask;
    }

    public getMode() : Mode {
        return this.mode;
    }

}

