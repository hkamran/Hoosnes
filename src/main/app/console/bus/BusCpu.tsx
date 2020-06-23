import {Console} from "../Console";
import {Objects} from "../../util/Objects";
import {AddressUtil} from "../../util/AddressUtil";
import {Bit} from "../../util/Bit";
import {Registers} from "../io/Registers";
import {AbstractRegister} from "../../interfaces/AbstractRegister";

/**
 * Bus for IO registers in the CPU
 */
export class BusCpu {

    private console: Console;
    private registers: Registers;

    public mdr: number = 0x0;

    public map: { [address: number] : AbstractRegister } = {}

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.cpu.registers);

        this.console = console;
        this.registers = console.io.registers;

        this.map[0x4016] = this.registers.oldJoy1;
        this.map[0x4017] = this.registers.oldJoy2;
        this.map[0x4200] = this.registers.nmitimen;
        this.map[0x4201] = this.registers.wrio;
        this.map[0x4202] = this.registers.wrmpya;
        this.map[0x4203] = this.registers.wrmpyb;
        this.map[0x4204] = this.registers.wrdivl;
        this.map[0x4205] = this.registers.wrdivh;
        this.map[0x4206] = this.registers.wrdivb;
        this.map[0x4207] = this.registers.htime;
        this.map[0x4208] = this.registers.htime;
        this.map[0x4209] = this.registers.vtime;
        this.map[0x420A] = this.registers.vtime;
        this.map[0x420B] = this.registers.mdmaen;
        this.map[0x420C] = this.registers.hdmaen;
        this.map[0x420D] = this.registers.memsel;
        this.map[0x4210] = this.registers.rdnmi;
        this.map[0x4211] = this.registers.timeup;
        this.map[0x4212] = this.registers.hvbjoy;
        this.map[0x4213] = this.registers.rdio;
        this.map[0x4214] = this.registers.rddivl;
        this.map[0x4215] = this.registers.rddivh;
        this.map[0x4216] = this.registers.rdmpyl;
        this.map[0x4217] = this.registers.rdmpyh;
        this.map[0x4218] = this.registers.joy1l;
        this.map[0x4219] = this.registers.joy1h;
        this.map[0x421A] = this.registers.joy2l;
        this.map[0x421B] = this.registers.joy2h;
        this.map[0x421C] = this.registers.joy3l;
        this.map[0x421D] = this.registers.joy3h;
        this.map[0x421E] = this.registers.joy4l;
        this.map[0x421F] = this.registers.joy4h;

        this.map[0x4300] = this.registers.dma0.control;
        this.map[0x4301] = this.registers.dma0.ppuAddressRegister;
        this.map[0x4302] = this.registers.dma0.cpuAddressRegister.a1tl;
        this.map[0x4303] = this.registers.dma0.cpuAddressRegister.a1tm;
        this.map[0x4304] = this.registers.dma0.cpuAddressRegister.a1th;
        this.map[0x4305] = this.registers.dma0.transferSize.dasl;
        this.map[0x4306] = this.registers.dma0.transferSize.dash;
        this.map[0x4307] = this.registers.dma0.dasbx;
        this.map[0x4308] = this.registers.dma0.a2axl;
        this.map[0x4309] = this.registers.dma0.a2axh;
        this.map[0x430A] = this.registers.dma0.ntlrx;

        this.map[0x4310] = this.registers.dma1.control;
        this.map[0x4311] = this.registers.dma1.ppuAddressRegister;
        this.map[0x4312] = this.registers.dma1.cpuAddressRegister.a1tl;
        this.map[0x4313] = this.registers.dma1.cpuAddressRegister.a1tm;
        this.map[0x4314] = this.registers.dma1.cpuAddressRegister.a1th;
        this.map[0x4315] = this.registers.dma1.transferSize.dasl;
        this.map[0x4316] = this.registers.dma1.transferSize.dash;
        this.map[0x4317] = this.registers.dma1.dasbx;
        this.map[0x4318] = this.registers.dma1.a2axl;
        this.map[0x4319] = this.registers.dma1.a2axh;
        this.map[0x431A] = this.registers.dma1.ntlrx;

        this.map[0x4320] = this.registers.dma2.control;
        this.map[0x4321] = this.registers.dma2.ppuAddressRegister;
        this.map[0x4322] = this.registers.dma2.cpuAddressRegister.a1tl;
        this.map[0x4323] = this.registers.dma2.cpuAddressRegister.a1tm;
        this.map[0x4324] = this.registers.dma2.cpuAddressRegister.a1th;
        this.map[0x4325] = this.registers.dma2.transferSize.dasl;
        this.map[0x4326] = this.registers.dma2.transferSize.dash;
        this.map[0x4327] = this.registers.dma2.dasbx;
        this.map[0x4328] = this.registers.dma2.a2axl;
        this.map[0x4329] = this.registers.dma2.a2axh;
        this.map[0x432A] = this.registers.dma2.ntlrx;

        this.map[0x4330] = this.registers.dma3.control;
        this.map[0x4331] = this.registers.dma3.ppuAddressRegister;
        this.map[0x4332] = this.registers.dma3.cpuAddressRegister.a1tl;
        this.map[0x4333] = this.registers.dma3.cpuAddressRegister.a1tm;
        this.map[0x4334] = this.registers.dma3.cpuAddressRegister.a1th;
        this.map[0x4335] = this.registers.dma3.transferSize.dasl;
        this.map[0x4336] = this.registers.dma3.transferSize.dash;
        this.map[0x4337] = this.registers.dma3.dasbx;
        this.map[0x4338] = this.registers.dma3.a2axl;
        this.map[0x4339] = this.registers.dma3.a2axh;
        this.map[0x433A] = this.registers.dma3.ntlrx;

        this.map[0x4340] = this.registers.dma4.control;
        this.map[0x4341] = this.registers.dma4.ppuAddressRegister;
        this.map[0x4342] = this.registers.dma4.cpuAddressRegister.a1tl;
        this.map[0x4343] = this.registers.dma4.cpuAddressRegister.a1tm;
        this.map[0x4344] = this.registers.dma4.cpuAddressRegister.a1th;
        this.map[0x4345] = this.registers.dma4.transferSize.dasl;
        this.map[0x4346] = this.registers.dma4.transferSize.dash;
        this.map[0x4347] = this.registers.dma4.dasbx;
        this.map[0x4348] = this.registers.dma4.a2axl;
        this.map[0x4349] = this.registers.dma4.a2axh;
        this.map[0x434A] = this.registers.dma4.ntlrx;

        this.map[0x4350] = this.registers.dma5.control;
        this.map[0x4351] = this.registers.dma5.ppuAddressRegister;
        this.map[0x4352] = this.registers.dma5.cpuAddressRegister.a1tl;
        this.map[0x4353] = this.registers.dma5.cpuAddressRegister.a1tm;
        this.map[0x4354] = this.registers.dma5.cpuAddressRegister.a1th;
        this.map[0x4355] = this.registers.dma5.transferSize.dasl;
        this.map[0x4356] = this.registers.dma5.transferSize.dash;
        this.map[0x4357] = this.registers.dma5.dasbx;
        this.map[0x4358] = this.registers.dma5.a2axl;
        this.map[0x4359] = this.registers.dma5.a2axh;
        this.map[0x435A] = this.registers.dma5.ntlrx;

        this.map[0x4360] = this.registers.dma6.control;
        this.map[0x4361] = this.registers.dma6.ppuAddressRegister;
        this.map[0x4362] = this.registers.dma6.cpuAddressRegister.a1tl;
        this.map[0x4363] = this.registers.dma6.cpuAddressRegister.a1tm;
        this.map[0x4364] = this.registers.dma6.cpuAddressRegister.a1th;
        this.map[0x4365] = this.registers.dma6.transferSize.dasl;
        this.map[0x4366] = this.registers.dma6.transferSize.dash;
        this.map[0x4367] = this.registers.dma6.dasbx;
        this.map[0x4368] = this.registers.dma6.a2axl;
        this.map[0x4369] = this.registers.dma6.a2axh;
        this.map[0x436A] = this.registers.dma6.ntlrx;

        this.map[0x4370] = this.registers.dma7.control;
        this.map[0x4371] = this.registers.dma7.ppuAddressRegister;
        this.map[0x4372] = this.registers.dma7.cpuAddressRegister.a1tl;
        this.map[0x4373] = this.registers.dma7.cpuAddressRegister.a1tm;
        this.map[0x4374] = this.registers.dma7.cpuAddressRegister.a1th;
        this.map[0x4375] = this.registers.dma7.transferSize.dasl;
        this.map[0x4376] = this.registers.dma7.transferSize.dash;
        this.map[0x4377] = this.registers.dma7.dasbx;
        this.map[0x4378] = this.registers.dma7.a2axl;
        this.map[0x4379] = this.registers.dma7.a2axh;
        this.map[0x437A] = this.registers.dma7.ntlrx;
    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        let value = Bit.toUint8(this.mdr);

        if (page < 0x2100 || page > 0x43FF) {
            throw new Error("Invalid readByte at " + address);
        }

        const register = this.map[page];
        if (register == null) {
            throw new Error(`Register not found for ${page}`);
        }

        value = register.get();

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
        const register = this.map[page];
        if (register == null) {
            throw new Error(`Register not found for ${page}`);
        }

        register.set(value);
    }
}