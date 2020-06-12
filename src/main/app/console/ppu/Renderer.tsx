import {Ppu} from "./Ppu";
import {BppType, IColor} from "./Palette";
import {Screen, ScreenRegion} from "./Screen";
import {Dimension, Tile} from "./Tiles";
import {Sprite} from "./Sprites";

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
        let mode: number = this.ppu.registers.bgmode.getMode();
        let base: IColor = this.ppu.palette.getPalette(0);
        let y: number = this.ppu.scanline - ScreenRegion.VERT_PRELINE.end;

        let bg1Colors: IColor[] = this.ppu.backgrounds.bg1.getLineImage(y);
        let bg2Colors: IColor[] = this.ppu.backgrounds.bg2.getLineImage(y);
        let bg3Colors: IColor[] = (mode <= 2) ? this.ppu.backgrounds.bg3.getLineImage(y) : [];

        for (let x: number = 0; x < Screen.WIDTH; x++) {
            let color: IColor = base;
            let bg1Color: IColor = bg1Colors.length > x ? bg1Colors[x]: base;
            let bg2Color: IColor = bg2Colors.length > x ? bg2Colors[x]: base;
            let bg3Color: IColor = bg3Colors.length > x ? bg3Colors[x]: base;

            if (bg2Color.opacity > 0) color = bg2Color;
            if (bg3Color.opacity > 0) color = bg3Color;
            if (bg1Color.opacity > 0) color = bg1Color;
            this.screen.setPixel(x, y, color);
        }

        let dimensions: {small: Dimension, big: Dimension} = this.ppu.registers.oamselect.getObjectSizes();
        let sprites: Sprite[] = this.ppu.sprites.getSprites();
        let count: number = 0;
        for (let sprite of sprites) {
            let height: number = sprite.isBig() ? dimensions.big.height : dimensions.small.height;
            let width: number = sprite.isBig() ? dimensions.big.width : dimensions.small.width;

            let yStart: number = sprite.getYPosition();
            let yEnd: number = sprite.getYPosition() + height;

            if (yStart <= y && y < yEnd) {
                count++;
                if (count == 31) break;
                let tile: Tile = sprite.getTile();
                let colors: IColor[] = this.ppu.palette.getPalettesForBppType(sprite.getPaletteIndex(), BppType.Four);

                for (let x: number = 0; x < width; x++) {
                    let index: number = tile.data[y - yStart][x];
                    if (index == 0) continue;
                    let color: IColor = colors[index];
                    let xIndex: number = ((sprite.isXWrapped() ? 0x100 : 0x0) + sprite.getXPosition() + x) % 0x1FF;
                    if (xIndex > Screen.WIDTH) continue;
                    this.screen.setPixel(sprite.getXPosition() + x , y, color);
                }
            }
        }


    }

}