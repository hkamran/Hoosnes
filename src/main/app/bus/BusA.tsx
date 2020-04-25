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

    public mdr: number;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.cpu.registers);

        this.console = console;
        this.registers = console.cpu.registers;
    }

    public readByte(address: Address): number {
        if (address == null) {
            throw new Error("Invalid readByte at " + address);
        }

        let read: number = this.mdr;

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x2100 || page > 0x43FF) {
            throw new Error("Invalid readByte at " + address);
        }

        if (page == 0x4016) {
            read = this.registers.joy1l.get();
        } else if (page == 0x4017) {
            read = this.registers.joy2l.get();
        } else if (page == 0x4200) {
            read = this.registers.nmitimen.get();
        } else if (page == 0x4201) {
            read = this.registers.wrio.get();
        } else if (page == 0x4202) {
            read = this.registers.wrmpya.get();
        } else if (page == 0x4203) {
            read = this.registers.wrmpyb.get();
        } else if (page == 0x4204) {
            read = this.registers.wrdivl.get();
        } else if (page == 0x4205) {
            read = this.registers.wrdivh.get();
        } else if (page == 0x4206) {
            read = this.registers.wrdivb.get();
        } else if (page == 0x4207) {
            read = this.registers.htime.getLower();
        } else if (page == 0x4208) {
            read = this.registers.htime.getUpper();
        } else if (page == 0x4209) {
            read = this.registers.vtime.getLower();
        } else if (page == 0x4210) {
            read = this.registers.rdnmi.get();
        } else if (page == 0x420A) {
            read = this.registers.vtime.getUpper();
        } else if (page == 0x420B) {
            read = this.registers.mdmaen.get();
        } else if (page == 0x420C) {
            read = this.registers.hdmaen.get();
        } else if (page == 0x420D) {
            read = this.registers.memsel.get();
        } else if (page == 0x4210) {
            read = this.registers.rdnmi.get();
        } else if (page == 0x4211) {
            read = this.registers.timeup.get();
        } else if (page == 0x4212) {
            read = this.registers.hvbjoy.get();
        } else if (page == 0x4213) {
            read = this.registers.rdio.get();
        } else if (page == 0x4214) {
            read = this.registers.rddivl.get();
        } else if (page == 0x4215) {
            read = this.registers.rddivh.get();
        } else if (page == 0x4216) {
            read = this.registers.rdmpyl.get();
        } else if (page == 0x4217) {
            read = this.registers.rdmpyh.get();
        } else if (page == 0x4218) {
            read = this.registers.joy1l.get();
        } else if (page == 0x4219) {
            read = this.registers.joy1h.get();
        } else if (page == 0x421A) {
            read = this.registers.joy2l.get();
        } else if (page == 0x421B) {
            read = this.registers.joy2h.get();
        } else if (page == 0x421C) {
            read = this.registers.joy3l.get();
        } else if (page == 0x421D) {
            read = this.registers.joy3h.get();
        } else if (page == 0x421E) {
            read = this.registers.joy4l.get();
        } else if (page == 0x421F) {
            read = this.registers.joy4h.get();
        } else if (page == 0x4300) {
            // --------------------------
            // DMA 0
            // --------------------------
            read = this.registers.dma0.control.get();
        } else if (page == 0x4301) {
            read = this.registers.dma0.ppuAddressRegister.get();
        } else if (page == 0x4302) {
            read = this.registers.dma0.cpuAddressRegister.getLower();
        } else if (page == 0x4303) {
            read = this.registers.dma0.cpuAddressRegister.getMiddle();
        } else if (page == 0x4304) {
            read = this.registers.dma0.cpuAddressRegister.getUpper();
        } else if (page == 0x4305) {
            read = this.registers.dma0.transferSize.getLower();
        } else if (page == 0x4306) {
            read = this.registers.dma0.transferSize.getUpper();
        } else if (page == 0x4307) {
            read = this.registers.dma0.dasbx.get();
        } else if (page == 0x4308) {
            read = this.registers.dma0.a2axl.get();
        } else if (page == 0x4309) {
            read = this.registers.dma0.a2axh.get();
        } else if (page == 0x430A) {
            read = this.registers.dma0.ntlrx.get();
        } else if (page == 0x4310) {
            // --------------------------
            // DMA 1
            // --------------------------
            read = this.registers.dma1.control.get();
        } else if (page == 0x4311) {
            read = this.registers.dma1.ppuAddressRegister.get();
        } else if (page == 0x4312) {
            read = this.registers.dma1.cpuAddressRegister.getLower();
        } else if (page == 0x4313) {
            read = this.registers.dma1.cpuAddressRegister.getMiddle();
        } else if (page == 0x4314) {
            read = this.registers.dma1.cpuAddressRegister.getUpper();
        } else if (page == 0x4315) {
            read = this.registers.dma1.transferSize.getLower();
        } else if (page == 0x4316) {
            read = this.registers.dma1.transferSize.getUpper();
        } else if (page == 0x4317) {
            read = this.registers.dma1.dasbx.get();
        } else if (page == 0x4318) {
            read = this.registers.dma1.a2axl.get();
        } else if (page == 0x4319) {
            read = this.registers.dma1.a2axh.get();
        } else if (page == 0x431A) {
            read = this.registers.dma1.ntlrx.get();
        } else if (page == 0x4320) {
            // --------------------------
            // DMA 2
            // --------------------------
            read = this.registers.dma2.control.get();
        } else if (page == 0x4321) {
            read = this.registers.dma2.ppuAddressRegister.get();
        } else if (page == 0x4322) {
            read = this.registers.dma2.cpuAddressRegister.getLower();
        } else if (page == 0x4323) {
            read = this.registers.dma2.cpuAddressRegister.getMiddle();
        } else if (page == 0x4324) {
            read = this.registers.dma2.cpuAddressRegister.getUpper();
        } else if (page == 0x4325) {
            read = this.registers.dma2.transferSize.getLower();
        } else if (page == 0x4326) {
            read = this.registers.dma2.transferSize.getUpper();
        } else if (page == 0x4327) {
            read = this.registers.dma2.dasbx.get();
        } else if (page == 0x4328) {
            read = this.registers.dma2.a2axl.get();
        } else if (page == 0x4329) {
            read = this.registers.dma2.a2axh.get();
        } else if (page == 0x432A) {
            read = this.registers.dma2.ntlrx.get();
        } else if (page == 0x4330) {
            // --------------------------
            // DMA 3
            // --------------------------
            read = this.registers.dma3.control.get();
        } else if (page == 0x4331) {
            read = this.registers.dma3.ppuAddressRegister.get();
        } else if (page == 0x4332) {
            read = this.registers.dma3.cpuAddressRegister.getLower();
        } else if (page == 0x4333) {
            read = this.registers.dma3.cpuAddressRegister.getMiddle();
        } else if (page == 0x4334) {
            read = this.registers.dma3.cpuAddressRegister.getUpper();
        } else if (page == 0x4335) {
            read = this.registers.dma3.transferSize.getLower();
        } else if (page == 0x4336) {
            read = this.registers.dma3.transferSize.getUpper();
        } else if (page == 0x4337) {
            read = this.registers.dma3.dasbx.get();
        } else if (page == 0x4338) {
            read = this.registers.dma3.a2axl.get();
        } else if (page == 0x4339) {
            read = this.registers.dma3.a2axh.get();
        } else if (page == 0x433A) {
            read = this.registers.dma3.ntlrx.get();
        } else if (page == 0x4340) {
            // --------------------------
            // DMA 4
            // --------------------------
            read = this.registers.dma4.control.get();
        } else if (page == 0x4341) {
            read = this.registers.dma4.ppuAddressRegister.get();
        } else if (page == 0x4342) {
            read = this.registers.dma4.cpuAddressRegister.getLower();
        } else if (page == 0x4343) {
            read = this.registers.dma4.cpuAddressRegister.getMiddle();
        } else if (page == 0x4344) {
            read = this.registers.dma4.cpuAddressRegister.getUpper();
        } else if (page == 0x4345) {
            read = this.registers.dma4.transferSize.getLower();
        } else if (page == 0x4346) {
            read = this.registers.dma4.transferSize.getUpper();
        } else if (page == 0x4347) {
            read = this.registers.dma4.dasbx.get();
        } else if (page == 0x4348) {
            read = this.registers.dma4.a2axl.get();
        } else if (page == 0x4349) {
            read = this.registers.dma4.a2axh.get();
        } else if (page == 0x434A) {
            read = this.registers.dma4.ntlrx.get();
        } else if (page == 0x4350) {
            // --------------------------
            // DMA 5
            // --------------------------
            read = this.registers.dma5.control.get();
        } else if (page == 0x4351) {
            read = this.registers.dma5.ppuAddressRegister.get();
        } else if (page == 0x4352) {
            read = this.registers.dma5.cpuAddressRegister.getLower();
        } else if (page == 0x4353) {
            read = this.registers.dma5.cpuAddressRegister.getMiddle();
        } else if (page == 0x4354) {
            read = this.registers.dma5.cpuAddressRegister.getUpper();
        } else if (page == 0x4355) {
            read = this.registers.dma5.transferSize.getLower();
        } else if (page == 0x4356) {
            read = this.registers.dma5.transferSize.getUpper();
        } else if (page == 0x4357) {
            read = this.registers.dma5.dasbx.get();
        } else if (page == 0x4358) {
            read = this.registers.dma5.a2axl.get();
        } else if (page == 0x4359) {
            read = this.registers.dma5.a2axh.get();
        } else if (page == 0x435A) {
            read = this.registers.dma5.ntlrx.get();
        } else if (page == 0x4360) {
            // --------------------------
            // DMA 6
            // --------------------------
            read = this.registers.dma6.control.get();
        } else if (page == 0x4361) {
            read = this.registers.dma6.ppuAddressRegister.get();
        } else if (page == 0x4362) {
            read = this.registers.dma6.cpuAddressRegister.getLower();
        } else if (page == 0x4363) {
            read = this.registers.dma6.cpuAddressRegister.getMiddle();
        } else if (page == 0x4364) {
            read = this.registers.dma6.cpuAddressRegister.getUpper();
        } else if (page == 0x4365) {
            read = this.registers.dma6.transferSize.getLower();
        } else if (page == 0x4366) {
            read = this.registers.dma6.transferSize.getUpper();
        } else if (page == 0x4367) {
            read = this.registers.dma6.dasbx.get();
        } else if (page == 0x4368) {
            read = this.registers.dma6.a2axl.get();
        } else if (page == 0x4369) {
            read = this.registers.dma6.a2axh.get();
        } else if (page == 0x436A) {
            read = this.registers.dma6.ntlrx.get();
        } else if (page == 0x4370) {
            // --------------------------
            // DMA 7
            // --------------------------
            read = this.registers.dma7.control.get();
        } else if (page == 0x4371) {
            read = this.registers.dma7.ppuAddressRegister.get();
        } else if (page == 0x4372) {
            read = this.registers.dma7.cpuAddressRegister.getLower();
        } else if (page == 0x4373) {
            read = this.registers.dma7.cpuAddressRegister.getMiddle();
        } else if (page == 0x4374) {
            read = this.registers.dma7.cpuAddressRegister.getUpper();
        } else if (page == 0x4375) {
            read = this.registers.dma7.transferSize.getLower();
        } else if (page == 0x4376) {
            read = this.registers.dma7.transferSize.getUpper();
        } else if (page == 0x4377) {
            read = this.registers.dma7.dasbx.get();
        } else if (page == 0x4378) {
            read = this.registers.dma7.a2axl.get();
        } else if (page == 0x4379) {
            read = this.registers.dma7.a2axh.get();
        } else if (page == 0x437A) {
            read = this.registers.dma7.ntlrx.get();
        } else {
            console.warn("Invalid read on BusA at " + address);
        }

        return read;
    }


    public writeByte(address: Address, val: number): Write {
        if (address == null || val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid writeByte at " + address + " with " + val);
        }

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x2100 || page > 0x43FF) {
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
            this.registers.htime.setLower(val);
        } else if (page == 0x4208) {
            this.registers.htime.setUpper(val);
        } else if (page == 0x4209) {
            this.registers.vtime.setLower(val);
        } else if (page == 0x420A) {
            this.registers.vtime.setUpper(val);
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
            this.registers.dma0.dasbx.set(val);
        } else if (page == 0x4308) {
            this.registers.dma0.a2axl.set(val);
        } else if (page == 0x4309) {
            this.registers.dma0.a2axh.set(val);
        } else if (page == 0x430A) {
            this.registers.dma0.ntlrx.set(val);
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
            this.registers.dma1.dasbx.set(val);
        } else if (page == 0x4318) {
            this.registers.dma1.a2axl.set(val);
        } else if (page == 0x4319) {
            this.registers.dma1.a2axh.set(val);
        } else if (page == 0x431A) {
            this.registers.dma1.ntlrx.set(val);
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
            this.registers.dma2.dasbx.set(val);
        } else if (page == 0x4328) {
            this.registers.dma2.a2axl.set(val);
        } else if (page == 0x4329) {
            this.registers.dma2.a2axh.set(val);
        } else if (page == 0x432A) {
            this.registers.dma2.ntlrx.set(val);
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
            this.registers.dma3.dasbx.set(val);
        } else if (page == 0x4338) {
            this.registers.dma3.a2axl.set(val);
        } else if (page == 0x4339) {
            this.registers.dma3.a2axh.set(val);
        } else if (page == 0x433A) {
            this.registers.dma3.ntlrx.set(val);
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
            this.registers.dma4.dasbx.set(val);
        } else if (page == 0x4348) {
            this.registers.dma4.a2axl.set(val);
        } else if (page == 0x4349) {
            this.registers.dma4.a2axh.set(val);
        } else if (page == 0x434A) {
            this.registers.dma4.ntlrx.set(val);
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
            this.registers.dma5.dasbx.set(val);
        } else if (page == 0x4358) {
            this.registers.dma5.a2axl.set(val);
        } else if (page == 0x4359) {
            this.registers.dma5.a2axh.set(val);
        } else if (page == 0x435A) {
            this.registers.dma5.ntlrx.set(val);
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
            this.registers.dma6.dasbx.set(val);
        } else if (page == 0x4368) {
            this.registers.dma6.a2axl.set(val);
        } else if (page == 0x4369) {
            this.registers.dma6.a2axh.set(val);
        } else if (page == 0x436A) {
            this.registers.dma6.ntlrx.set(val);
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
            this.registers.dma7.dasbx.set(val);
        } else if (page == 0x4378) {
            this.registers.dma7.a2axl.set(val);
        } else if (page == 0x4379) {
            this.registers.dma7.a2axh.set(val);
        } else if (page == 0x437A) {
            this.registers.dma7.ntlrx.set(val);
        } else {
            console.warn("Invalid write on BusA at " + address);
        }

        return null;
    }
}