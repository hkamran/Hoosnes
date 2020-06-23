import {Register} from "../ppu/Registers";
import {Bit} from "../../util/Bit";
import {Console} from "../Console";
import {
    HdmaLineCounterRegister,
    HdmaTableAddressHighRegister,
    HdmaTableAddressLowRegister,
    HdmaTableIndirectAddressRegister,
} from "./Hdma";
import {AbstractRegister} from "../../interfaces/AbstractRegister";

export enum DmaTransferType {
    CPU_TO_PPU, PPU_TO_CPU,
}

export enum DmaWriteMode {
    ONE_BYTE,
    TWO_BYTES_SEQUENCE,
    TWO_BYTES,
    TWO_WORDS,
    FOUR_BYTES_SEQUENCE,
}

export enum DmaAddressingMode {
    ABSOLUTE,
    INDIRECT,
}

export enum DmaAddressingSelectionType {
    AUTOMATIC,
    FIXED,
}

export enum DmaAddressingAutomaticType {
    INCREMENT,
    DECREMENT,
}

export class DmaControlRegister extends AbstractRegister {

    public address = 0x43F0;
    public label: string = "DMAPx";

    public getTransferDirection(): DmaTransferType {
        let type: number = (this.get() >> 7) & 0x1;
        if (type == 0) return DmaTransferType.CPU_TO_PPU;
        if (type == 1) return DmaTransferType.PPU_TO_CPU;
    }

    public set(val: number): void {
        if (val > 0xFF) throw new Error();
        super.set(val);
    }

    /*
     * HDMA Addressing Mode (0==Absolute, 1==Indirect)
     */
    public getAddressingMode(): DmaAddressingMode {
        let isAbsolute: boolean = ((this.get() >> 6) & 0x1) == 0;
        return isAbsolute ? DmaAddressingMode.ABSOLUTE: DmaAddressingMode.INDIRECT;
    }

    public getAddressingSelectionType(): DmaAddressingSelectionType {
        let isAutomatic = ((this.get() >> 3) & 0x1) == 0;
        return isAutomatic ? DmaAddressingSelectionType.AUTOMATIC: DmaAddressingSelectionType.FIXED;
    }

    public getAutomaticAddressingType(): DmaAddressingAutomaticType {
        let isIncrement = ((this.get() >> 4) & 0x1) == 0x0;
        return isIncrement ? DmaAddressingAutomaticType.INCREMENT: DmaAddressingAutomaticType.DECREMENT;
    }

    public getWriteMode(isHDMA?: boolean): DmaWriteMode {
        let type: number = ((this.get() >> 0) & 0x7);
        if (isHDMA) {
            if (type == 0x0) {
                return DmaWriteMode.ONE_BYTE;
            } else if (type == 0x1) {
                return DmaWriteMode.TWO_BYTES_SEQUENCE;
            } else if (type == 0x2) {
                return DmaWriteMode.ONE_BYTE;
            } else if (type == 0x3) {
                return DmaWriteMode.TWO_WORDS;
            } else if (type == 0x4) {
                return DmaWriteMode.FOUR_BYTES_SEQUENCE;
            } else {
                throw new Error("Invalid DmaWriteMode " + type);
            }
        } else {
            if (type == 0x0) {
                return DmaWriteMode.ONE_BYTE;
            } else if (type == 0x1) {
                return DmaWriteMode.TWO_BYTES_SEQUENCE;
            } else if (type == 0x2) {
                return DmaWriteMode.TWO_BYTES;
            } else if (type == 0x3) {
                return DmaWriteMode.TWO_WORDS;
            } else if (type == 0x4) {
                return DmaWriteMode.FOUR_BYTES_SEQUENCE;
            } else {
                throw new Error("Invalid DmaWriteMode " + type);
            }
        }
    }

}

export class DmaPpuAddressRegister extends AbstractRegister {

    public address: number = 0x43F1;
    public label: string = "BBADx";

    public getBbusAddress(): number {
        return 0x2100 | (this.get() & 0xFF);
    }

}



export class DmaCpuLAddressRegister extends AbstractRegister {

    public address = 0x43F2;
    public label: string = "A1TL";
}

export class DmaCpuMAddressRegister extends AbstractRegister {

    public address = 0x43F3;
    public label: string = "A1TM";
}

export class DmaCpuHAddressRegister extends AbstractRegister {

    public address = 0x43F4;
    public label: string = "A1TH";
}

export class DmaCpuAddressRegister {

    public a1tl: DmaCpuLAddressRegister;
    public a1tm: DmaCpuMAddressRegister;
    public a1th: DmaCpuHAddressRegister;

    constructor(console: Console) {
        this.a1tl = new DmaCpuLAddressRegister(console);
        this.a1tm = new DmaCpuMAddressRegister(console);
        this.a1th = new DmaCpuHAddressRegister(console);
    }

    public getAbusBank(): number {
        return this.a1th.get();
    }

    public getAbusAddress(): number {
        return Bit.toUint16(this.a1tm.get(), this.a1tl.get());
    }

    public get(): number {
        return Bit.toUint24(
            this.a1th.get(),
            this.a1tm.get(),
            this.a1tl.get(),
        );
    }

}

export class DmaTransferSizeLRegister extends AbstractRegister {

    public address = 0x43F5;
    public label: string = "DASx";
}

export class DmaTransferSizeHRegister extends AbstractRegister {

    public address = 0x43F5;
    public label: string = "DASx";
}

export class DmaTransferSizeRegister {

