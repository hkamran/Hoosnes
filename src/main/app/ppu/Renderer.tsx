import {Ppu} from "./Ppu";
import {Bit} from "../util/Bit";
import {Color} from "./Palette";
import {Screen, ScreenRegion} from "./Screen";

export class Renderer {

    private ppu: Ppu;
    private screen: Screen;
    constructor(ppu: Ppu) {

        this.ppu = ppu;
        this.screen = ppu.screen;
    }

    /**
     * Rendering a BG is simple.
     *
     * https://wiki.superfamicom.org/backgrounds
     * https://wiki.superfamicom.org/making-a-small-game-tic-tac-toe
     * https://wiki.superfamicom.org/sprites
     *
     * Get your H and V offsets (either by reading the appropriate registers or by doing the offset-per-tile calculation).
     * Use those to translate the screen X and Y into playing field X and Y (Note this is rather complicated for Mode 7)
     * Look up the tilemap for those coordinates
     * Use that to find the character data
     * If necessary, de-bitplane it and stick it in a buffer.

     */
    public tick(): void {
        let caddr: number = this.ppu.registers.cgramaddr.get();
        let colorl: number = this.ppu.cgram.readByte(0);
        let colorh: number = this.ppu.cgram.readByte(0 + 1);
        let color: Color = Color.parse(Bit.toUint16(colorh, colorl));

        let x: number = this.ppu.cycle - ScreenRegion.HORT_PRELINE.end;
        let y: number = this.ppu.scanline - ScreenRegion.VERT_PRELINE.end;

        this.screen.setPixel(x, y, color);
    }

}