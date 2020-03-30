import {Console} from "../Console";
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

        if (page < 0x2100 || page > 0x437A) {
            throw new Error("Invalid readByte at " + address);
        }
        if (page == 0x4016) {
            read = Read.byte(this.registers.joy1l.get());
        } else if (page == 0x4017) {
            read = Read.byte(this.registers.joy2l.get());
        } else if (page == 0x4200) {
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
        } else if (page == 0x4210) {
            read = Read.byte(this.registers.rdnmi.get());
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
        } else if (page == 0x4300) {
            // --------------------------
            // DMA 0
            // --------------------------
            read = Read.byte(this.registers.dma0.control.get());
        } else if (page == 0x4301) {
            read = Read.byte(this.registers.dma0.ppuAddressRegister.get());
        } else if (page == 0x4302) {
            read = Read.byte(this.registers.dma0.cpuAddressRegister.getLower());
        } else if (page == 0x4303) {
            read = Read.byte(this.registers.dma0.cpuAddressRegister.getMiddle());
        } else if (page == 0x4304) {
            read = Read.byte(this.registers.dma0.cpuAddressRegister.getUpper());
        } else if (page == 0x4305) {
            read = Read.byte(this.registers.dma0.transferSize.getLower());
        } else if (page == 0x4306) {
            read = Read.byte(this.registers.dma0.transferSize.getUpper());
        } else if (page == 0x4307) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4308) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4309) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x430A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4310) {
            // --------------------------
            // DMA 1
            // --------------------------
            read = Read.byte(this.registers.dma1.control.get());
        } else if (page == 0x4311) {
            read = Read.byte(this.registers.dma1.ppuAddressRegister.get());
        } else if (page == 0x4312) {
            read = Read.byte(this.registers.dma1.cpuAddressRegister.getLower());
        } else if (page == 0x4313) {
            read = Read.byte(this.registers.dma1.cpuAddressRegister.getMiddle());
        } else if (page == 0x4314) {
            read = Read.byte(this.registers.dma1.cpuAddressRegister.getUpper());
        } else if (page == 0x4315) {
            read = Read.byte(this.registers.dma1.transferSize.getLower());
        } else if (page == 0x4316) {
            read = Read.byte(this.registers.dma1.transferSize.getUpper());
        } else if (page == 0x4317) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4318) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4319) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x431A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4320) {
            // --------------------------
            // DMA 2
            // --------------------------
            read = Read.byte(this.registers.dma2.control.get());
        } else if (page == 0x4321) {
            read = Read.byte(this.registers.dma2.ppuAddressRegister.get());
        } else if (page == 0x4322) {
            read = Read.byte(this.registers.dma2.cpuAddressRegister.getLower());
        } else if (page == 0x4323) {
            read = Read.byte(this.registers.dma2.cpuAddressRegister.getMiddle());
        } else if (page == 0x4324) {
            read = Read.byte(this.registers.dma2.cpuAddressRegister.getUpper());
        } else if (page == 0x4325) {
            read = Read.byte(this.registers.dma2.transferSize.getLower());
        } else if (page == 0x4326) {
            read = Read.byte(this.registers.dma2.transferSize.getUpper());
        } else if (page == 0x4327) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4328) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4329) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x432A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4330) {
            // --------------------------
            // DMA 3
            // --------------------------
            read = Read.byte(this.registers.dma3.control.get());
        } else if (page == 0x4331) {
            read = Read.byte(this.registers.dma3.ppuAddressRegister.get());
        } else if (page == 0x4332) {
            read = Read.byte(this.registers.dma3.cpuAddressRegister.getLower());
        } else if (page == 0x4333) {
            read = Read.byte(this.registers.dma3.cpuAddressRegister.getMiddle());
        } else if (page == 0x4334) {
            read = Read.byte(this.registers.dma3.cpuAddressRegister.getUpper());
        } else if (page == 0x4335) {
            read = Read.byte(this.registers.dma3.transferSize.getLower());
        } else if (page == 0x4336) {
            read = Read.byte(this.registers.dma3.transferSize.getUpper());
        } else if (page == 0x4337) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4338) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4339) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x433A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4340) {
            // --------------------------
            // DMA 4
            // --------------------------
            read = Read.byte(this.registers.dma4.control.get());
        } else if (page == 0x4341) {
            read = Read.byte(this.registers.dma4.ppuAddressRegister.get());
        } else if (page == 0x4342) {
            read = Read.byte(this.registers.dma4.cpuAddressRegister.getLower());
        } else if (page == 0x4343) {
            read = Read.byte(this.registers.dma4.cpuAddressRegister.getMiddle());
        } else if (page == 0x4344) {
            read = Read.byte(this.registers.dma4.cpuAddressRegister.getUpper());
        } else if (page == 0x4345) {
            read = Read.byte(this.registers.dma4.transferSize.getLower());
        } else if (page == 0x4346) {
            read = Read.byte(this.registers.dma4.transferSize.getUpper());
        } else if (page == 0x4347) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4348) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4349) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x434A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4350) {
            // --------------------------
            // DMA 5
            // --------------------------
            read = Read.byte(this.registers.dma5.control.get());
        } else if (page == 0x4351) {
            read = Read.byte(this.registers.dma5.ppuAddressRegister.get());
        } else if (page == 0x4352) {
            read = Read.byte(this.registers.dma5.cpuAddressRegister.getLower());
        } else if (page == 0x4353) {
            read = Read.byte(this.registers.dma5.cpuAddressRegister.getMiddle());
        } else if (page == 0x4354) {
            read = Read.byte(this.registers.dma5.cpuAddressRegister.getUpper());
        } else if (page == 0x4355) {
            read = Read.byte(this.registers.dma5.transferSize.getLower());
        } else if (page == 0x4356) {
            read = Read.byte(this.registers.dma5.transferSize.getUpper());
        } else if (page == 0x4357) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4358) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4359) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x435A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4360) {
            // --------------------------
            // DMA 6
            // --------------------------
            read = Read.byte(this.registers.dma6.control.get());
        } else if (page == 0x4361) {
            read = Read.byte(this.registers.dma6.ppuAddressRegister.get());
        } else if (page == 0x4362) {
            read = Read.byte(this.registers.dma6.cpuAddressRegister.getLower());
        } else if (page == 0x4363) {
            read = Read.byte(this.registers.dma6.cpuAddressRegister.getMiddle());
        } else if (page == 0x4364) {
            read = Read.byte(this.registers.dma6.cpuAddressRegister.getUpper());
        } else if (page == 0x4365) {
            read = Read.byte(this.registers.dma6.transferSize.getLower());
        } else if (page == 0x4366) {
            read = Read.byte(this.registers.dma6.transferSize.getUpper());
        } else if (page == 0x4367) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4368) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4369) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x436A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4370) {
            // --------------------------
            // DMA 7
            // --------------------------
            read = Read.byte(this.registers.dma7.control.get());
        } else if (page == 0x4371) {
            read = Read.byte(this.registers.dma7.ppuAddressRegister.get());
        } else if (page == 0x4372) {
            read = Read.byte(this.registers.dma7.cpuAddressRegister.getLower());
        } else if (page == 0x4373) {
            read = Read.byte(this.registers.dma7.cpuAddressRegister.getMiddle());
        } else if (page == 0x4374) {
            read = Read.byte(this.registers.dma7.cpuAddressRegister.getUpper());
        } else if (page == 0x4375) {
            read = Read.byte(this.registers.dma7.transferSize.getLower());
        } else if (page == 0x4376) {
            read = Read.byte(this.registers.dma7.transferSize.getUpper());
        } else if (page == 0x4377) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4378) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x4379) {
            throw new Error("Invalid read on BusA at " + address.toValue());
        } else if (page == 0x437A) {
            throw new Error("Invalid read on BusA at " + address.toValue());
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

        if (page < 0x2100 || page > 0x437A) {
            throw new Error("Invalid writeByte at " + address);
        }

        if (page == 0x4016) {
            this.registers.joy1l.set(val);
        } else if (page == 0x4017) {
            this.registers.joy2l.set(val);
        } else if (page == 0x4200) {
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
            console.warn("HDMA set to 0x" + val.toString(16));
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
        } else if (page == 0x4300) {
            // --------------------------
            // DMA 0
            // --------------------------
            this.registers.dma0.control.set(val);
        } else if (page == 0x4301) {
            this.registers.dma0.ppuAddressRegister.set(val);
        } else if (page == 0x4302) {
            this.registers.dma0.cpuAddressRegister.setLower(val);
        } else if (page == 0x4303) {
            this.registers.dma0.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4304) {
            this.registers.dma0.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4305) {
            this.registers.dma0.transferSize.setLower(val);
        } else if (page == 0x4306) {
            this.registers.dma0.transferSize.setUpper(val);
        } else if (page == 0x4307) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4308) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4309) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x430A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4310) {
            // --------------------------
            // DMA 1
            // --------------------------
            this.registers.dma1.control.set(val);
        } else if (page == 0x4311) {
            this.registers.dma1.ppuAddressRegister.set(val);
        } else if (page == 0x4312) {
            this.registers.dma1.cpuAddressRegister.setLower(val);
        } else if (page == 0x4313) {
            this.registers.dma1.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4314) {
            this.registers.dma1.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4315) {
            this.registers.dma1.transferSize.setLower(val);
        } else if (page == 0x4316) {
            this.registers.dma1.transferSize.setUpper(val);
        } else if (page == 0x4317) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4318) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4319) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x431A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4320) {
            // --------------------------
            // DMA 2
            // --------------------------
            this.registers.dma2.control.set(val);
        } else if (page == 0x4321) {
            this.registers.dma2.ppuAddressRegister.set(val);
        } else if (page == 0x4322) {
            this.registers.dma2.cpuAddressRegister.setLower(val);
        } else if (page == 0x4323) {
            this.registers.dma2.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4324) {
            this.registers.dma2.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4325) {
            this.registers.dma2.transferSize.setLower(val);
        } else if (page == 0x4326) {
            this.registers.dma2.transferSize.setUpper(val);
        } else if (page == 0x4327) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4328) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4329) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x432A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4330) {
            // --------------------------
            // DMA 3
            // --------------------------
            this.registers.dma3.control.set(val);
        } else if (page == 0x4331) {
            this.registers.dma3.ppuAddressRegister.set(val);
        } else if (page == 0x4332) {
            this.registers.dma3.cpuAddressRegister.setLower(val);
        } else if (page == 0x4333) {
            this.registers.dma3.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4334) {
            this.registers.dma3.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4335) {
            this.registers.dma3.transferSize.setLower(val);
        } else if (page == 0x4336) {
            this.registers.dma3.transferSize.setUpper(val);
        } else if (page == 0x4337) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4338) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4339) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x433A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4340) {
            // --------------------------
            // DMA 4
            // --------------------------
            this.registers.dma4.control.set(val);
        } else if (page == 0x4341) {
            this.registers.dma4.ppuAddressRegister.set(val);
        } else if (page == 0x4342) {
            this.registers.dma4.cpuAddressRegister.setLower(val);
        } else if (page == 0x4343) {
            this.registers.dma4.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4344) {
            this.registers.dma4.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4345) {
            this.registers.dma4.transferSize.setLower(val);
        } else if (page == 0x4346) {
            this.registers.dma4.transferSize.setUpper(val);
        } else if (page == 0x4347) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4348) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4349) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x434A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4350) {
            // --------------------------
            // DMA 5
            // --------------------------
            this.registers.dma5.control.set(val);
        } else if (page == 0x4351) {
            this.registers.dma5.ppuAddressRegister.set(val);
        } else if (page == 0x4352) {
            this.registers.dma5.cpuAddressRegister.setLower(val);
        } else if (page == 0x4353) {
            this.registers.dma5.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4354) {
            this.registers.dma5.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4355) {
            this.registers.dma5.transferSize.setLower(val);
        } else if (page == 0x4356) {
            this.registers.dma5.transferSize.setUpper(val);
        } else if (page == 0x4357) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4358) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4359) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x435A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4360) {
            // --------------------------
            // DMA 6
            // --------------------------
            this.registers.dma6.control.set(val);
        } else if (page == 0x4361) {
            this.registers.dma6.ppuAddressRegister.set(val);
        } else if (page == 0x4362) {
            this.registers.dma6.cpuAddressRegister.setLower(val);
        } else if (page == 0x4363) {
            this.registers.dma6.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4364) {
            this.registers.dma6.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4365) {
            this.registers.dma6.transferSize.setLower(val);
        } else if (page == 0x4366) {
            this.registers.dma6.transferSize.setUpper(val);
        } else if (page == 0x4367) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4368) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4369) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x436A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4370) {
            // --------------------------
            // DMA 7
            // --------------------------
            this.registers.dma7.control.set(val);
        } else if (page == 0x4371) {
            this.registers.dma7.ppuAddressRegister.set(val);
        } else if (page == 0x4372) {
            this.registers.dma7.cpuAddressRegister.setLower(val);
        } else if (page == 0x4373) {
            this.registers.dma7.cpuAddressRegister.setMiddle(val);
        } else if (page == 0x4374) {
            this.registers.dma7.cpuAddressRegister.setUpper(val);
        } else if (page == 0x4375) {
            this.registers.dma7.transferSize.setLower(val);
        } else if (page == 0x4376) {
            this.registers.dma7.transferSize.setUpper(val);
        } else if (page == 0x4377) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4378) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x4379) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else if (page == 0x437A) {
            console.warn(`Invalid write on BusA at ${address.toValue()}`);
        } else {
            throw new Error("Invalid write on BusA at " + address.toValue());
        }

        return null;
    }
}