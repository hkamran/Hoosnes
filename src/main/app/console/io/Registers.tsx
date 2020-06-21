import {Console} from "../Console";
import {DmaChannel, DmaEnableRegister} from "../cpu/Dma";
import {HdmaEnableRegister} from "../cpu/Hdma";
import {ScreenRegion} from "../ppu/Screen";
import {joy1, joy2} from "../controller/Controller";
import {AbstractRegister} from "../../interfaces/AbstractRegister";
import {Bit} from "../../util/Bit";

export class DebugAbstractRegister extends AbstractRegister {

    public set(value: number, byteIndex?: number) {
        super.set(value, byteIndex);
        debugger;
    }

    public get(byteIndex?: number): number {
        debugger;
        return super.get(byteIndex);
    }

}

export class InterruptEnableFlagsRegister extends AbstractRegister {

    public address: string = "4200";
    public name: string = "NMITIMEN";

    public set(val: number) {
        super.set(val);

        this.console.io.nmiEnable = (val & 0x80) > 0;
        this.console.io.irqMode = (val & 0x30) >> 4;
        this.console.io.autoJoypadEnable = (val & 0x1) > 0;
    }

    public getNmiEnable(): boolean {
        return this.console.io.nmiEnable;
    }

    public getAutoJoypadEnable(): boolean {
        return this.console.io.nmiEnable;
    }

    public getIRQMode(): number {
        return this.console.io.irqMode;
    }
}

export class NmiFlagRegister extends AbstractRegister {

    public address: string = "4210";
    public name: string = "RDNMI";

    public setNmiStatus(flag: boolean) {
        this.console.io.nmiStatus = flag;
    }

    public get(): number {
        let open = this.console.bus.mdr & 0xF8;
        let result = this.console.io.chip5A22Version | open;
        result |= (this.console.io.nmiStatus ? 1 : 0) << 7;

        this.console.io.nmiStatus = false;
        return result;
    }

}

/**
 * This bit is set just after an IRQ fires (at the moment, it seems to have the same delay as the NMI Flag of $4210 has following NMI),
 * and is cleared on read or write. Supposedly, it is required that this register be read during the IRQ handler.
 * If this really is the case, then I suspect that that read is what actually clears the CPU's IRQ line. This register
 * is marked read/write in another doc, with no explanation. IRQ is cleared on power on or reset.
 */
export class TimeUpRegister extends AbstractRegister {

    public address: string = "4211";
    public name: string = "TIMEUP";

    public irqFlag: boolean = false;

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

export class WramMemoryAddressRegister extends AbstractRegister {

    public address: string = "0x2181-0x2183";
    public name: string = "WMADD";

    public setLower(val: number): void {
        this.set(val, 0);
    }

    public setMiddle(val: number) {
        this.set(val, 1);
    }

    public setUpper(val: number) {
        this.set(val, 2);
    }

    public getLower(): number {
        return this.get(0);
    }

    public getMiddle(): number {
        return this.get(1);
    }

    public getUpper(): number {
        return this.get(2);
    }
}

export class WramMemoryDataRegister extends AbstractRegister {

    public address: string = "0x2180";
    public name: string = "WMDATA";

    public set(val: number) {
        throw new Error("Not Implemented!");
    }

    public get(): number {
        throw new Error("Not Implemented!");
    }

}

export class HvBStatusRegister extends AbstractRegister {

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

export class OldJoy1Register extends AbstractRegister {

    public address: string = "0x4016";
    public name: string = "JOY1";

    public get(): number {
        return joy1.readByte();
    }

    public set(value: number): void {
        joy1.writeByte(0, value);
    }

}

export class OldJoy2Register extends AbstractRegister {

    public address: string = "0x4017";
    public name: string = "JOY2";

    public get(): number {
        return joy2.readByte();
    }

    public set(value: number): void {
        joy2.writeByte(0, value);
    }

}

export class Joy1Register extends AbstractRegister {

    public address: string = "0x4218-0x4219";
    public name: string = "JOY1";

    public getLower(): number {
        return this.get(0);
    }

    public getUpper(): number {
        return this.get(1);
    }

    public setUpper(value: number) {
        this.set(value, 1);
    }

    public setLower(value: number) {
        this.set(value, 0);
    }

}

export class Joy2Register extends AbstractRegister {

    public address: string = "0x421A-0x421B";
    public name: string = "JOY2";

    public getLower(): number {
        return this.get(0);
    }

    public getUpper(): number {
        return this.get(1);
    }

    public setUpper(value: number) {
        this.set(value, 1);
    }

    public setLower(value: number) {
        this.set(value, 0);
    }

}

export class MemSelectRegister extends AbstractRegister {

    public address: string = "0x420D";
    public name: string = "MEMSEL";

    private isFast: boolean = false;

    public set(value: number, byteIndex?: number) {
        super.set(value, byteIndex);

        this.isFast = (value & 1) == 1;
    }

}

export class MultiplicandARegister extends AbstractRegister {

    public address: string = "0x4202";
    public name: string = "WRMPYA";

}

export class MultiplicandBRegister extends AbstractRegister {

    public address: string = "0x4203";
    public name: string = "WRMPYB";

