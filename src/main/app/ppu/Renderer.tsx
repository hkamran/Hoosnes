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
        let color: Color = this.ppu.palette.getPalette(0);

        let x: number = this.ppu.cycle - ScreenRegion.HORT_PRELINE.end;
        let y: number = this.ppu.scanline - ScreenRegion.VERT_PRELINE.end;

        let bpp: number = this.ppu.backgrounds.bg1.getBpp().valueOf();
        let base: number = this.ppu.backgrounds.bg1.getBaseCharacterAddress();
        let characterDimension: Dimension = this.ppu.backgrounds.bg1.getCharacterDimension();

        let tileYIndex: number = Math.floor(y / 8);
        let tileXIndex: number = Math.floor(x / 8);
        let tileMap: TileMap = this.ppu.backgrounds.bg1.getTileMap(tileYIndex, tileXIndex);

        let address: Address = Address.create(base + (8 * bpp * tileMap.getCharacterNumber()));
        let attribute: TileAttributes = TileAttributes.create(characterDimension.height, characterDimension.width, this.ppu.backgrounds.bg1.getBpp(), tileMap.isYFlipped(), tileMap.isXFlipped());
        let tile: Tile = this.ppu.tiles.getTile(address, attribute);

        let colors: Color[] = this.ppu.palette.getPalettesForBppType(tileMap.getPaletteNumber(), bpp);

        let index = tile.data[y % 8][x % 8];
        let pixel = colors[index];
        if (pixel) {
            color = pixel;
        }

        this.screen.setPixel(x, y, color);
    }

}