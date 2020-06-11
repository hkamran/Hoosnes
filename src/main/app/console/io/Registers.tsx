import {Console} from "../Console";
import {DmaChannel, DmaEnableRegister} from "../cpu/Dma";
import {HdmaEnableRegister} from "../cpu/Hdma";
import {Bit} from "../../util/Bit";
import {ScreenRegion} from "../ppu/Screen";
import {joy1, joy2} from "../controller/Controller";
import {Register} from "../cpu/Registers";

export class InterruptEnableFlagsRegister extends Register {

    public address: string = "4200";
    public name: string = "NMITIMEN";

    public nmiEnable: boolean = false;
    public irqMode: number = 0;
    public autoJoypadEnable: boolean = false;

    public set(val: number) {
        super.set(val);

        this.nmiEnable = (this.val & 0x80) > 0;
        this.irqMode = (this.val & 0x30) >> 4;
        this.autoJoypadEnable = (this.val & 0x1) > 0;
    }

}

export class NmiFlagRegister extends Register {

    public address: string = "4210";
    public name: string = "RDNMI";

    public nmiFlag: boolean = false;

    public setNMIFlag(flag: boolean) {
        this.nmiFlag = flag;
    }

    public get(): number {
        let result = 2; // 5A22 Version
        result |= (this.nmiFlag ? 1 : 0) << 7;

        this.setNMIFlag(false);
        return result;
    }

}

export class HorizontalTimeRegister extends Register {

    public address: string = "4207-4208";
    public name: string = "VTIME";

    public setLower(val: number) {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public setUpper(val: number) {
        this.val = Bit.setUint16Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
    }
}

export class VerticalTimeRegister extends Register {

    public address: string = "4209-420A";
    public name: string = "VTIME";

    public setLower(val: number) {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public setUpper(val: number) {
        this.val = Bit.setUint16Upper(this.val, val & 0x100);
    }

    public getLower(): number {
        return Bit.getUint16Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.val);
    }
}

export class TimeUpRegister extends Register {

    public address: string = "4211";
    public name: string = "TIMEUP";
    private console: Console;

    public irqFlag: boolean = false;

    constructor(console: Console) {
        super();
        this.console = console;
    }

    public setIRQFlag(flag: boolean) {
        this.irqFlag = flag;
    }

    public get(): number {
        let result = 0;
        result |= (this.irqFlag ? 1 : 0) << 7;

        this.irqFlag = false;
        return result;
    }

}

export class WramMemoryAddressRegister extends Register {

    public address: string = "0x2181-0x2183";
    public name: string = "WMADD";

    public setLower(val: number) {
        this.val = Bit.setUint24Lower(this.val, val);
    }

    public setMiddle(val: number) {
        this.val = Bit.setUint24Middle(this.val, val);
    }

    public setUpper(val: number) {
        this.val = Bit.setUint24Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint24Lower(this.val);
    }

    public getMiddle(): number {
        return Bit.getUint24Middle(this.val);
    }

    public getUpper(): number {
        return Bit.getUint24Upper(this.val);
    }
}

export class WramMemoryDataRegister extends Register {

    public address: string = "0x2180";
    public name: string = "WMDATA";

    public set(val: number) {
        throw new Error("Not Implemented!");
    }

    public get(): number {
        throw new Error("Not Implemented!");
    }

}

export class HvBStatusRegister extends Register {

    private console: Console;

    constructor(console: Console) {
        super();
        this.console = console;
    }


    public address: string = "0x4212";
    public name: string = "HVBJOY";

    public val: number = 0x1;
//     Joypad automatic scanning flag
//
// - Bit 0 of $4212 is set at line $00E1 and cleared at line $00E4 in 224-line
//     mode.
//
// - Bit 0 of $4212 is set at line $00F0 and cleared at line $00F3 in 239-line
//     mode.
    public setVBlankFlag(val: boolean): void {
        if (val) {
            this.val = this.val | 0x80;
        } else {
            this.val = this.val & 0x7F;
        }
    }

    public setHBlankFlag(val: boolean): void {
        if (val) {
            this.val = this.val | 0x40;
        } else {
            this.val = this.val & 0xBF;
        }
    }

    public setJoypadFlag(val: boolean): void {
        if (val) {
            this.val |= 0x1;
        } else {
            this.val &= 0x0;
        }
    }

    public get(): number {
        let result = super.get();

        let cycle = this.console.ppu.cycle;
        let scanline = this.console.ppu.scanline;

        if (cycle < ScreenRegion.HORT_BLANK.end || cycle > ScreenRegion.HORT_BLANK.start) {
            result |= 0x40;
        }

        if (scanline > ScreenRegion.VERT_BLANK.start) {
            result |= 0x80;
        }

        return result;
    }

}

export class OldJoy1Register extends Register {

