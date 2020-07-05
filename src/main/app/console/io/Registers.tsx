import {Console} from "../Console";
import {DmaChannel, DmaEnableRegister} from "../cpu/Dma";
import {HdmaEnableRegister} from "../cpu/Hdma";
import {ScreenRegion} from "../ppu/Screen";
import {joy1, joy2} from "../controller/Controller";
import {AbstractRegister} from "../../interfaces/AbstractRegister";
import {Bit} from "../../util/Bit";

// export class DebugAbstractRegister extends AbstractRegister {
//
//     public set(value: number, byteIndex?: number) {
//         super.set(value, byteIndex);
//         debugger;
//     }
//
//     public get(byteIndex?: number): number {
//         debugger;
//         return super.get(byteIndex);
//     }
//
// }

export class InterruptEnableFlagsRegister extends AbstractRegister {

    public address = 0x4200;
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

    public address = 0x4210;
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

    public address = 0x4211;
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

export class WramMemoryLowAddressRegister extends AbstractRegister {

    public address = 0x2181;
    public name: string = "WMADDL";
}

export class WramMemoryMidAddressRegister extends AbstractRegister {

    public address = 0x2182;
    public name: string = "WMADDM";
}

export class WramMemoryHighAddressRegister extends AbstractRegister {

    public address = 0x2183;
    public name: string = "WMADDH";
}

export class WramMemoryDataRegister extends AbstractRegister {

    public address = 0x2180;
    public name: string = "WMDATA";

    public set(value: number, byteIndex?: number) {
        const registers = this.console.io.registers;

        const wmaddh = registers.wmaddh;
        const wmaddm = registers.wmaddm;
        const wmaddl = registers.wmaddl;

        let offset = Bit.toUint24(wmaddh.get(), wmaddm.get(), wmaddl.get());
        const address = 0x7E0000 + offset;
        this.console.cpu.wram.writeByte(address, value);
        offset++;

        wmaddh.set(Bit.getUint24Upper(offset));
        wmaddm.set(Bit.getUint24Middle(offset));
        wmaddl.set(Bit.getUint24Lower(offset) & 1);
    }

    public get(byteIndex?: number): number {
        const registers = this.console.io.registers;

        const wmaddh = registers.wmaddh;
        const wmaddm = registers.wmaddm;
        const wmaddl = registers.wmaddl;

        let offset = Bit.toUint24(wmaddh.get(), wmaddm.get(), wmaddl.get());
        const address = 0x7E0000 + offset;
        const value = this.console.cpu.wram.readByte(address);
        offset++;

        wmaddh.set(Bit.getUint24Upper(offset));
        wmaddm.set(Bit.getUint24Middle(offset));
        wmaddl.set(Bit.getUint24Lower(offset) & 1);

        return value;
    }

}

export class HvBStatusRegister extends AbstractRegister {

    public address = 0x4212;
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

    public address = 0x4016;
    public name: string = "JOY1";

    public get(): number {
        return joy1.readByte();
    }

    public set(value: number): void {
        joy1.writeByte(0, value);
    }

}

export class OldJoy2Register extends AbstractRegister {

    public address = 0x4017;
    public name: string = "JOY2";

    public get(): number {
        return joy2.readByte();
    }

    public set(value: number): void {
        joy2.writeByte(0, value);
    }

}

export class Joy1LRegister extends AbstractRegister {

    public address = 0x4218;
    public name: string = "JOY1L";

    public get(byteIndex?: number): number {
        return joy1.readByte(0);
    }

}

export class Joy1HRegister extends AbstractRegister {

    public address = 0x4219;
    public name: string = "JOY1H";

    public get(byteIndex?: number): number {
        return joy1.readByte(1);
    }
}

export class Joy2LRegister extends AbstractRegister {

    public address = 0x421A;
    public name: string = "JOY2L";

    public get(byteIndex?: number): number {
        return joy2.readByte(0);
    }

}

export class Joy2HRegister extends AbstractRegister {

    public address = 0x421B;
    public name: string = "JOY2H";

    public get(byteIndex?: number): number {
        return joy2.readByte(1);
    }

}


export class Joy3LRegister extends AbstractRegister {

    public address = 0x421C;
    public name: string = "JOY3L";

}

export class Joy3HRegister extends AbstractRegister {

    public address = 0x421D;
    public name: string = "JOY3H";

}

export class Joy4LRegister extends AbstractRegister {

    public address = 0x421E;
    public name: string = "JOY4L";

}

export class Joy4HRegister extends AbstractRegister {

    public address = 0x421F;
    public name: string = "JOY4H";

}

export class MemSelectRegister extends AbstractRegister {

    public address = 0x420D;
    public name: string = "MEMSEL";

    private isFast: boolean = false;

