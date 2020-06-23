import {Console} from "../Console";
import {Objects} from "../../util/Objects";
import {Registers} from "../ppu/Registers";
import {Bit} from "../../util/Bit";
import {AddressUtil} from "../../util/AddressUtil";
import {AbstractRegister} from "../../interfaces/AbstractRegister";

/**
 * Bus for IO registers in the PPU
 */
export class BusB {

    public console: Console;
    public registers: Registers;

    // Memory Data Register
    public mdr: number = 0x0;

    public map: { [address: number] : AbstractRegister } = {};

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.ppu);
        Objects.requireNonNull(console.ppu.registers);

        this.console = console;
        this.registers = console.ppu.registers;

        this.map[0x2100] = this.registers.inidisp;
        this.map[0x2101] = this.registers.oamselect;
        this.map[0x2102] = this.registers.oamaddr.oamaddl;
        this.map[0x2103] = this.registers.oamaddr.oamaddh;
        this.map[0x2104] = this.registers.oamdataw;
        this.map[0x2105] = this.registers.bgmode;
        this.map[0x2106] = this.registers.mosaic;

        this.map[0x2107] = this.registers.vtilebg1;
        this.map[0x2108] = this.registers.vtilebg2;
        this.map[0x2109] = this.registers.vtilebg3;
        this.map[0x210A] = this.registers.vtilebg4;
        this.map[0x210B] = this.registers.vcharlocbg12;
        this.map[0x210C] = this.registers.vcharlocbg34;
        this.map[0x210D] = this.registers.bg1hofs;
        this.map[0x210E] = this.registers.bg1vofs;
        this.map[0x210F] = this.registers.bg2hofs;
        this.map[0x2110] = this.registers.bg2vofs;
        this.map[0x2111] = this.registers.bg3hofs;
        this.map[0x2112] = this.registers.bg3vofs;
        this.map[0x2113] = this.registers.bg4hofs;
        this.map[0x2114] = this.registers.bg4vofs;
        this.map[0x2115] = this.registers.vportcntrl;
        this.map[0x2116] = this.registers.vaddr.vmaddl;
        this.map[0x2117] = this.registers.vaddr.vmaddh;
        this.map[0x2118] = this.registers.vdataw.vmdatal;
        this.map[0x2119] = this.registers.vdataw.vmdatah;

        this.map[0x211A] = this.registers.m7sel;
        this.map[0x211B] = this.registers.m7a;
        this.map[0x211C] = this.registers.m7b;
        this.map[0x211D] = this.registers.m7c;
        this.map[0x211E] = this.registers.m7d;
        this.map[0x211F] = this.registers.m7x;
        this.map[0x2120] = this.registers.m7y;

        this.map[0x2121] = this.registers.cgramaddr;
        this.map[0x2122] = this.registers.cgdataw;
        this.map[0x2123] = this.registers.w12sel;
        this.map[0x2124] = this.registers.w34sel;
        this.map[0x2125] = this.registers.wobjsel;
        this.map[0x2126] = this.registers.wh0;
        this.map[0x2127] = this.registers.wh1;
        this.map[0x2128] = this.registers.wh2;
        this.map[0x2129] = this.registers.wh3;
        this.map[0x212A] = this.registers.wbglog;
        this.map[0x212B] = this.registers.wobjlog;
        this.map[0x212C] = this.registers.tm;
        this.map[0x212D] = this.registers.ts;
        this.map[0x212E] = this.registers.tmw;
        this.map[0x212F] = this.registers.tsw;
        this.map[0x2130] = this.registers.cgwsel;
        this.map[0x2131] = this.registers.cgadsub;
        this.map[0x2132] = this.registers.coldata;
        this.map[0x2133] = this.registers.setini;
        this.map[0x2134] = this.registers.mpyl;
        this.map[0x2135] = this.registers.mpym;
        this.map[0x2136] = this.registers.mpyh;

        this.map[0x2137] = this.registers.slhv;
        this.map[0x2138] = this.registers.oamdatar;
        this.map[0x2139] = this.registers.vdatar.vmdatal;
        this.map[0x213A] = this.registers.vdatar.vmdatah;
        this.map[0x213B] = this.registers.cgdatar;
        this.map[0x213C] = this.registers.scanlochort;
        this.map[0x213D] = this.registers.scanlocvert;
        this.map[0x213E] = this.registers.stat77;
        this.map[0x213F] = this.registers.stat78;

        this.map[0x2180] = this.console.io.registers.wmdata;
        this.map[0x2181] = this.console.io.registers.wmaddl;
        this.map[0x2182] = this.console.io.registers.wmaddm;
        this.map[0x2183] = this.console.io.registers.wmaddh;

    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        let value = this.mdr;

        if (page < 0x2100 || page > 0x21FF) {
            throw new Error("Invalid readByte at " + address);
        }

        if (page >= 0x2140 && page <= 0x2179) {
            if (page % 4 == 0) {
                value = Bit.toUint8(this.console.apu.registers.apuio0.get());
            } else if (page % 4 == 1) {
                value = Bit.toUint8(this.console.apu.registers.apuio1.get());
            } else if (page % 4 == 2) {
                value = Bit.toUint8(this.console.apu.registers.apuio2.get());
            } else if (page % 4 == 3) {
                value = Bit.toUint8(this.console.apu.registers.apuio3.get());
            }
        } else {
            const register = this.map[page];
            if (register == null) {
                throw new Error(`Register not found for ${page}`);
            }

            value = register.get();
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

        if (page < 0x2100 || page > 0x21FF) {
            throw new Error("Invalid writeByte at " + address.toString());
        }

        if (page >= 0x2140 && page <= 0x2180) {
            if (page % 4 == 0) {
                this.console.apu.registers.apuio0.set(value);
            } else if (page % 4 == 1) {
                this.console.apu.registers.apuio1.set(value);
            } else if (page % 4 == 2) {
                this.console.apu.registers.apuio2.set(value);
            } else if (page % 4 == 3) {
                this.console.apu.registers.apuio3.set(value);
            }
        } else {
            const register = this.map[page];
            if (register == null) {
                throw new Error(`Register not found for ${page}`);
            }

            register.set(value);
        }
    }
}