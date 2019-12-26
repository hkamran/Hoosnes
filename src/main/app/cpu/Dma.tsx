import {Objects} from "../util/Objects";
import {Register} from "../ppu/Registers";
import {Bit} from "../util/Bit";
import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import Console from "../Console";

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
    public getAddressingMode(): number {
        let type: number = (this.val >> 6) & 0x1;
        return type;
    }

    /*
     * CPU addr Auto inc/dec selection (0==Increment, 1==Decrement)
     */
    public getIncrementMode(): number {
        return (this.val >> 5) & 0x1;
    }

    public isIncrementDisabled(): boolean {
        return ((this.val >> 4) & 0x1) == 0x1;
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

export class DmaDestinationRegister extends Register {

    public address: string = "0x43x1";
    public label: string = "BBADx";

}

export class DmaSourceRegister extends Register {

    public address: string = "0x43x2-0x43x4";
    public label: string = "A1Tx";

    public setLower(val: number): void {
        this.val = Bit.setUint24Lower(this.val, val);
    }

    public setMiddle(val: number): void {
        this.val = Bit.setUint24Middle(this.val, val);
    }

    public setUpper(val: number): void {
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

export class DmaTransferSizeRegister extends Register {

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
    public source: DmaSourceRegister;            // 24-bit
    public destination: DmaDestinationRegister;  // 8-bit
    public size: DmaTransferSizeRegister;        // 16-bit
    public index: number;

    constructor(console: Console, index: number) {
        this.console = console;
        this.index = index;

        this.control = new DmaControlRegister(console);
        this.source = new DmaSourceRegister(console);
        this.destination = new DmaDestinationRegister(console);
        this.size = new DmaTransferSizeRegister(console);
    }

    public execute(): number {
        let source: number = this.source.get();
        let destination: number = this.destination.get();
        let amount: number = this.size.get() == 0 ? 65536 : this.size.get();

        let step: number = this.control.isIncrementDisabled() ?
            0 : (this.control.getIncrementMode() ? -1 : 1);

        console.log(`DMA ${this.index} transfer from ${source} to ${destination} ${amount}`);

        let mode: DmaWriteMode = this.control.getWriteMode();

        while (amount > 0) {
            let data: Read = this.console.bus.readByte(Address.create(source));

            if (mode == DmaWriteMode.ONE_BYTE) {
                this.console.bus.writeByte(Address.create(destination), data.get());
                amount -= 1;
            } else if (mode == DmaWriteMode.TWO_BYTES) {
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination), data.get());
                destination += step * 2;
            } else if (mode == DmaWriteMode.TWO_BYTES_SEQUENCE) {
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination + 1), data.get());
                destination += step * 2;
            } else if (mode == DmaWriteMode.TWO_WORDS) {
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination + 1), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination + 1), data.get());
                destination += step * 4;
            } else if (mode == DmaWriteMode.FOUR_BYTES_SEQUENCE) {
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination + 1), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination + 2), data.get());
                if (amount-- > 0) this.console.bus.writeByte(Address.create(destination + 4), data.get());
                destination += step * 4;
            } else {
                throw new Error();
            }
        }

        this.size.set(0x0);

        return amount * 8;
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
        }
    }


}