    public set(value: number, byteIndex?: number) {
        super.set(value, byteIndex);

        this.isFast = (value & 1) == 1;
    }

}

export class MultiplicandARegister extends AbstractRegister {

    public address = 0x4202;
    public name: string = "WRMPYA";

}

export class MultiplicandBRegister extends AbstractRegister {

    public address = 0x4203;
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

    public address = 0x4216;
    public name: string = "RDMPYL";

}

export class MultiOrDivideRemainderHighRegister extends AbstractRegister {

    public address = 0x4217;
    public name: string = "RDMPYH";

}

export class DividendCLowRegister extends AbstractRegister {

    public address = 0x4204;
    public name: string = "WRDIVL";

}

export class DividendCHighRegister extends AbstractRegister {

    public address = 0x4205;
    public name: string = "WRDIVH";

}

export class QuotientDivideLowRegister extends AbstractRegister {

    public address = 0x4214;
    public name: string = "RDDIVL";

}

export class QuotientDivideHighRegister extends AbstractRegister {

    public address = 0x4215;
    public name: string = "RDDIVH";

}

export class DivisorBRegister extends AbstractRegister {

    public address = 0x4206;
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

    public wmdata : WramMemoryDataRegister;
    public wmaddl : WramMemoryLowAddressRegister;
    public wmaddm : WramMemoryMidAddressRegister;
    public wmaddh : WramMemoryHighAddressRegister;

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

    public wrmpya : MultiplicandARegister;
    public wrmpyb : MultiplicandBRegister;
    public wrdivl : DividendCLowRegister;
    public wrdivh : DividendCHighRegister;
    public wrdivb : DivisorBRegister;
    public memsel : MemSelectRegister;
    public rddivl : QuotientDivideLowRegister;
    public rddivh : QuotientDivideHighRegister;
    public rdmpyl : MultiOrDivideRemainderLowRegister;
    public rdmpyh : MultiOrDivideRemainderHighRegister;

    public wrio : AbstractRegister;
    public rdio : AbstractRegister;
    public htime : AbstractRegister;
    public vtime : AbstractRegister;
    public joy1l : Joy1LRegister;
    public joy1h : Joy1HRegister;
    public joy2l : Joy2LRegister;
    public joy2h : Joy2HRegister;
    public joy3l : Joy3LRegister;
    public joy3h : Joy3HRegister;
    public joy4l : Joy4LRegister;
    public joy4h : Joy4HRegister;

    constructor(console: Console) {

        this.nmitimen = new InterruptEnableFlagsRegister(console);
        this.rdnmi = new NmiFlagRegister(console);
        this.timeup = new TimeUpRegister(console);
        this.hvbjoy = new HvBStatusRegister(console);

        this.oldJoy1 = new OldJoy1Register(console);
        this.oldJoy2 = new OldJoy2Register(console);

        this.joy1l = new Joy1LRegister(console);
        this.joy1h = new Joy1HRegister(console);
        this.joy2l = new Joy2LRegister(console);
        this.joy2h = new Joy2HRegister(console);
        this.joy3l = new Joy3LRegister(console);
        this.joy3h = new Joy3HRegister(console);
        this.joy4l = new Joy4LRegister(console);
        this.joy4h = new Joy4HRegister(console);

        this.wmdata = new WramMemoryDataRegister(console);
        this.wmaddl = new WramMemoryLowAddressRegister(console);
        this.wmaddm = new WramMemoryMidAddressRegister(console);
        this.wmaddh = new WramMemoryHighAddressRegister(console);

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
    }

    public reset(): void {
        this.nmitimen.reset();
        this.rdnmi.reset();
        this.timeup.reset();
        this.hvbjoy.reset();

        this.oldJoy1.reset();
        this.oldJoy2.reset();

        this.joy1l.reset();
        this.joy1h.reset();
        this.joy2l.reset();
        this.joy2h.reset();
        this.joy3l.reset();
        this.joy3h.reset();
        this.joy4l.reset();
        this.joy4h.reset();

        this.wmdata.reset();
        this.wmaddl.reset();
        this.wmaddm.reset();
        this.wmaddh.reset();

        this.dma0.reset();
        this.dma1.reset();
        this.dma2.reset();
        this.dma3.reset();
        this.dma4.reset();
        this.dma5.reset();
        this.dma6.reset();
        this.dma7.reset();

        this.mdmaen.reset();
        this.hdmaen.reset();

        this.wrmpya.reset();
        this.wrmpyb.reset();

        this.rdmpyl.reset();
        this.rdmpyh.reset();
        this.rddivl.reset();
        this.rddivh.reset();

        this.wrdivl.reset();
        this.wrdivh.reset();
        this.wrdivb.reset();

        this.memsel.reset();
        this.wrio.reset();
        this.htime.reset();
        this.vtime.reset();
        this.rdio.reset();
    }

}