import {Console} from "../Console";
import {Objects} from "../../util/Objects";
import {Registers} from "../cpu/Registers";
import {AddressUtil} from "../../util/AddressUtil";
import {Bit} from "../../util/Bit";

/**
 * Bus for IO registers in the CPU
 */
export class BusCpu {

    private console: Console;
    private registers: Registers;

    public mdr: number = 0x0;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.cpu.registers);

        this.console = console;
        this.registers = console.cpu.registers;
    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        let value = Bit.toUint8(this.mdr);

        if (page < 0x2100 || page > 0x43FF) {
            throw new Error("Invalid readByte at " + address);
        }

        if (page == 0x4016) {
            value = Bit.toUint8(this.registers.oldJoy1.get());
        } else if (page == 0x4017) {
            value = Bit.toUint8(this.registers.oldJoy2.get());
        } else if (page == 0x4200) {
            value = Bit.toUint8(this.registers.nmitimen.get());
        } else if (page == 0x4201) {
            value = Bit.toUint8(this.registers.wrio.get());
        } else if (page == 0x4202) {
            value = Bit.toUint8(this.registers.wrmpya.get());
        } else if (page == 0x4203) {
            value = Bit.toUint8(this.registers.wrmpyb.get());
        } else if (page == 0x4204) {
            value = Bit.toUint8(this.registers.wrdivl.get());
        } else if (page == 0x4205) {
            value = Bit.toUint8(this.registers.wrdivh.get());
        } else if (page == 0x4206) {
            value = Bit.toUint8(this.registers.wrdivb.get());
        } else if (page == 0x4207) {
            value = Bit.toUint8(this.registers.htime.getLower());
        } else if (page == 0x4208) {
            value = Bit.toUint8(this.registers.htime.getUpper());
        } else if (page == 0x4209) {
            value = Bit.toUint8(this.registers.vtime.getLower());
        } else if (page == 0x4210) {
            value = Bit.toUint8(this.registers.rdnmi.get());
        } else if (page == 0x420A) {
            value = Bit.toUint8(this.registers.vtime.getUpper());
        } else if (page == 0x420B) {
            value = Bit.toUint8(this.registers.mdmaen.get());
        } else if (page == 0x420C) {
            value = Bit.toUint8(this.registers.hdmaen.get());
        } else if (page == 0x420D) {
            value = Bit.toUint8(this.registers.memsel.get());
        } else if (page == 0x4210) {
            value = Bit.toUint8(this.registers.rdnmi.get());
        } else if (page == 0x4211) {
            value = Bit.toUint8(this.registers.timeup.get());
        } else if (page == 0x4212) {
            value = Bit.toUint8(this.registers.hvbjoy.get());
        } else if (page == 0x4213) {
            value = Bit.toUint8(this.registers.rdio.get());
        } else if (page == 0x4214) {
            value = Bit.toUint8(this.registers.rddivl.get());
        } else if (page == 0x4215) {
            value = Bit.toUint8(this.registers.rddivh.get());
        } else if (page == 0x4216) {
            value = Bit.toUint8(this.registers.rdmpyl.get());
        } else if (page == 0x4217) {
            value = Bit.toUint8(this.registers.rdmpyh.get());
        } else if (page == 0x4218) {
            value = Bit.toUint8(this.registers.joy1.getLower());
        } else if (page == 0x4219) {
            value = Bit.toUint8(this.registers.joy1.getUpper());
        } else if (page == 0x421A) {
            value = Bit.toUint8(this.registers.joy2.getLower());
        } else if (page == 0x421B) {
            value = Bit.toUint8(this.registers.joy2.getUpper());
        } else if (page == 0x421C) {
            value = Bit.toUint8(this.registers.joy3l.get());
        } else if (page == 0x421D) {
            value = Bit.toUint8(this.registers.joy3h.get());
        } else if (page == 0x421E) {
            value = Bit.toUint8(this.registers.joy4l.get());
        } else if (page == 0x421F) {
            value = Bit.toUint8(this.registers.joy4h.get());
        } else if (page == 0x4300) {
            // --------------------------
            // DMA 0
            // --------------------------
            value = Bit.toUint8(this.registers.dma0.control.get());
        } else if (page == 0x4301) {
            value = Bit.toUint8(this.registers.dma0.ppuAddressRegister.get());
        } else if (page == 0x4302) {
            value = Bit.toUint8(this.registers.dma0.cpuAddressRegister.getLower());
        } else if (page == 0x4303) {
            value = Bit.toUint8(this.registers.dma0.cpuAddressRegister.getMiddle());
        } else if (page == 0x4304) {
            value = Bit.toUint8(this.registers.dma0.cpuAddressRegister.getUpper());
        } else if (page == 0x4305) {
            value = Bit.toUint8(this.registers.dma0.transferSize.getLower());
        } else if (page == 0x4306) {
            value = Bit.toUint8(this.registers.dma0.transferSize.getUpper());
        } else if (page == 0x4307) {
            value = Bit.toUint8(this.registers.dma0.dasbx.get());
        } else if (page == 0x4308) {
            value = Bit.toUint8(this.registers.dma0.a2axl.get());
        } else if (page == 0x4309) {
            value = Bit.toUint8(this.registers.dma0.a2axh.get());
        } else if (page == 0x430A) {
            value = Bit.toUint8(this.registers.dma0.ntlrx.get());
        } else if (page == 0x4310) {
            // --------------------------
            // DMA 1
            // --------------------------
            value = Bit.toUint8(this.registers.dma1.control.get());
        } else if (page == 0x4311) {
            value = Bit.toUint8(this.registers.dma1.ppuAddressRegister.get());
        } else if (page == 0x4312) {
            value = Bit.toUint8(this.registers.dma1.cpuAddressRegister.getLower());
        } else if (page == 0x4313) {
            value = Bit.toUint8(this.registers.dma1.cpuAddressRegister.getMiddle());
        } else if (page == 0x4314) {
            value = Bit.toUint8(this.registers.dma1.cpuAddressRegister.getUpper());
        } else if (page == 0x4315) {
            value = Bit.toUint8(this.registers.dma1.transferSize.getLower());
        } else if (page == 0x4316) {
            value = Bit.toUint8(this.registers.dma1.transferSize.getUpper());
        } else if (page == 0x4317) {
            value = Bit.toUint8(this.registers.dma1.dasbx.get());
        } else if (page == 0x4318) {
            value = Bit.toUint8(this.registers.dma1.a2axl.get());
        } else if (page == 0x4319) {
            value = Bit.toUint8(this.registers.dma1.a2axh.get());
        } else if (page == 0x431A) {
            value = Bit.toUint8(this.registers.dma1.ntlrx.get());
        } else if (page == 0x4320) {
            // --------------------------
            // DMA 2
            // --------------------------
            value = Bit.toUint8(this.registers.dma2.control.get());
        } else if (page == 0x4321) {
            value = Bit.toUint8(this.registers.dma2.ppuAddressRegister.get());
        } else if (page == 0x4322) {
            value = Bit.toUint8(this.registers.dma2.cpuAddressRegister.getLower());
        } else if (page == 0x4323) {
            value = Bit.toUint8(this.registers.dma2.cpuAddressRegister.getMiddle());
        } else if (page == 0x4324) {
            value = Bit.toUint8(this.registers.dma2.cpuAddressRegister.getUpper());
        } else if (page == 0x4325) {
            value = Bit.toUint8(this.registers.dma2.transferSize.getLower());
        } else if (page == 0x4326) {
            value = Bit.toUint8(this.registers.dma2.transferSize.getUpper());
        } else if (page == 0x4327) {
            value = Bit.toUint8(this.registers.dma2.dasbx.get());
        } else if (page == 0x4328) {
            value = Bit.toUint8(this.registers.dma2.a2axl.get());
        } else if (page == 0x4329) {
            value = Bit.toUint8(this.registers.dma2.a2axh.get());
        } else if (page == 0x432A) {
            value = Bit.toUint8(this.registers.dma2.ntlrx.get());
        } else if (page == 0x4330) {
            // --------------------------
            // DMA 3
            // --------------------------
            value = Bit.toUint8(this.registers.dma3.control.get());
        } else if (page == 0x4331) {
            value = Bit.toUint8(this.registers.dma3.ppuAddressRegister.get());
        } else if (page == 0x4332) {
            value = Bit.toUint8(this.registers.dma3.cpuAddressRegister.getLower());
        } else if (page == 0x4333) {
            value = Bit.toUint8(this.registers.dma3.cpuAddressRegister.getMiddle());
        } else if (page == 0x4334) {
            value = Bit.toUint8(this.registers.dma3.cpuAddressRegister.getUpper());
        } else if (page == 0x4335) {
            value = Bit.toUint8(this.registers.dma3.transferSize.getLower());
        } else if (page == 0x4336) {
            value = Bit.toUint8(this.registers.dma3.transferSize.getUpper());
        } else if (page == 0x4337) {
            value = Bit.toUint8(this.registers.dma3.dasbx.get());
        } else if (page == 0x4338) {
            value = Bit.toUint8(this.registers.dma3.a2axl.get());
        } else if (page == 0x4339) {
            value = Bit.toUint8(this.registers.dma3.a2axh.get());
        } else if (page == 0x433A) {
            value = Bit.toUint8(this.registers.dma3.ntlrx.get());
        } else if (page == 0x4340) {
            // --------------------------
            // DMA 4
            // --------------------------
            value = Bit.toUint8(this.registers.dma4.control.get());
        } else if (page == 0x4341) {
            value = Bit.toUint8(this.registers.dma4.ppuAddressRegister.get());
        } else if (page == 0x4342) {
            value = Bit.toUint8(this.registers.dma4.cpuAddressRegister.getLower());
        } else if (page == 0x4343) {
            value = Bit.toUint8(this.registers.dma4.cpuAddressRegister.getMiddle());
        } else if (page == 0x4344) {
            value = Bit.toUint8(this.registers.dma4.cpuAddressRegister.getUpper());
        } else if (page == 0x4345) {
            value = Bit.toUint8(this.registers.dma4.transferSize.getLower());
        } else if (page == 0x4346) {
            value = Bit.toUint8(this.registers.dma4.transferSize.getUpper());
        } else if (page == 0x4347) {
            value = Bit.toUint8(this.registers.dma4.dasbx.get());
        } else if (page == 0x4348) {
            value = Bit.toUint8(this.registers.dma4.a2axl.get());
        } else if (page == 0x4349) {
            value = Bit.toUint8(this.registers.dma4.a2axh.get());
        } else if (page == 0x434A) {
            value = Bit.toUint8(this.registers.dma4.ntlrx.get());
        } else if (page == 0x4350) {
            // --------------------------
            // DMA 5
            // --------------------------
            value = Bit.toUint8(this.registers.dma5.control.get());
        } else if (page == 0x4351) {
            value = Bit.toUint8(this.registers.dma5.ppuAddressRegister.get());
        } else if (page == 0x4352) {
            value = Bit.toUint8(this.registers.dma5.cpuAddressRegister.getLower());
        } else if (page == 0x4353) {
            value = Bit.toUint8(this.registers.dma5.cpuAddressRegister.getMiddle());
        } else if (page == 0x4354) {
            value = Bit.toUint8(this.registers.dma5.cpuAddressRegister.getUpper());
        } else if (page == 0x4355) {
            value = Bit.toUint8(this.registers.dma5.transferSize.getLower());
        } else if (page == 0x4356) {
            value = Bit.toUint8(this.registers.dma5.transferSize.getUpper());
        } else if (page == 0x4357) {
            value = Bit.toUint8(this.registers.dma5.dasbx.get());
        } else if (page == 0x4358) {
            value = Bit.toUint8(this.registers.dma5.a2axl.get());
        } else if (page == 0x4359) {
            value = Bit.toUint8(this.registers.dma5.a2axh.get());
        } else if (page == 0x435A) {
            value = Bit.toUint8(this.registers.dma5.ntlrx.get());
        } else if (page == 0x4360) {
            // --------------------------
            // DMA 6
            // --------------------------
            value = Bit.toUint8(this.registers.dma6.control.get());
        } else if (page == 0x4361) {
            value = Bit.toUint8(this.registers.dma6.ppuAddressRegister.get());
        } else if (page == 0x4362) {
            value = Bit.toUint8(this.registers.dma6.cpuAddressRegister.getLower());
        } else if (page == 0x4363) {
            value = Bit.toUint8(this.registers.dma6.cpuAddressRegister.getMiddle());
        } else if (page == 0x4364) {
            value = Bit.toUint8(this.registers.dma6.cpuAddressRegister.getUpper());
        } else if (page == 0x4365) {
            value = Bit.toUint8(this.registers.dma6.transferSize.getLower());
        } else if (page == 0x4366) {
            value = Bit.toUint8(this.registers.dma6.transferSize.getUpper());
        } else if (page == 0x4367) {
            value = Bit.toUint8(this.registers.dma6.dasbx.get());
        } else if (page == 0x4368) {
            value = Bit.toUint8(this.registers.dma6.a2axl.get());
        } else if (page == 0x4369) {
            value = Bit.toUint8(this.registers.dma6.a2axh.get());
        } else if (page == 0x436A) {
            value = Bit.toUint8(this.registers.dma6.ntlrx.get());
        } else if (page == 0x4370) {
            // --------------------------
            // DMA 7
            // --------------------------
            value = Bit.toUint8(this.registers.dma7.control.get());
        } else if (page == 0x4371) {
            value = Bit.toUint8(this.registers.dma7.ppuAddressRegister.get());
        } else if (page == 0x4372) {
            value = Bit.toUint8(this.registers.dma7.cpuAddressRegister.getLower());
        } else if (page == 0x4373) {
            value = Bit.toUint8(this.registers.dma7.cpuAddressRegister.getMiddle());
        } else if (page == 0x4374) {
            value = Bit.toUint8(this.registers.dma7.cpuAddressRegister.getUpper());
        } else if (page == 0x4375) {
            value = Bit.toUint8(this.registers.dma7.transferSize.getLower());
        } else if (page == 0x4376) {
            value = Bit.toUint8(this.registers.dma7.transferSize.getUpper());
        } else if (page == 0x4377) {
            value = Bit.toUint8(this.registers.dma7.dasbx.get());
        } else if (page == 0x4378) {
            value = Bit.toUint8(this.registers.dma7.a2axl.get());
        } else if (page == 0x4379) {
            value = Bit.toUint8(this.registers.dma7.a2axh.get());
        } else if (page == 0x437A) {
            value = Bit.toUint8(this.registers.dma7.ntlrx.get());
        } else {
            console.warn("Invalid read on BusA at " + address);
        }

        return Bit.toUint8(value);
    }


    public writeByte(address: number, value: number): void {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        if (value == null || value < 0 || value > 0xFF) {
            throw new Error(`Invalid write given at ${address}=${value}`);
        }

        if (page < 0x2100 || page > 0x43FF) {
            throw new Error("Invalid writeByte at " + address);
        }

        if (page == 0x4016) {
            this.registers.oldJoy1.set(value);
        } else if (page == 0x4017) {
            this.registers.oldJoy2.set(value);
        } else if (page == 0x4200) {
            this.registers.nmitimen.set(value);
        } else if (page == 0x4201) {
            this.registers.wrio.set(value);
        } else if (page == 0x4202) {
            this.registers.wrmpya.set(value);
        } else if (page == 0x4203) {
            this.registers.wrmpyb.set(value);
        } else if (page == 0x4204) {
            this.registers.wrdivl.set(value);
        } else if (page == 0x4205) {
            this.registers.wrdivh.set(value);
        } else if (page == 0x4206) {
            this.registers.wrdivb.set(value);
        } else if (page == 0x4207) {
            this.registers.htime.setLower(value);
        } else if (page == 0x4208) {
            this.registers.htime.setUpper(value);
        } else if (page == 0x4209) {
            this.registers.vtime.setLower(value);
        } else if (page == 0x420A) {
            this.registers.vtime.setUpper(value);
        } else if (page == 0x420B) {
            this.registers.mdmaen.set(value);
        } else if (page == 0x420C) {
            this.registers.hdmaen.set(value);
        } else if (page == 0x420D) {
            this.registers.memsel.set(value);
        } else if (page == 0x4210) {
            this.registers.rdnmi.set(value);
        } else if (page == 0x4211) {
            this.registers.timeup.set(value);
        } else if (page == 0x4212) {
            this.registers.hvbjoy.set(value);
        } else if (page == 0x4213) {
            this.registers.rdio.set(value);
        } else if (page == 0x4214) {
            this.registers.rddivl.set(value);
        } else if (page == 0x4215) {
            this.registers.rddivh.set(value);
        } else if (page == 0x4216) {
            this.registers.rdmpyl.set(value);
        } else if (page == 0x4217) {
            this.registers.rdmpyh.set(value);
        } else if (page == 0x4218) {
            this.registers.joy1.setLower(value);
        } else if (page == 0x4219) {
            this.registers.joy1.setUpper(value);
        } else if (page == 0x421A) {
            this.registers.joy2.setLower(value);
        } else if (page == 0x421B) {
            this.registers.joy2.setUpper(value);
        } else if (page == 0x421C) {
            this.registers.joy3l.set(value);
        } else if (page == 0x421D) {
            this.registers.joy3h.set(value);
        } else if (page == 0x421E) {
            this.registers.joy4l.set(value);
        } else if (page == 0x421F) {
            this.registers.joy4h.set(value);
        } else if (page == 0x4300) {
            // --------------------------
            // DMA 0
            // --------------------------
            this.registers.dma0.control.set(value);
        } else if (page == 0x4301) {
            this.registers.dma0.ppuAddressRegister.set(value);
        } else if (page == 0x4302) {
            this.registers.dma0.cpuAddressRegister.setLower(value);
        } else if (page == 0x4303) {
            this.registers.dma0.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4304) {
            this.registers.dma0.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4305) {
            this.registers.dma0.transferSize.setLower(value);
        } else if (page == 0x4306) {
            this.registers.dma0.transferSize.setUpper(value);
        } else if (page == 0x4307) {
            this.registers.dma0.dasbx.set(value);
        } else if (page == 0x4308) {
            this.registers.dma0.a2axl.set(value);
        } else if (page == 0x4309) {
            this.registers.dma0.a2axh.set(value);
        } else if (page == 0x430A) {
            this.registers.dma0.ntlrx.set(value);
        } else if (page == 0x4310) {
            // --------------------------
            // DMA 1
            // --------------------------
            this.registers.dma1.control.set(value);
        } else if (page == 0x4311) {
            this.registers.dma1.ppuAddressRegister.set(value);
        } else if (page == 0x4312) {
            this.registers.dma1.cpuAddressRegister.setLower(value);
        } else if (page == 0x4313) {
            this.registers.dma1.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4314) {
            this.registers.dma1.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4315) {
            this.registers.dma1.transferSize.setLower(value);
        } else if (page == 0x4316) {
            this.registers.dma1.transferSize.setUpper(value);
        } else if (page == 0x4317) {
            this.registers.dma1.dasbx.set(value);
        } else if (page == 0x4318) {
            this.registers.dma1.a2axl.set(value);
        } else if (page == 0x4319) {
            this.registers.dma1.a2axh.set(value);
        } else if (page == 0x431A) {
            this.registers.dma1.ntlrx.set(value);
        } else if (page == 0x4320) {
            // --------------------------
            // DMA 2
            // --------------------------
            this.registers.dma2.control.set(value);
        } else if (page == 0x4321) {
            this.registers.dma2.ppuAddressRegister.set(value);
        } else if (page == 0x4322) {
            this.registers.dma2.cpuAddressRegister.setLower(value);
        } else if (page == 0x4323) {
            this.registers.dma2.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4324) {
            this.registers.dma2.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4325) {
            this.registers.dma2.transferSize.setLower(value);
        } else if (page == 0x4326) {
            this.registers.dma2.transferSize.setUpper(value);
        } else if (page == 0x4327) {
            this.registers.dma2.dasbx.set(value);
        } else if (page == 0x4328) {
            this.registers.dma2.a2axl.set(value);
        } else if (page == 0x4329) {
            this.registers.dma2.a2axh.set(value);
        } else if (page == 0x432A) {
            this.registers.dma2.ntlrx.set(value);
        } else if (page == 0x4330) {
            // --------------------------
            // DMA 3
            // --------------------------
            this.registers.dma3.control.set(value);
        } else if (page == 0x4331) {
            this.registers.dma3.ppuAddressRegister.set(value);
        } else if (page == 0x4332) {
            this.registers.dma3.cpuAddressRegister.setLower(value);
        } else if (page == 0x4333) {
            this.registers.dma3.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4334) {
            this.registers.dma3.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4335) {
            this.registers.dma3.transferSize.setLower(value);
        } else if (page == 0x4336) {
            this.registers.dma3.transferSize.setUpper(value);
        } else if (page == 0x4337) {
            this.registers.dma3.dasbx.set(value);
        } else if (page == 0x4338) {
            this.registers.dma3.a2axl.set(value);
        } else if (page == 0x4339) {
            this.registers.dma3.a2axh.set(value);
        } else if (page == 0x433A) {
            this.registers.dma3.ntlrx.set(value);
        } else if (page == 0x4340) {
            // --------------------------
            // DMA 4
            // --------------------------
            this.registers.dma4.control.set(value);
        } else if (page == 0x4341) {
            this.registers.dma4.ppuAddressRegister.set(value);
        } else if (page == 0x4342) {
            this.registers.dma4.cpuAddressRegister.setLower(value);
        } else if (page == 0x4343) {
            this.registers.dma4.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4344) {
            this.registers.dma4.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4345) {
            this.registers.dma4.transferSize.setLower(value);
        } else if (page == 0x4346) {
            this.registers.dma4.transferSize.setUpper(value);
        } else if (page == 0x4347) {
            this.registers.dma4.dasbx.set(value);
        } else if (page == 0x4348) {
            this.registers.dma4.a2axl.set(value);
        } else if (page == 0x4349) {
            this.registers.dma4.a2axh.set(value);
        } else if (page == 0x434A) {
            this.registers.dma4.ntlrx.set(value);
        } else if (page == 0x4350) {
            // --------------------------
            // DMA 5
            // --------------------------
            this.registers.dma5.control.set(value);
        } else if (page == 0x4351) {
            this.registers.dma5.ppuAddressRegister.set(value);
        } else if (page == 0x4352) {
            this.registers.dma5.cpuAddressRegister.setLower(value);
        } else if (page == 0x4353) {
            this.registers.dma5.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4354) {
            this.registers.dma5.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4355) {
            this.registers.dma5.transferSize.setLower(value);
        } else if (page == 0x4356) {
            this.registers.dma5.transferSize.setUpper(value);
        } else if (page == 0x4357) {
            this.registers.dma5.dasbx.set(value);
        } else if (page == 0x4358) {
            this.registers.dma5.a2axl.set(value);
        } else if (page == 0x4359) {
            this.registers.dma5.a2axh.set(value);
        } else if (page == 0x435A) {
            this.registers.dma5.ntlrx.set(value);
        } else if (page == 0x4360) {
            // --------------------------
            // DMA 6
            // --------------------------
            this.registers.dma6.control.set(value);
        } else if (page == 0x4361) {
            this.registers.dma6.ppuAddressRegister.set(value);
        } else if (page == 0x4362) {
            this.registers.dma6.cpuAddressRegister.setLower(value);
        } else if (page == 0x4363) {
            this.registers.dma6.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4364) {
            this.registers.dma6.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4365) {
            this.registers.dma6.transferSize.setLower(value);
        } else if (page == 0x4366) {
            this.registers.dma6.transferSize.setUpper(value);
        } else if (page == 0x4367) {
            this.registers.dma6.dasbx.set(value);
        } else if (page == 0x4368) {
            this.registers.dma6.a2axl.set(value);
        } else if (page == 0x4369) {
            this.registers.dma6.a2axh.set(value);
        } else if (page == 0x436A) {
            this.registers.dma6.ntlrx.set(value);
        } else if (page == 0x4370) {
            // --------------------------
            // DMA 7
            // --------------------------
            this.registers.dma7.control.set(value);
        } else if (page == 0x4371) {
            this.registers.dma7.ppuAddressRegister.set(value);
        } else if (page == 0x4372) {
            this.registers.dma7.cpuAddressRegister.setLower(value);
        } else if (page == 0x4373) {
            this.registers.dma7.cpuAddressRegister.setMiddle(value);
        } else if (page == 0x4374) {
            this.registers.dma7.cpuAddressRegister.setUpper(value);
        } else if (page == 0x4375) {
            this.registers.dma7.transferSize.setLower(value);
        } else if (page == 0x4376) {
            this.registers.dma7.transferSize.setUpper(value);
        } else if (page == 0x4377) {
            this.registers.dma7.dasbx.set(value);
        } else if (page == 0x4378) {
            this.registers.dma7.a2axl.set(value);
        } else if (page == 0x4379) {
            this.registers.dma7.a2axh.set(value);
        } else if (page == 0x437A) {
            this.registers.dma7.ntlrx.set(value);
        } else {
            console.warn("Invalid write on BusA at " + address);
        }
    }
}