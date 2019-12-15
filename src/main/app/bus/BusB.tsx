import {Address} from "./Address";
import {Read} from "./Read";
import {Write} from "./Write";
import Console from "../Console";
import {Objects} from "../util/Objects";
import {Registers} from "../ppu/Registers";

/**
 * Bus for IO registers in the PPU
 */
export class BusB {

    public console: Console;
    public registers: Registers;

    constructor(console: Console) {
        Objects.requireNonNull(console);
        Objects.requireNonNull(console.ppu);
        Objects.requireNonNull(console.ppu.registers);

        this.console = console;
        this.registers = console.ppu.registers;
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

        if (page == 0x2100) {
            read = Read.byte(this.registers.inidisp.get());
        } else if (page == 0x2101) {
            read = Read.byte(this.registers.oamselect.get());
        } else if (page == 0x2102) {
            read = Read.byte(this.registers.oamaddr.oamlow.get());
        } else if (page == 0x2103) {
            read = Read.byte(this.registers.oamaddr.oamlow.get());
        } else if (page == 0x2104) {
            read = Read.byte(this.registers.oamdataw.get());
        } else if (page == 0x2105) {
            read = Read.byte(this.registers.bgmode.get());
        } else if (page == 0x2106) {
            read = Read.byte(this.registers.mosaic.get());
        } else if (page == 0x2107) {
            read = Read.byte(this.registers.vtilebg1.get());
        } else if (page == 0x2108) {
            read = Read.byte(this.registers.vtilebg2.get());
        } else if (page == 0x2109) {
            read = Read.byte(this.registers.vtilebg3.get());
        } else if (page == 0x210A) {
            read = Read.byte(this.registers.vtilebg4.get());
        } else if (page == 0x210B) {
            read = Read.byte(this.registers.vcharlocbg12.get());
        } else if (page == 0x210C) {
            read = Read.byte(this.registers.vcharlocbg34.get());
        } else if (page == 0x210D) {
            read = Read.byte(this.registers.bg1hofs.get());
        } else if (page == 0x210E) {
            read = Read.byte(this.registers.bg1vofs.get());
        } else if (page == 0x210F) {
            read = Read.byte(this.registers.bg2hofs.get());
        } else if (page == 0x2110) {
            read = Read.byte(this.registers.bg2vofs.get());
        } else if (page == 0x2111) {
            read = Read.byte(this.registers.bg3hofs.get());
        } else if (page == 0x2112) {
            read = Read.byte(this.registers.bg3vofs.get());
        } else if (page == 0x2113) {
            read = Read.byte(this.registers.bg4hofs.get());
        } else if (page == 0x2114) {
            read = Read.byte(this.registers.bg4vofs.get());
        } else if (page == 0x2115) {
            read = Read.byte(this.registers.vportcntrl.get());
        } else if (page == 0x2116) {
            read = Read.byte(this.registers.vaddr.vraml.get());
        } else if (page == 0x2117) {
            read = Read.byte(this.registers.vaddr.vramh.get());
        } else if (page == 0x2118) {
            read = Read.byte(this.registers.vdatawl.get());
        } else if (page == 0x2119) {
            read = Read.byte(this.registers.vdatawh.get());
        } else if (page == 0x211A) {
            read = Read.byte(this.registers.m7sel.get());
        } else if (page == 0x211B) {
            read = Read.byte(this.registers.m7a.get());
        } else if (page == 0x211C) {
            read = Read.byte(this.registers.m7b.get());
        } else if (page == 0x211D) {
            read = Read.byte(this.registers.m7c.get());
        } else if (page == 0x211E) {
            read = Read.byte(this.registers.m7d.get());
        } else if (page == 0x211F) {
            read = Read.byte(this.registers.m7x.get());
        } else if (page == 0x2120) {
            read = Read.byte(this.registers.m7y.get());
        } else if (page == 0x2121) {
            read = Read.byte(this.registers.cgramaddr.get());
        } else if (page == 0x2122) {
            read = Read.byte(this.registers.cgdataw.get());
        } else if (page == 0x2123) {
            read = Read.byte(this.registers.w12sel.get());
        } else if (page == 0x2124) {
            read = Read.byte(this.registers.w34sel.get());
        } else if (page == 0x2125) {
            read = Read.byte(this.registers.wobjsel.get());
        } else if (page == 0x2126) {
            read = Read.byte(this.registers.wh0.get());
        } else if (page == 0x2127) {
            read = Read.byte(this.registers.wh1.get());
        } else if (page == 0x2128) {
            read = Read.byte(this.registers.wh2.get());
        } else if (page == 0x2129) {
            read = Read.byte(this.registers.wh3.get());
        } else if (page == 0x212A) {
            read = Read.byte(this.registers.wbglog.get());
        } else if (page == 0x212B) {
            read = Read.byte(this.registers.wobjlog.get());
        } else if (page == 0x212C) {
            read = Read.byte(this.registers.tm.get());
        } else if (page == 0x212D) {
            read = Read.byte(this.registers.ts.get());
        } else if (page == 0x212E) {
            read = Read.byte(this.registers.tmw.get());
        } else if (page == 0x212F) {
            read = Read.byte(this.registers.tsw.get());
        } else if (page == 0x2130) {
            read = Read.byte(this.registers.cgwsel.get());
        } else if (page == 0x2131) {
            read = Read.byte(this.registers.cgadsub.get());
        } else if (page == 0x2132) {
            read = Read.byte(this.registers.coldata.get());
        } else if (page == 0x2133) {
            read = Read.byte(this.registers.setini.get());
        } else if (page == 0x2134) {
            read = Read.byte(this.registers.mpyl.get());
        } else if (page == 0x2135) {
            read = Read.byte(this.registers.mpym.get());
        } else if (page == 0x2136) {
            read = Read.byte(this.registers.mpyh.get());
        } else if (page == 0x2137) {
            read = Read.byte(this.registers.slhv.get());
        } else if (page == 0x2138) {
            read = Read.byte(this.registers.oamdatar.get());
        } else if (page == 0x2139) {
            read = Read.byte(this.registers.vdatarl.get());
        } else if (page == 0x213A) {
            read = Read.byte(this.registers.vdatarw.get());
        } else if (page == 0x213B) {
            read = Read.byte(this.registers.cgdatar.get());
        } else if (page == 0x213C) {
            read = Read.byte(this.registers.scanlochort.get());
        } else if (page == 0x213D) {
            read = Read.byte(this.registers.scanlocvert.get());
        } else if (page == 0x213E) {
            read = Read.byte(this.registers.stat77.get());
        } else if (page == 0x213F) {
            read = Read.byte(this.registers.stat78.get());
        } else {
            throw new Error("Invalid read on BusB at " + address.toValue());
        }


        return read;
    }


    public writeByte(address: Address, val: number): Write {
        if (address == null || val == null || val < 0 || val > 0xFF) {
            throw new Error("Invalid writeByte at " + address + " with " + val);
        }

        let bank = address.getBank();
        let page = address.getPage();

        if (page < 0x2100 || page > 0x2183) {
            throw new Error("Invalid writeByte at " + address);
        }

        if (page == 0x2100) {
            this.registers.inidisp.set(val);
        } else if (page == 0x2101) {
            this.registers.oamselect.set(val);
        } else if (page == 0x2102) {
            this.registers.oamaddr.oamlow.set(val);
        } else if (page == 0x2103) {
            this.registers.oamaddr.oamhigh.set(val);
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
            this.registers.vaddr.vraml.set(val);
        } else if (page == 0x2117) {
            this.registers.vaddr.vramh.set(val);
        } else if (page == 0x2118) {
            this.registers.vdatawl.set(val);
        } else if (page == 0x2119) {
            this.registers.vdatawh.set(val);
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
            this.registers.vdatarl.set(val);
        } else if (page == 0x213A) {
            this.registers.vdatarw.set(val);
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
        } else {
            throw new Error("Invalid write on BusB at " + address.toValue());
        }


        return null;
    }
}