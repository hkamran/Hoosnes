import {Console} from "../Console";
import {Objects} from "../../util/Objects";
import {Registers} from "../ppu/Registers";
import {Bit} from "../../util/Bit";
import {AddressUtil} from "../../util/AddressUtil";

/**
 * Bus for IO registers in the PPU
 */
export class BusB {

    public console: Console;
    public registers: Registers;

    // Memory Data Register
    public mdr: number = 0x0;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.ppu);
        Objects.requireNonNull(console.ppu.registers);

        this.console = console;
        this.registers = console.ppu.registers;
    }

    public readByte(address: number): number {
        AddressUtil.assertValid(address);

        let bank = AddressUtil.getBank(address);
        let page = AddressUtil.getPage(address);

        let value = this.mdr;

        if (page < 0x2100 || page > 0x21FF) {
            throw new Error("Invalid readByte at " + address);
        }

        if (page == 0x2100) {
            value = Bit.toUint8(this.registers.inidisp.get());
        } else if (page == 0x2101) {
            value = Bit.toUint8(this.registers.oamselect.get());
        } else if (page == 0x2102) {
            value = Bit.toUint8(this.registers.oamaddr.getLower());
        } else if (page == 0x2103) {
            value = Bit.toUint8(this.registers.oamaddr.getUpper());
        } else if (page == 0x2104) {
            value = Bit.toUint8(this.registers.oamdataw.get());
        } else if (page == 0x2105) {
            value = Bit.toUint8(this.registers.bgmode.get());
        } else if (page == 0x2106) {
            value = Bit.toUint8(this.registers.mosaic.get());
        } else if (page == 0x2107) {
            value = Bit.toUint8(this.registers.vtilebg1.get());
        } else if (page == 0x2108) {
            value = Bit.toUint8(this.registers.vtilebg2.get());
        } else if (page == 0x2109) {
            value = Bit.toUint8(this.registers.vtilebg3.get());
        } else if (page == 0x210A) {
            value = Bit.toUint8(this.registers.vtilebg4.get());
        } else if (page == 0x210B) {
            value = Bit.toUint8(this.registers.vcharlocbg12.get());
        } else if (page == 0x210C) {
            value = Bit.toUint8(this.registers.vcharlocbg34.get());
        } else if (page == 0x210D) {
            value = Bit.toUint8(this.registers.bg1hofs.get());
        } else if (page == 0x210E) {
            value = Bit.toUint8(this.registers.bg1vofs.get());
        } else if (page == 0x210F) {
            value = Bit.toUint8(this.registers.bg2hofs.get());
        } else if (page == 0x2110) {
            value = Bit.toUint8(this.registers.bg2vofs.get());
        } else if (page == 0x2111) {
            value = Bit.toUint8(this.registers.bg3hofs.get());
        } else if (page == 0x2112) {
            value = Bit.toUint8(this.registers.bg3vofs.get());
        } else if (page == 0x2113) {
            value = Bit.toUint8(this.registers.bg4hofs.get());
        } else if (page == 0x2114) {
            value = Bit.toUint8(this.registers.bg4vofs.get());
        } else if (page == 0x2115) {
            value = Bit.toUint8(this.registers.vportcntrl.get());
        } else if (page == 0x2116) {
            value = Bit.toUint8(this.registers.vaddr.getLower());
        } else if (page == 0x2117) {
            value = Bit.toUint8(this.registers.vaddr.getUpper());
        } else if (page == 0x2118) {
            value = Bit.toUint8(this.registers.vdataw.getLower());
        } else if (page == 0x2119) {
            value = Bit.toUint8(this.registers.vdataw.getUpper());
        } else if (page == 0x211A) {
            value = Bit.toUint8(this.registers.m7sel.get());
        } else if (page == 0x211B) {
            value = Bit.toUint8(this.registers.m7a.get());
        } else if (page == 0x211C) {
            value = Bit.toUint8(this.registers.m7b.get());
        } else if (page == 0x211D) {
            value = Bit.toUint8(this.registers.m7c.get());
        } else if (page == 0x211E) {
            value = Bit.toUint8(this.registers.m7d.get());
        } else if (page == 0x211F) {
            value = Bit.toUint8(this.registers.m7x.get());
        } else if (page == 0x2120) {
            value = Bit.toUint8(this.registers.m7y.get());
        } else if (page == 0x2121) {
            value = Bit.toUint8(this.registers.cgramaddr.get());
        } else if (page == 0x2122) {
            value = Bit.toUint8(this.registers.cgdataw.get());
        } else if (page == 0x2123) {
            value = Bit.toUint8(this.registers.w12sel.get());
        } else if (page == 0x2124) {
            value = Bit.toUint8(this.registers.w34sel.get());
        } else if (page == 0x2125) {
            value = Bit.toUint8(this.registers.wobjsel.get());
        } else if (page == 0x2126) {
            value = Bit.toUint8(this.registers.wh0.get());
        } else if (page == 0x2127) {
            value = Bit.toUint8(this.registers.wh1.get());
        } else if (page == 0x2128) {
            value = Bit.toUint8(this.registers.wh2.get());
        } else if (page == 0x2129) {
            value = Bit.toUint8(this.registers.wh3.get());
        } else if (page == 0x212A) {
            value = Bit.toUint8(this.registers.wbglog.get());
        } else if (page == 0x212B) {
            value = Bit.toUint8(this.registers.wobjlog.get());
        } else if (page == 0x212C) {
            value = Bit.toUint8(this.registers.tm.get());
        } else if (page == 0x212D) {
            value = Bit.toUint8(this.registers.ts.get());
        } else if (page == 0x212E) {
            value = Bit.toUint8(this.registers.tmw.get());
        } else if (page == 0x212F) {
            value = Bit.toUint8(this.registers.tsw.get());
        } else if (page == 0x2130) {
            value = Bit.toUint8(this.registers.cgwsel.get());
        } else if (page == 0x2131) {
            value = Bit.toUint8(this.registers.cgadsub.get());
        } else if (page == 0x2132) {
            value = Bit.toUint8(this.registers.coldata.get());
        } else if (page == 0x2133) {
            value = Bit.toUint8(this.registers.setini.get());
        } else if (page == 0x2134) {
            value = Bit.toUint8(this.registers.mpyl.get());
        } else if (page == 0x2135) {
            value = Bit.toUint8(this.registers.mpym.get());
        } else if (page == 0x2136) {
            value = Bit.toUint8(this.registers.mpyh.get());
        } else if (page == 0x2137) {
            value = Bit.toUint8(this.registers.slhv.get());
        } else if (page == 0x2138) {
            value = Bit.toUint8(this.registers.oamdatar.get());
        } else if (page == 0x2139) {
            value = Bit.toUint8(this.registers.vdatar.getLower());
        } else if (page == 0x213A) {
            value = Bit.toUint8(this.registers.vdatar.getUpper());
        } else if (page == 0x213B) {
            value = Bit.toUint8(this.registers.cgdatar.get());
        } else if (page == 0x213C) {
            value = Bit.toUint8(this.registers.scanlochort.get());
        } else if (page == 0x213D) {
            value = Bit.toUint8(this.registers.scanlocvert.get());
        } else if (page == 0x213E) {
            value = Bit.toUint8(this.registers.stat77.get());
        } else if (page == 0x213F) {
            value = Bit.toUint8(this.registers.stat78.get());
        } else if (page >= 0x2140 && page <= 0x2179) {
            if (page % 4 == 0) {
                value = Bit.toUint8(this.console.apu.registers.apuio0.get());
            } else if (page % 4 == 1) {
                value = Bit.toUint8(this.console.apu.registers.apuio1.get());
            } else if (page % 4 == 2) {
                value = Bit.toUint8(this.console.apu.registers.apuio2.get());
            } else if (page % 4 == 3) {
                value = Bit.toUint8(this.console.apu.registers.apuio3.get());
            }
        } else if (page == 0x2180) {
            value = Bit.toUint8(this.console.io.registers.wmdata.get());
        } else if (page == 0x2181) {
            value = Bit.toUint8(this.console.io.registers.wmaddl.get());
        } else if (page == 0x2182) {
            value = Bit.toUint8(this.console.io.registers.wmaddm.get());
        } else if (page == 0x2183) {
            value = Bit.toUint8(this.console.io.registers.wmaddh.get());
        } else if (page <= 0x21FF) {
            console.warn("Invalid read on BusB at " + address);
        } else {
            throw new Error("Invalid value on BusB at " + address);
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

        if (page == 0x2100) {
            this.registers.inidisp.set(value);
        } else if (page == 0x2101) {
            this.registers.oamselect.set(value);
        } else if (page == 0x2102) {
            this.registers.oamaddr.setLower(value);
        } else if (page == 0x2103) {
            this.registers.oamaddr.setUpper(value);
        } else if (page == 0x2104) {
            this.registers.oamdataw.set(value);
        } else if (page == 0x2105) {
            this.registers.bgmode.set(value);
        } else if (page == 0x2106) {
            this.registers.mosaic.set(value);
        } else if (page == 0x2107) {
            this.registers.vtilebg1.set(value);
        } else if (page == 0x2108) {
            this.registers.vtilebg2.set(value);
        } else if (page == 0x2109) {
            this.registers.vtilebg3.set(value);
        } else if (page == 0x210A) {
            this.registers.vtilebg4.set(value);
        } else if (page == 0x210B) {
            this.registers.vcharlocbg12.set(value);
        } else if (page == 0x210C) {
            this.registers.vcharlocbg34.set(value);
        } else if (page == 0x210D) {
            this.registers.bg1hofs.set(value);
        } else if (page == 0x210E) {
            this.registers.bg1vofs.set(value);
        } else if (page == 0x210F) {
            this.registers.bg2hofs.set(value);
        } else if (page == 0x2110) {
            this.registers.bg2vofs.set(value);
        } else if (page == 0x2111) {
            this.registers.bg3hofs.set(value);
        } else if (page == 0x2112) {
            this.registers.bg3vofs.set(value);
        } else if (page == 0x2113) {
            this.registers.bg4hofs.set(value);
        } else if (page == 0x2114) {
            this.registers.bg4vofs.set(value);
        } else if (page == 0x2115) {
            this.registers.vportcntrl.set(value);
        } else if (page == 0x2116) {
            this.registers.vaddr.setLower(value);
        } else if (page == 0x2117) {
            this.registers.vaddr.setUpper(value);
        } else if (page == 0x2118) {
            this.registers.vdataw.setLower(value);
        } else if (page == 0x2119) {
            this.registers.vdataw.setUpper(value);
        } else if (page == 0x211A) {
            this.registers.m7sel.set(value);
        } else if (page == 0x211B) {
            this.registers.m7a.set(value);
        } else if (page == 0x211C) {
            this.registers.m7b.set(value);
        } else if (page == 0x211D) {
            this.registers.m7c.set(value);
        } else if (page == 0x211E) {
            this.registers.m7d.set(value);
        } else if (page == 0x211F) {
            this.registers.m7x.set(value);
        } else if (page == 0x2120) {
            this.registers.m7y.set(value);
        } else if (page == 0x2121) {
            this.registers.cgramaddr.set(value);
        } else if (page == 0x2122) {
            this.registers.cgdataw.set(value);
        } else if (page == 0x2123) {
            this.registers.w12sel.set(value);
        } else if (page == 0x2124) {
            this.registers.w34sel.set(value);
        } else if (page == 0x2125) {
            this.registers.wobjsel.set(value);
        } else if (page == 0x2126) {
            this.registers.wh0.set(value);
        } else if (page == 0x2127) {
            this.registers.wh1.set(value);
        } else if (page == 0x2128) {
            this.registers.wh2.set(value);
        } else if (page == 0x2129) {
            this.registers.wh3.set(value);
        } else if (page == 0x212A) {
            this.registers.wbglog.set(value);
        } else if (page == 0x212B) {
            this.registers.wobjlog.set(value);
        } else if (page == 0x212C) {
            this.registers.tm.set(value);
        } else if (page == 0x212D) {
            this.registers.ts.set(value);
        } else if (page == 0x212E) {
            this.registers.tmw.set(value);
        } else if (page == 0x212F) {
            this.registers.tsw.set(value);
        } else if (page == 0x2130) {
            this.registers.cgwsel.set(value);
        } else if (page == 0x2131) {
            this.registers.cgadsub.set(value);
        } else if (page == 0x2132) {
            this.registers.coldata.set(value);
        } else if (page == 0x2133) {
            this.registers.setini.set(value);
        } else if (page == 0x2134) {
            this.registers.mpyl.set(value);
        } else if (page == 0x2135) {
            this.registers.mpym.set(value);
        } else if (page == 0x2136) {
            this.registers.mpyh.set(value);
        } else if (page == 0x2137) {
            this.registers.slhv.set(value);
        } else if (page == 0x2138) {
            this.registers.oamdatar.set(value);
        } else if (page == 0x2139) {
            this.registers.vdatar.setLower(value);
        } else if (page == 0x213A) {
            this.registers.vdatar.setUpper(value);
        } else if (page == 0x213B) {
            this.registers.cgdatar.set(value);
        } else if (page == 0x213C) {
            this.registers.scanlochort.set(value);
        } else if (page == 0x213D) {
            this.registers.scanlocvert.set(value);
        } else if (page == 0x213E) {
            this.registers.stat77.set(value);
        } else if (page == 0x213F) {
            this.registers.stat78.set(value);
        } else if (page >= 0x2140 && page <= 0x2180) {
            if (page % 4 == 0) {
                this.console.apu.registers.apuio0.set(value);
            } else if (page % 4 == 1) {
                this.console.apu.registers.apuio1.set(value);
            } else if (page % 4 == 2) {
                this.console.apu.registers.apuio2.set(value);
            } else if (page % 4 == 3) {
                this.console.apu.registers.apuio3.set(value);
            }
        } else if (page == 0x2180) {
            this.console.io.registers.wmdata.set(value);
        } else if (page == 0x2181) {
            this.console.io.registers.wmaddl.set(value);
        } else if (page == 0x2182) {
            this.console.io.registers.wmaddm.set(value);
        } else if (page == 0x2183) {
            this.console.io.registers.wmaddh.set(value);
        } else if (0x2184 <= page && page <= 0x21FF) {
            console.warn("Invalid write on BusB at " + address);
        } else {
            throw new Error("Invalid write on BusB at " + address.toString());
        }
    }
}