    public set(value: number, byteIndex?: number) {
        super.set(value, byteIndex);

        const a = this.console.io.registers.wrmpya.get();
        const b = value;
        const result = (a * b) & 0xFFFF;

        const high = Bit.getUint16Upper(result);
        const low = Bit.getUint16Lower(result);

        this.console.io.registers.rdmpyl.set(low);
        this.console.io.registers.rdmpyh.set(high);

        this.console.io.registers.rddivl.set(value);
        this.console.io.registers.rddivh.set(0x00);
    }

}

export class MultiOrDivideRemainderLowRegister extends AbstractRegister {

    public address: string = "0x4216";
    public name: string = "RDMPYL";

}

export class MultiOrDivideRemainderHighRegister extends AbstractRegister {

    public address: string = "0x4217";
    public name: string = "RDMPYL";

}

export class DividendCLowRegister extends AbstractRegister {

    public address: string = "0x4204";
    public name: string = "WRDIVL";

}

export class DividendCHighRegister extends AbstractRegister {

    public address: string = "0x4205";
    public name: string = "WRDIVH";

}

export class QuotientDivideLowRegister extends AbstractRegister {

    public address: string = "0x4214";
    public name: string = "RDDIVL";

}

export class QuotientDivideHighRegister extends AbstractRegister {

    public address: string = "0x4215";
    public name: string = "RDDIVH";

}

export class DivisorBRegister extends AbstractRegister {

    public address: string = "0x4206";
    public name: string = "WRDIVB";

    public set(value: number, byteIndex?: number) {
        super.set(value, byteIndex);

        const divisor = value;
        const dividend = Bit.toUint16(
            this.console.io.registers.wrdivh.get(),
            this.console.io.registers.wrdivl.get(),
        );

        let quotient = 0xFFFF;
        let remainder = dividend;

        if (value != 0) {
            quotient = Math.floor(dividend / divisor);
            remainder = dividend % divisor;
        }

        const quotientHigh = Bit.getUint16Upper(quotient);
        const quotienLow = Bit.getUint16Lower(quotient);

        const remainderHigh = Bit.getUint16Upper(remainder);
        const remainderLow = Bit.getUint16Lower(remainder);

        this.console.io.registers.rddivl.set(quotienLow);
        this.console.io.registers.rddivh.set(quotientHigh);

        this.console.io.registers.rdmpyl.set(remainderLow);
        this.console.io.registers.rdmpyh.set(remainderHigh);
    }

}

export class Registers {
    public nmitimen : InterruptEnableFlagsRegister;
    public rdnmi : NmiFlagRegister;
    public timeup : TimeUpRegister;
    public hvbjoy : HvBStatusRegister;

    public oldJoy1 : OldJoy1Register;
    public oldJoy2 : OldJoy2Register;

    public joy1 : Joy1Register;
    public joy2 : Joy2Register;

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

    public wrio : AbstractRegister;
    public wrmpya : AbstractRegister;
    public wrmpyb : AbstractRegister;
    public wrdivl : AbstractRegister;
    public wrdivh : AbstractRegister;
    public wrdivb : AbstractRegister;
    public htime : AbstractRegister;
    public vtime : AbstractRegister;
    public memsel : AbstractRegister;
    public rdio : AbstractRegister;
    public rddivl : AbstractRegister;
    public rddivh : AbstractRegister;
    public rdmpyl : AbstractRegister;
    public rdmpyh : AbstractRegister;

    public joy3l : AbstractRegister;
    public joy3h : AbstractRegister;
    public joy4l : AbstractRegister;
    public joy4h : AbstractRegister;

    constructor(console: Console) {

        this.nmitimen = new InterruptEnableFlagsRegister(console);
        this.rdnmi = new NmiFlagRegister(console);
        this.timeup = new TimeUpRegister(console);
        this.hvbjoy = new HvBStatusRegister(console);

        this.oldJoy1 = new OldJoy1Register(console);
        this.oldJoy2 = new OldJoy2Register(console);

        this.joy1 = new Joy1Register(console);
        this.joy2 = new Joy2Register(console);

        this.wmdata = new WramMemoryDataRegister(console);
        this.wmadd = new WramMemoryAddressRegister(console);

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

        this.wrmpya = new MultiplicandARegister(console);
        this.wrmpyb = new MultiplicandBRegister(console);

        this.rdmpyl = new MultiOrDivideRemainderLowRegister(console);
        this.rdmpyh = new MultiOrDivideRemainderHighRegister(console);
        this.rddivl = new QuotientDivideLowRegister(console);
        this.rddivh = new QuotientDivideHighRegister(console);

        this.wrdivl = new DividendCLowRegister(console);
        this.wrdivh = new DividendCHighRegister(console);
        this.wrdivb = new DivisorBRegister(console);

        // TODO make use of it
        this.memsel = new MemSelectRegister(console);

        // TODO do it
        this.wrio = new AbstractRegister(console);
        this.htime = new AbstractRegister(console);
        this.vtime = new AbstractRegister(console);
        this.rdio = new AbstractRegister(console);
        this.joy3l = new AbstractRegister(console);
        this.joy3h = new AbstractRegister(console);
        this.joy4l = new AbstractRegister(console);
        this.joy4h = new AbstractRegister(console);
    }

}