    public address: string = "0x4016";
    public name: string = "JOY1";

    public get(): number {
        return joy1.readByte();
    }

    public set(value: number): void {
        joy1.writeByte(0, value);
    }

}

export class OldJoy2Register extends Register {

    public address: string = "0x4017";
    public name: string = "JOY2";

    public get(): number {
        return joy2.readByte();
    }

    public set(value: number): void {
        joy2.writeByte(0, value);
    }

}

export class Joy1Register extends Register {

    public address: string = "0x4218-0x4219";
    public name: string = "JOY1";

    public value: number = 0;

    public getLower(): number {
        return Bit.getUint16Lower(this.value);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.value);
    }

    public setUpper(value: number) {
        this.value = Bit.setUint16Upper(this.value, value);
    }

    public setLower(value: number) {
        this.value = Bit.setUint16Lower(this.value, value);
    }

}

export class Joy2Register extends Register {

    public address: string = "0x421A-0x421B";
    public name: string = "JOY2";

    public value: number = 0;

    public getLower(): number {
        return Bit.getUint16Lower(this.value);
    }

    public getUpper(): number {
        return Bit.getUint16Upper(this.value);
    }

    public setUpper(value: number) {
        this.value = Bit.setUint16Upper(this.value, value);
    }

    public setLower(value: number) {
        this.value = Bit.setUint16Lower(this.value, value);
    }

}

export class Registers {
    public nmitimen : InterruptEnableFlagsRegister;
    public wrio : Register;
    public wrmpya : Register;
    public wrmpyb : Register;
    public wrdivl : Register;
    public wrdivh : Register;
    public wrdivb : Register;
    public htime : HorizontalTimeRegister;
    public vtime : VerticalTimeRegister;
    public memsel : Register;
    public rdnmi : NmiFlagRegister;
    public timeup : TimeUpRegister;
    public hvbjoy : HvBStatusRegister;
    public rdio : Register;
    public rddivl : Register;
    public rddivh : Register;
    public rdmpyl : Register;
    public rdmpyh : Register;


    public oldJoy1 : OldJoy1Register;
    public oldJoy2 : OldJoy2Register;

    public joy1 : Joy1Register;
    public joy2 : Joy2Register;
    public joy3l : Register;
    public joy3h : Register;
    public joy4l : Register;
    public joy4h : Register;

    public wmdata : WramMemoryDataRegister;
    public wmadd : WramMemoryAddressRegister;

    public dma0: DmaChannel;
    public dma1: DmaChannel;
    public dma2: DmaChannel;
    public dma3: DmaChannel;
    public dma4: DmaChannel;
    public dma5: DmaChannel;
    public dma6: DmaChannel;
    public dma7: DmaChannel;
    public mdmaen: DmaEnableRegister;
    public hdmaen : HdmaEnableRegister;

    constructor(console: Console) {

        this.nmitimen = new InterruptEnableFlagsRegister();
        this.wrio = new Register();
        this.wrmpya = new Register();
        this.wrmpyb = new Register();
        this.wrdivl = new Register();
        this.wrdivh = new Register();
        this.wrdivb = new Register();
        this.htime = new HorizontalTimeRegister();
        this.vtime = new VerticalTimeRegister();
        this.memsel = new Register();
        this.rdnmi = new NmiFlagRegister();
        this.timeup = new TimeUpRegister(console);
        this.hvbjoy = new HvBStatusRegister(console);
        this.rdio = new Register();
        this.rddivl = new Register();
        this.rddivh = new Register();
        this.rdmpyl = new Register();
        this.rdmpyh = new Register();

        this.oldJoy1 = new OldJoy1Register();
        this.oldJoy2 = new OldJoy2Register();

        this.joy1 = new Joy1Register();
        this.joy2 = new Joy2Register();
        this.joy3l = new Register();
        this.joy3h = new Register();
        this.joy4l = new Register();
        this.joy4h = new Register();

        this.wmdata = new WramMemoryDataRegister();
        this.wmadd = new WramMemoryAddressRegister();

        this.dma0 = new DmaChannel(console, 0);
        this.dma1 = new DmaChannel(console, 1);
        this.dma2 = new DmaChannel(console, 2);
        this.dma3 = new DmaChannel(console, 3);
        this.dma4 = new DmaChannel(console, 4);
        this.dma5 = new DmaChannel(console, 5);
        this.dma6 = new DmaChannel(console, 6);
        this.dma7 = new DmaChannel(console, 7);

        this.mdmaen = new DmaEnableRegister(console, [
            this.dma0,
            this.dma1,
            this.dma2,
            this.dma3,
            this.dma4,
            this.dma5,
            this.dma6,
            this.dma7,
        ]);
        this.hdmaen = new HdmaEnableRegister(console);
    }

}