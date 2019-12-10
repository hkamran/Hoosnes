import Console from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";
import {Sprites} from "./Sprites";
import {Oam} from "../memory/Oam";
import {TileMap} from "./TileMap";
import {Vram} from "../memory/Vram";
import {Registers} from "./Registers";
import {Screen, ScreenStates} from "./Screen";
import {InterruptType} from "../cpu/Interrupts";

export class Ppu {

    public console: Console;

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
        this.registers = new Registers(console);

        this.screen = new Screen();
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

        }

        if (isScreenFinished) {
            this.vcounter++;
        }

        if (isVBlankStart) {
            this.console.cpu.interrupts.set(InterruptType.NMI);
        }

        if (isVBlankEnd) {
            // vertical blank end
        }
    }

    public reset():  void {

    }
}
