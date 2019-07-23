import {Register} from "./Register";
import {Mode, Modes} from "../Modes";

export class StatusRegister extends Register {

    // Carry
    public getC() : number {
        return (this.val >> 0) & 0x1;
    }

    // Zero
    public getZ() : number {
        return (this.val >> 1) & 0x1;
    }

    // IRQ Disable
    public getI() : number {
        return (this.val >> 2) & 0x1;
    }

    // Decimal Mode
    public getD() : number {
        return (this.val >> 3) & 0x1;
    }

    // Break Flag
    public getX() : number {
        return (this.val >> 4) & 0x1;
    }

    // Unused (always 1)
    public getM() : number {
        return (this.val >> 5) & 0x1;
    }

    // Overflow
    public getV() : number {
        return (this.val >> 6) & 0x1;
    }

    // Negative
    public getN() : number {
        return (this.val >> 7) & 0x1;
    }

    // Setting

    // Carry
    public setC(value : number) : void {
        this.val &= ~(1 << 0);
        this.val |= value << 0;
    }

    // Zero
    public setZ(value : number) : void {
        this.val &= ~(1 << 1);
        this.val |= value << 1;
    }

    // IRQ Disable
    public setI(value : number) : void {
        this.val &= ~(1 << 2);
        this.val |= value << 2;
    }

    // Decimal Mode
    public setD(value : number) : void {
        this.val &= ~(1 << 3);
        this.val |= value << 3;
    }

    // Break Flag
    public setX(value : number) : void {
        this.val &= ~(1 << 4);
        this.val |= value << 4;
    }

    // Unused (always 1)
    public setM(value : number) : void {
        this.val &= ~(1 << 5);
        this.val |= value << 5;
    }

    // Overflow
    public setV(value : number) : void {
        this.val &= ~(1 << 6);
        this.val |= value << 6;
    }

    // Negative
    public setN(value : number) : void {
        this.val &= ~(1 << 7);
        this.val |= value << 7;
    }


}

export class Registers {

    public p : StatusRegister = new StatusRegister(Modes.bit8);
    public a : Register = new Register(Modes.bit16);
    public x : Register = new Register(Modes.bit16);
    public y : Register = new Register(Modes.bit8);
    public sp : Register = new Register(Modes.bit16);
    public dp : Register = new Register(Modes.bit16);
    public pc : Register = new Register(Modes.bit8);
    public pb : Register = new Register(Modes.bit8);
    public e : Register = new Register(Modes.bit8);

    public setMode(mode : Mode) {
        this.a.setMode(mode);
        this.x.setMode(mode);
        this.y.setMode(mode);
    }

}
