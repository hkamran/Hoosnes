import {Bus} from "../bus/Bus";
import Console from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";
import {Sprites} from "./Sprites";
import {Oam} from "../memory/Oam";
import {TileMap} from "./TileMap";
import {Vram} from "../memory/Vram";
import {Registers} from "./Registers";
import {ScreenStates, Screen} from "./Screen";

export class Ppu {

    public cgram: CGram;
    public oam: Oam;
    public vram: Vram;

    public palette: Palette;
    public sprites: Sprites;
    public tiles: TileMap;
    public registers: Registers;

    public scanline: number = 0;

    public hcounter: number = 0;
    public vcounter: number = 0;

    public frames: number = 0;

    public screen: Screen;

    constructor(console: Console) {
        this.cgram = new CGram();
        this.oam = new Oam();
        this.vram = new Vram();

        this.palette = new Palette(this.cgram);
        this.sprites = new Sprites(this.oam);
        this.tiles = new TileMap(this.vram);
        this.registers = new Registers(this);

        this.screen = new Screen(this);
    }

    public tick(): void {
        let isScreenFinished: boolean =
            ScreenStates.VERT_BLANK.end == this.scanline &&
            ScreenStates.HORT_BLANK.end == this.hcounter;

        let isCycleFinished: boolean = 
            ScreenStates.HORT_BLANK.end <= this.hcounter;

        let isScanlineFinished: boolean =
            ScreenStates.VERT_BLANK.end <= this.scanline;

        let isVBlankStart: boolean =
            ScreenStates.HORT_PRELINE.start == this.hcounter &&
            ScreenStates.VERT_BLANK.start == this.scanline;

        let isVBlankEnd: boolean =
            ScreenStates.HORT_PRELINE.start == this.hcounter &&
            ScreenStates.VERT_BLANK.end == this.scanline;

        let isRendering: boolean =
            ScreenStates.VERT_RENDERLINE.isInRange(this.scanline) &&
            ScreenStates.HORT_RENDERLINE.isInRange(this.hcounter);

        this.hcounter++;
        if (isCycleFinished) {
            this.hcounter = 0;
            this.scanline++;
            if (isScanlineFinished) {
                this.scanline = 0;
            }
        }

        if (isRendering) {
            this.screen.tick();
        }

        if (isScreenFinished) {
            this.vcounter++;
        }

        if (isVBlankStart) {
            // vertical blank start
        }

        if (isVBlankEnd) {
            // vertical blank end
        }
    }

    public reset():  void {

    }
}
