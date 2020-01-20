import {Ppu} from "./Ppu";
import {Bit} from "../util/Bit";
import {Color} from "./Palette";
import {Screen, ScreenRegion} from "./Screen";
import {Dimension, Tile, TileAttributes} from "./Tiles";
import {TileMap} from "./TileMaps";
import {Address} from "../bus/Address";

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
        let base: Color = this.ppu.palette.getPalette(0);

        let y: number = this.ppu.scanline - ScreenRegion.VERT_PRELINE.end;
        let colors: Color[] = this.ppu.backgrounds.bg1.getLineImage(y);

        for (let x: number = 0; x < colors.length; x++) {
            let color: Color = colors[x];
            if (color.opacity == 0) color = base;
            this.screen.setPixel(x, y, color);
        }
    }

}