import {Objects} from "../util/Objects";
import {Register} from "../ppu/Registers";
import {Bit} from "../util/Bit";
import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Console} from "../Console";
import {Mode, Modes} from "../Modes";
import {
    HdmaLineCounterRegister,
    HdmaTableAddressHighRegister,
    HdmaTableAddressLowRegister,
    HdmaTableIndirectAddressRegister,
} from "./Hdma";

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

export class DmaControlRegister extends Register {

    public address: string = "0x43x0";
    public label: string = "DMAPx";

    public getTransferDirection(): DmaTransferType {
        let type: number = (this.val >> 7) & 0x1;
        if (type == 0) return DmaTransferType.CPU_TO_PPU;
        if (type == 1) return DmaTransferType.PPU_TO_CPU;
    }

    /*
     * HDMA Addressing Mode (0==Absolute, 1==Indirect)
     */
    public getAddressingMode(): DmaAddressingMode {
        let isAbsolute: boolean = ((this.val >> 6) & 0x1) == 0;
        return isAbsolute ? DmaAddressingMode.ABSOLUTE: DmaAddressingMode.INDIRECT;
    }

    public getAddressingSelectionType(): DmaAddressingSelectionType {
        let isAutomatic = ((this.val >> 3) & 0x1) == 0;
        return isAutomatic ? DmaAddressingSelectionType.AUTOMATIC: DmaAddressingSelectionType.FIXED;
    }

    public getAutomaticAddressingType(): DmaAddressingAutomaticType {
        let isIncrement = ((this.val >> 4) & 0x1) == 0x0;
        return isIncrement ? DmaAddressingAutomaticType.INCREMENT: DmaAddressingAutomaticType.DECREMENT;
    }

    public getWriteMode(isHDMA?: boolean): DmaWriteMode {
        let type: number = ((this.val >> 0) & 0x7);
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

export class DmaPpuAddressRegister extends Register {

    protected mode : Mode = Modes.bit16;
    public address: string = "0x43x1";
    public label: string = "BBADx";

    public set(val: number): void {
        super.set(0x2100 | (val & 0xFF));
    }

    public getBbusAddress(): number {
        return this.val;
    }

}

export class DmaCpuAddressRegister extends Register {

    public address: string = "0x43x2-0x43x4";
    public label: string = "A1Tx";

    public setLower(val: number): void {
        this.val = Bit.setUint32Lower(this.val, val);
    }

    public setMiddle(val: number): void {
        this.val = Bit.setUint32Middle(this.val, val);
    }

    public setUpper(val: number): void {
        this.val = Bit.setUint32Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint32Lower(this.val);
    }

    public getMiddle(): number {
        return Bit.getUint32Middle(this.val);
    }

    public getUpper(): number {
        return Bit.getUint32Upper(this.val);
    }

    public getAbusBank(): number {
        return Bit.getUint24Upper(this.val);
    }

    public getAbusAddress(): number {
        return this.val & 0xFFFF;
    }

    public get(): number {
        return this.val;
    }
}

export class DmaTransferSizeRegister extends Register {

    protected mode : Mode = Modes.bit16;
    public address: string = "0x43x5-0x43x6";
    public label: string = "DASx";

    public setLower(val: number): void {
        this.val = Bit.setUint16Lower(this.val, val);
    }

    public setUpper(val: number): void {
        this.val = Bit.setUint16Upper(this.val, val);
    }

    public getLower(): number {
        return Bit.getUint24Lower(this.val);
    }

    public getUpper(): number {
        return Bit.getUint24Upper(this.val);
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
                count += 1;
            } else if (writeMode == DmaWriteMode.TWO_BYTES) {
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 1));
                count += 2;
            } else if (writeMode == DmaWriteMode.TWO_BYTES_SEQUENCE) {
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 0,
                    this.console.bus.readByte(source + 0));
                if (transferSize-- > 0) this.console.bus.writeByte(
                    destination + 1,
                    this.console.bus.readByte(source + 1));
                count += step * 2;
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
                count += step * 4;
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
                count += step * 4;
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

export class DmaEnableRegister extends Register {

    public address: string = "0x420B";
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