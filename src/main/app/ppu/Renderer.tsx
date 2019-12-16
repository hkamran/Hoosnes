import {Ppu} from "./Ppu";
import {Bit} from "../util/Bit";
import {Color} from "./Palette";
import {Screen, ScreenStates} from "./Screen";

export class Renderer {

    private ppu: Ppu;
    private screen: Screen;
    constructor(ppu: Ppu) {

        this.ppu = ppu;
        this.screen = ppu.screen;
    }

    public tick(): void {
        let caddr: number = this.ppu.registers.cgramaddr.get();
        let colorl: number = this.ppu.cgram.readByte(0);
        let colorh: number = this.ppu.cgram.readByte(0 + 1);
        let color: Color = Color.parse(Bit.toUint16(colorh, colorl));

        let x: number = this.ppu.cycle - ScreenStates.HORT_PRELINE.end;
        let y: number = this.ppu.scanline - ScreenStates.VERT_PRELINE.end;

        this.screen.setPixel(x, y, color);
    }

}