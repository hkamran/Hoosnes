import {Address} from "./Address";
import {Read} from "./Read";
import {Write} from "./Write";
import {Console} from "../Console";
import {Objects} from "../util/Objects";
import {Registers} from "../ppu/Registers";
import {Bit} from "../util/Bit";

/**
 * Bus for IO registers in the PPU
 */
export class BusB {

    public console: Console;
    public registers: Registers;

    // Memory Data Register
    public mdr: number;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.cpu);
        Objects.requireNonNull(console.ppu);
        Objects.requireNonNull(console.ppu.registers);

        this.console = console;
        this.registers = console.ppu.registers;
    }

    public readByte(address: Address): number {
        if (address == null) {
            throw new Error("Invalid readByte at " + address);
        }

        let value: number = this.console.bus.mdr;

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x2100 || page > 0x21FF) {
            throw new Error("Invalid readByte at " + address);
        }

        if (page == 0x2100) {
            value = this.registers.inidisp.get();
        } else if (page == 0x2101) {
            value = this.registers.oamselect.get();
        } else if (page == 0x2102) {
            value = this.registers.oamaddr.getLower();
        } else if (page == 0x2103) {
            value = this.registers.oamaddr.getUpper();
        } else if (page == 0x2104) {
            value = this.registers.oamdataw.get();
        } else if (page == 0x2105) {
            value = this.registers.bgmode.get();
        } else if (page == 0x2106) {
            value = this.registers.mosaic.get();
        } else if (page == 0x2107) {
            value = this.registers.vtilebg1.get();
        } else if (page == 0x2108) {
            value = this.registers.vtilebg2.get();
        } else if (page == 0x2109) {
            value = this.registers.vtilebg3.get();
        } else if (page == 0x210A) {
            value = this.registers.vtilebg4.get();
        } else if (page == 0x210B) {
            value = this.registers.vcharlocbg12.get();
        } else if (page == 0x210C) {
            value = this.registers.vcharlocbg34.get();
        } else if (page == 0x210D) {
            value = this.registers.bg1hofs.get();
        } else if (page == 0x210E) {
            value = this.registers.bg1vofs.get();
        } else if (page == 0x210F) {
            value = this.registers.bg2hofs.get();
        } else if (page == 0x2110) {
            value = this.registers.bg2vofs.get();
        } else if (page == 0x2111) {
            value = this.registers.bg3hofs.get();
        } else if (page == 0x2112) {
            value = this.registers.bg3vofs.get();
        } else if (page == 0x2113) {
            value = this.registers.bg4hofs.get();
        } else if (page == 0x2114) {
            value = this.registers.bg4vofs.get();
        } else if (page == 0x2115) {
            value = this.registers.vportcntrl.get();
        } else if (page == 0x2116) {
            value = this.registers.vaddr.getLower();
        } else if (page == 0x2117) {
            value = this.registers.vaddr.getUpper();
        } else if (page == 0x2118) {
            value = this.registers.vdataw.getLower();
        } else if (page == 0x2119) {
            value = this.registers.vdataw.getUpper();
        } else if (page == 0x211A) {
            value = this.registers.m7sel.get();
        } else if (page == 0x211B) {
            value = this.registers.m7a.get();
        } else if (page == 0x211C) {
            value = this.registers.m7b.get();
        } else if (page == 0x211D) {
            value = this.registers.m7c.get();
        } else if (page == 0x211E) {
            value = this.registers.m7d.get();
        } else if (page == 0x211F) {
            value = this.registers.m7x.get();
        } else if (page == 0x2120) {
            value = this.registers.m7y.get();
        } else if (page == 0x2121) {
            value = this.registers.cgramaddr.get();
        } else if (page == 0x2122) {
            value = this.registers.cgdataw.get();
        } else if (page == 0x2123) {
            value = this.registers.w12sel.get();
        } else if (page == 0x2124) {
            value = this.registers.w34sel.get();
        } else if (page == 0x2125) {
            value = this.registers.wobjsel.get();
        } else if (page == 0x2126) {
            value = this.registers.wh0.get();
        } else if (page == 0x2127) {
            value = this.registers.wh1.get();
        } else if (page == 0x2128) {
            value = this.registers.wh2.get();
        } else if (page == 0x2129) {
            value = this.registers.wh3.get();
        } else if (page == 0x212A) {
            value = this.registers.wbglog.get();
        } else if (page == 0x212B) {
            value = this.registers.wobjlog.get();
        } else if (page == 0x212C) {
            value = this.registers.tm.get();
        } else if (page == 0x212D) {
            value = this.registers.ts.get();
        } else if (page == 0x212E) {
            value = this.registers.tmw.get();
        } else if (page == 0x212F) {
            value = this.registers.tsw.get();
        } else if (page == 0x2130) {
            value = this.registers.cgwsel.get();
        } else if (page == 0x2131) {
            value = this.registers.cgadsub.get();
        } else if (page == 0x2132) {
            value = this.registers.coldata.get();
        } else if (page == 0x2133) {
            value = this.registers.setini.get();
        } else if (page == 0x2134) {
            value = this.registers.mpyl.get();
        } else if (page == 0x2135) {
            value = this.registers.mpym.get();
        } else if (page == 0x2136) {
            value = this.registers.mpyh.get();
        } else if (page == 0x2137) {
            value = this.registers.slhv.get();
        } else if (page == 0x2138) {
            value = this.registers.oamdatar.get();
        } else if (page == 0x2139) {
            value = this.registers.vdatar.getLower();
        } else if (page == 0x213A) {
            value = this.registers.vdatar.getUpper();
        } else if (page == 0x213B) {
            value = this.registers.cgdatar.get();
        } else if (page == 0x213C) {
            value = this.registers.scanlochort.get();
        } else if (page == 0x213D) {
            value = this.registers.scanlocvert.get();
        } else if (page == 0x213E) {
            value = this.registers.stat77.get();
        } else if (page == 0x213F) {
            value = this.registers.stat78.get();
        } else if (page >= 0x2140 && page <= 0x2180) {
            if (page % 4 == 0) {
                value = this.console.apu.registers.apuio0.get();
            } else if (page % 4 == 1) {
                value = this.console.apu.registers.apuio1.get();
            } else if (page % 4 == 2) {
                value = this.console.apu.registers.apuio2.get();
            } else if (page % 4 == 3) {
                value = this.console.apu.registers.apuio3.get();
            }
        } else if (page == 0x2180) {
            value = this.console.cpu.registers.wmdata.get();
        } else if (page == 0x2181) {
            value = this.console.cpu.registers.wmadd.getLower();
        } else if (page == 0x2182) {
            value = this.console.cpu.registers.wmadd.getMiddle();
        } else if (page == 0x2183) {
            value = this.console.cpu.registers.wmadd.getUpper();
        } else if (page <= 0x21FF) {

        } else {
            throw new Error("Invalid value on BusB at " + address);
        }


        return Bit.toUint8(value);
    }


    public writeByte(address: Address, val: number): Write {
        if (address == null || val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid writeByte at " + address.toString() + " with " + val);
        }

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x2100 || page > 0x21FF) {
            throw new Error("Invalid writeByte at " + address.toString());
        }

        if (page == 0x2100) {
            this.registers.inidisp.set(val);
        } else if (page == 0x2101) {
            this.registers.oamselect.set(val);
        } else if (page == 0x2102) {
            this.registers.oamaddr.setLower(val);
        } else if (page == 0x2103) {
            this.registers.oamaddr.setUpper(val);
        } else if (page == 0x2104) {
            this.registers.oamdataw.set(val);
        } else if (page == 0x2105) {
            this.registers.bgmode.set(val);
        } else if (page == 0x2106) {
            this.registers.mosaic.set(val);
        } else if (page == 0x2107) {
            this.registers.vtilebg1.set(val);
        } else if (page == 0x2108) {
            this.registers.vtilebg2.set(val);
        } else if (page == 0x2109) {
            this.registers.vtilebg3.set(val);
        } else if (page == 0x210A) {
            this.registers.vtilebg4.set(val);
        } else if (page == 0x210B) {
            this.registers.vcharlocbg12.set(val);
        } else if (page == 0x210C) {
            this.registers.vcharlocbg34.set(val);
        } else if (page == 0x210D) {
            this.registers.bg1hofs.set(val);
        } else if (page == 0x210E) {
            this.registers.bg1vofs.set(val);
        } else if (page == 0x210F) {
            this.registers.bg2hofs.set(val);
        } else if (page == 0x2110) {
            this.registers.bg2vofs.set(val);
        } else if (page == 0x2111) {
            this.registers.bg3hofs.set(val);
        } else if (page == 0x2112) {
            this.registers.bg3vofs.set(val);
        } else if (page == 0x2113) {
            this.registers.bg4hofs.set(val);
        } else if (page == 0x2114) {
            this.registers.bg4vofs.set(val);
        } else if (page == 0x2115) {
            this.registers.vportcntrl.set(val);
        } else if (page == 0x2116) {
            this.registers.vaddr.setLower(val);
        } else if (page == 0x2117) {
            this.registers.vaddr.setUpper(val);
        } else if (page == 0x2118) {
            this.registers.vdataw.setLower(val);
        } else if (page == 0x2119) {
            this.registers.vdataw.setUpper(val);
        } else if (page == 0x211A) {
            this.registers.m7sel.set(val);
        } else if (page == 0x211B) {
            this.registers.m7a.set(val);
        } else if (page == 0x211C) {
            this.registers.m7b.set(val);
        } else if (page == 0x211D) {
            this.registers.m7c.set(val);
        } else if (page == 0x211E) {
            this.registers.m7d.set(val);
        } else if (page == 0x211F) {
            this.registers.m7x.set(val);
        } else if (page == 0x2120) {
            this.registers.m7y.set(val);
        } else if (page == 0x2121) {
            this.registers.cgramaddr.set(val);
        } else if (page == 0x2122) {
            this.registers.cgdataw.set(val);
        } else if (page == 0x2123) {
            this.registers.w12sel.set(val);
        } else if (page == 0x2124) {
            this.registers.w34sel.set(val);
        } else if (page == 0x2125) {
            this.registers.wobjsel.set(val);
        } else if (page == 0x2126) {
            this.registers.wh0.set(val);
        } else if (page == 0x2127) {
            this.registers.wh1.set(val);
        } else if (page == 0x2128) {
            this.registers.wh2.set(val);
        } else if (page == 0x2129) {
            this.registers.wh3.set(val);
        } else if (page == 0x212A) {
            this.registers.wbglog.set(val);
        } else if (page == 0x212B) {
            this.registers.wobjlog.set(val);
        } else if (page == 0x212C) {
            this.registers.tm.set(val);
        } else if (page == 0x212D) {
            this.registers.ts.set(val);
        } else if (page == 0x212E) {
            this.registers.tmw.set(val);
        } else if (page == 0x212F) {
            this.registers.tsw.set(val);
        } else if (page == 0x2130) {
            this.registers.cgwsel.set(val);
        } else if (page == 0x2131) {
            this.registers.cgadsub.set(val);
        } else if (page == 0x2132) {
            this.registers.coldata.set(val);
        } else if (page == 0x2133) {
            this.registers.setini.set(val);
        } else if (page == 0x2134) {
            this.registers.mpyl.set(val);
        } else if (page == 0x2135) {
            this.registers.mpym.set(val);
        } else if (page == 0x2136) {
            this.registers.mpyh.set(val);
        } else if (page == 0x2137) {
            this.registers.slhv.set(val);
        } else if (page == 0x2138) {
            this.registers.oamdatar.set(val);
        } else if (page == 0x2139) {
            this.registers.vdatar.setLower(val);
        } else if (page == 0x213A) {
            this.registers.vdatar.setUpper(val);
        } else if (page == 0x213B) {
            this.registers.cgdatar.set(val);
        } else if (page == 0x213C) {
            this.registers.scanlochort.set(val);
        } else if (page == 0x213D) {
            this.registers.scanlocvert.set(val);
        } else if (page == 0x213E) {
            this.registers.stat77.set(val);
        } else if (page == 0x213F) {
            this.registers.stat78.set(val);
        } else if (page >= 0x2140 && page <= 0x2180) {
            if (page % 4 == 0) {
                this.console.apu.registers.apuio0.set(val);
            } else if (page % 4 == 1) {
                this.console.apu.registers.apuio1.set(val);
            } else if (page % 4 == 2) {
                this.console.apu.registers.apuio2.set(val);
            } else if (page % 4 == 3) {
                this.console.apu.registers.apuio3.set(val);
            }
        } else if (page == 0x2180) {
            this.console.cpu.registers.wmdata.set(val);
        } else if (page == 0x2181) {
            this.console.cpu.registers.wmadd.setLower(val);
        } else if (page == 0x2182) {
            this.console.cpu.registers.wmadd.setMiddle(val);
        } else if (page == 0x2183) {
            this.console.cpu.registers.wmadd.setUpper(val);
        } else if (0x2184 <= page && page <= 0x21FF) {

        } else {
            throw new Error("Invalid write on BusB at " + address.toString());
        }


        return null;
    }
}