import Console from "../Console";
import {Objects} from "../util/Objects";
import {Address} from "./Address";
import {Read} from "./Read";
import {Write} from "./Write";
import {Registers} from "../cpu/Registers";

/**
 * Bus for IO registers in the CPU
 */
export class BusA {

    private console: Console;
    private registers: Registers;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.cpu.registers);

        this.console = console;
        this.registers = console.cpu.registers;
    }

    public readByte(address: Address): Read {
        if (address == null) {
            throw new Error("Invalid readByte at " + address);
        }

        let read: Read = null;

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x2100 || page > 0x2183) {
            throw new Error("Invalid readByte at " + address);
        }

        if (page == 0x4200) {
            read = Read.byte(this.registers.nmitimen.get());
        } else if (page == 0x4201) {
            read = Read.byte(this.registers.wrio.get());
        } else if (page == 0x4202) {
            read = Read.byte(this.registers.wrmpya.get());
        } else if (page == 0x4203) {
            read = Read.byte(this.registers.wrmpyb.get());
        } else if (page == 0x4204) {
            read = Read.byte(this.registers.wrdivl.get());
        } else if (page == 0x4205) {
            read = Read.byte(this.registers.wrdivh.get());
        } else if (page == 0x4206) {
            read = Read.byte(this.registers.wrdivb.get());
        } else if (page == 0x4207) {
            read = Read.byte(this.registers.htimel.get());
        } else if (page == 0x4208) {
            read = Read.byte(this.registers.htimeh.get());
        } else if (page == 0x4209) {
            read = Read.byte(this.registers.vtimel.get());
        } else if (page == 0x420A) {
            read = Read.byte(this.registers.vtimeh.get());
        } else if (page == 0x420B) {
            read = Read.byte(this.registers.mdmaen.get());
        } else if (page == 0x420C) {
            read = Read.byte(this.registers.hdmaen.get());
        } else if (page == 0x420D) {
            read = Read.byte(this.registers.memsel.get());
        } else if (page == 0x4210) {
            read = Read.byte(this.registers.rdnmi.get());
        } else if (page == 0x4211) {
            read = Read.byte(this.registers.timeup.get());
        } else if (page == 0x4212) {
            read = Read.byte(this.registers.hvbjoy.get());
        } else if (page == 0x4213) {
            read = Read.byte(this.registers.rdio.get());
        } else if (page == 0x4214) {
            read = Read.byte(this.registers.rddivl.get());
        } else if (page == 0x4215) {
            read = Read.byte(this.registers.rddivh.get());
        } else if (page == 0x4216) {
            read = Read.byte(this.registers.rdmpyl.get());
        } else if (page == 0x4217) {
            read = Read.byte(this.registers.rdmpyh.get());
        } else if (page == 0x4218) {
            read = Read.byte(this.registers.joy1l.get());
        } else if (page == 0x4219) {
            read = Read.byte(this.registers.joy1h.get());
        } else if (page == 0x421A) {
            read = Read.byte(this.registers.joy2l.get());
        } else if (page == 0x421B) {
            read = Read.byte(this.registers.joy2h.get());
        } else if (page == 0x421C) {
            read = Read.byte(this.registers.joy3l.get());
        } else if (page == 0x421D) {
            read = Read.byte(this.registers.joy3h.get());
        } else if (page == 0x421E) {
            read = Read.byte(this.registers.joy4l.get());
        } else if (page == 0x421F) {
            read = Read.byte(this.registers.joy4h.get());
        } else {
            throw new Error("Invalid read on BusA at " + address.toValue());
        }

        return read;
    }


    public writeByte(address: Address, val: number): Write {
        if (address == null || val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid writeByte at " + address + " with " + val);
        }

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x4200 || page > 0x421F) {
            throw new Error("Invalid writeByte at " + address);
        }

        if (page == 0x4200) {
            this.registers.nmitimen.set(val);
        } else if (page == 0x4201) {
            this.registers.wrio.set(val);
        } else if (page == 0x4202) {
            this.registers.wrmpya.set(val);
        } else if (page == 0x4203) {
            this.registers.wrmpyb.set(val);
        } else if (page == 0x4204) {
            this.registers.wrdivl.set(val);
        } else if (page == 0x4205) {
            this.registers.wrdivh.set(val);
        } else if (page == 0x4206) {
            this.registers.wrdivb.set(val);
        } else if (page == 0x4207) {
            this.registers.htimel.set(val);
        } else if (page == 0x4208) {
            this.registers.htimeh.set(val);
        } else if (page == 0x4209) {
            this.registers.vtimel.set(val);
        } else if (page == 0x420A) {
            this.registers.vtimeh.set(val);
        } else if (page == 0x420B) {
            this.registers.mdmaen.set(val);
        } else if (page == 0x420C) {
            this.registers.hdmaen.set(val);
        } else if (page == 0x420D) {
            this.registers.memsel.set(val);
        } else if (page == 0x4210) {
            this.registers.rdnmi.set(val);
        } else if (page == 0x4211) {
            this.registers.timeup.set(val);
        } else if (page == 0x4212) {
            this.registers.hvbjoy.set(val);
        } else if (page == 0x4213) {
            this.registers.rdio.set(val);
        } else if (page == 0x4214) {
            this.registers.rddivl.set(val);
        } else if (page == 0x4215) {
            this.registers.rddivh.set(val);
        } else if (page == 0x4216) {
            this.registers.rdmpyl.set(val);
        } else if (page == 0x4217) {
            this.registers.rdmpyh.set(val);
        } else if (page == 0x4218) {
            this.registers.joy1l.set(val);
        } else if (page == 0x4219) {
            this.registers.joy1h.set(val);
        } else if (page == 0x421A) {
            this.registers.joy2l.set(val);
        } else if (page == 0x421B) {
            this.registers.joy2h.set(val);
        } else if (page == 0x421C) {
            this.registers.joy3l.set(val);
        } else if (page == 0x421D) {
            this.registers.joy3h.set(val);
        } else if (page == 0x421E) {
            this.registers.joy4l.set(val);
        } else if (page == 0x421F) {
            this.registers.joy4h.set(val);
        } else {
            throw new Error("Invalid write on BusA at " + address.toValue());
        }

        return null;
    }
}