    public dasl: DmaTransferSizeLRegister;
    public dash: DmaTransferSizeHRegister;

    constructor(console: Console) {
        this.dash = new DmaTransferSizeHRegister(console);
        this.dasl = new DmaTransferSizeLRegister(console);
    }

    public get(): number {
        return Bit.toUint16(this.dash.get(), this.dasl.get());
    }

    public set(value: number): void {
        const low = Bit.getUint16Lower(value);
        const high = Bit.getUint16Upper(value);

        this.dasl.set(low);
        this.dash.set(high);
    }

}

export class DmaChannel {

    private console: Console;
    public control: DmaControlRegister;
    public cpuAddressRegister: DmaCpuAddressRegister;
    public ppuAddressRegister: DmaPpuAddressRegister;
    public transferSize: DmaTransferSizeRegister;
    public index: number;

    public dasbx: HdmaTableIndirectAddressRegister;
    public a2axl: HdmaTableAddressLowRegister;
    public a2axh: HdmaTableAddressHighRegister;
    public ntlrx: HdmaLineCounterRegister;

    constructor(console: Console, index: number) {
        this.console = console;
        this.index = index;

        this.control = new DmaControlRegister(console);
        this.cpuAddressRegister = new DmaCpuAddressRegister(console);
        this.ppuAddressRegister = new DmaPpuAddressRegister(console);
        this.transferSize = new DmaTransferSizeRegister(console);

        this.dasbx = new HdmaTableIndirectAddressRegister(console);
        this.a2axl = new HdmaTableAddressLowRegister(console);
        this.a2axh = new HdmaTableAddressHighRegister(console);
        this.ntlrx = new HdmaLineCounterRegister(console);
    }

    public execute(): number {
        let direction: DmaTransferType = this.control.getTransferDirection();
        let addressingMode: DmaAddressingMode = this.control.getAddressingMode();
        let addressingSelection: DmaAddressingSelectionType = this.control.getAddressingSelectionType();
        let automaticAddressingType: DmaAddressingAutomaticType = this.control.getAutomaticAddressingType();
        let aBusAddress: number = this.cpuAddressRegister.get();
        let bBusAddress: number = this.ppuAddressRegister.getBbusAddress();
        let transferSize: number = this.transferSize.get();
        let writeMode: DmaWriteMode = this.control.getWriteMode();

        let step: number = addressingSelection == DmaAddressingSelectionType.FIXED ?
            0 : (automaticAddressingType == DmaAddressingAutomaticType.DECREMENT ? -1 : 1);

        //console.log(this.toString());

        let source: number = (direction == DmaTransferType.PPU_TO_CPU)
            ? bBusAddress :  aBusAddress;
        let destination: number = (direction == DmaTransferType.PPU_TO_CPU)
            ? aBusAddress : bBusAddress;

        while (transferSize > 0) {
            let count: number = 0;

            if (writeMode == DmaWriteMode.ONE_BYTE) {
                if (transferSize-- > 0)this.console.bus.writeByte(
                    destination,
                    this.console.bus.readByte(source));
                count = step;
            } else if (writeMode == DmaWriteMode.TWO_BYTES) {
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 1));
                count = step * 2;
            } else if (writeMode == DmaWriteMode.TWO_BYTES_SEQUENCE) {
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 1,
                    this.console.bus.readByte(source + 1));
                count = step * 2;
            } else if (writeMode == DmaWriteMode.TWO_WORDS) {
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 1,
                    this.console.bus.readByte(source + 1));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 1,
                    this.console.bus.readByte(source + 1));
                count = step * 4;
            } else if (writeMode == DmaWriteMode.FOUR_BYTES_SEQUENCE) {
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 1,
                    this.console.bus.readByte(source + 1));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 2,
                    this.console.bus.readByte(source + 2));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 3,
                    this.console.bus.readByte(source + 3));
                count = step * 4;
            } else {
                throw new Error("DMA Error");
            }

            if (direction == DmaTransferType.PPU_TO_CPU) {
                destination += count;
            } else {
                source += count;
            }
        }
        this.transferSize.set(0x0);
        return transferSize * 8;
    }

    public toString(): string {
        return `DmaChannel[`
            + `direction=${DmaTransferType[this.control.getTransferDirection()]}, `
            + `mode=${DmaAddressingMode[this.control.getAddressingMode()]}, `
            + `direction=${DmaAddressingAutomaticType[this.control.getAutomaticAddressingType()]}, `
            + `addressing=${DmaAddressingSelectionType[this.control.getAddressingSelectionType()]}, `
            + `transferMode=${this.control.getWriteMode()}, `
            + `bBusAddress=${this.ppuAddressRegister.getBbusAddress().toString(16)}, `
            + `aBusAddress=0x${this.cpuAddressRegister.getAbusAddress().toString(16)}, `
            + `aBusBank=0x${this.cpuAddressRegister.getAbusBank().toString(16)}, `
            + `transferSize=0x${this.transferSize.get().toString(16)}, `
        + `]`;
    }
}

export class DmaEnableRegister extends AbstractRegister {

    public address = 0x420B;
    public label: string = "MDMAEN";

    public channels: DmaChannel[];
    public cycles: number = 0;

    constructor(console: Console, channels: DmaChannel[]) {
        super(console);

        this.console = console;
        this.channels = channels || [];
    }

    public set(val: number): void {
        super.set(val);

        for (let channel of this.channels) {
            let isEnabled: boolean = (val & 1) == 1;
            if (isEnabled) this.cycles += channel.execute();
            val = (val >> 1) & 0xFF;
        }
    }


}