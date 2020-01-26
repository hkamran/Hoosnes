import {Console} from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";
import {Sprites} from "./Sprites";
import {Oam} from "../memory/Oam";
import {TileMaps} from "./TileMaps";
import {Vram} from "../memory/Vram";
import {Registers} from "./Registers";
import {Screen, ScreenRegion, ScreenState} from "./Screen";
import {InterruptType} from "../cpu/Interrupts";
import {Renderer} from "./Renderer";
import {Tiles} from "./Tiles";
import {Backgrounds} from "./Backgrounds";



export class Ppu {

    public scanline: number = 0;
    public cycle: number = 0;
    public frames: number = 0;

    public console: Console;

    public registers: Registers;
    public cgram: CGram;
    public oam: Oam;
    public vram: Vram;

    public tiles: Tiles;
    public tileMaps: TileMaps;

    public palette: Palette;
    public sprites: Sprites;
    public backgrounds: Backgrounds;

    public screen: Screen;
    public renderer: Renderer;

    constructor(console: Console) {
        this.console = console;
        this.cgram = new CGram();
        this.oam = new Oam();
        this.vram = new Vram();

        this.registers = new Registers(console);

        this.tiles = new Tiles(this);
        this.tileMaps = new TileMaps(this.vram);

        this.palette = new Palette(this.cgram);
        this.sprites = new Sprites(this.oam, this);

        this.screen = new Screen();
        this.renderer = new Renderer(this);
        this.backgrounds = new Backgrounds(this);
    }

    public tick(): void {
        let isScreenFinished: boolean =
            ScreenRegion.VERT_BLANK.end == this.scanline &&
            ScreenRegion.HORT_BLANK.end == this.cycle;

        let isCycleFinished: boolean =
            ScreenRegion.HORT_BLANK.end <= this.cycle;

        let isScanlineFinished: boolean =
            ScreenRegion.VERT_BLANK.end <= this.scanline;

        let isVBlankStart: boolean =
            ScreenRegion.HORT_PRELINE.start == this.cycle &&
            ScreenRegion.VERT_BLANK.start == this.scanline;

        let isVBlankEnd: boolean =
            ScreenRegion.HORT_PRELINE.start == this.cycle &&
            ScreenRegion.VERT_BLANK.end == this.scanline;

        let isRendering: boolean =
            ScreenRegion.VERT_RENDERLINE.isInRange(this.scanline) &&
            ScreenRegion.HORT_RENDERLINE.isInRange(this.cycle);

        let isHBlank: boolean =
            ScreenRegion.HORT_BLANK.isInRange(this.cycle);

        let isPreline: boolean =
            ScreenRegion.HORT_RENDERLINE.start >= this.cycle;

        this.cycle++;
        if (isCycleFinished) {
            this.cycle = 0;
            this.scanline++;
            if (isScanlineFinished) {
                this.scanline = 0;
            }
        }

        if (isRendering) {
            this.screen.state = ScreenState.RENDER;
            if (ScreenRegion.HORT_RENDERLINE.end == this.cycle) {
                this.renderer.tick();
            }
        }

        if (isScreenFinished) {
            this.frames++;
            this.screen.render();
        }

        if (isVBlankStart) {
            this.screen.state = ScreenState.VBLANK;
            this.console.cpu.registers.rdnmi.set(0x80);
            this.console.cpu.interrupts.set(InterruptType.NMI);
        }

        if (isVBlankEnd) {
            // vertical blank end
            this.console.cpu.registers.rdnmi.set(0x00);
        }

        if (isHBlank) {
            this.screen.state = ScreenState.HBLANK;
        }

        if (isPreline) {
            this.screen.state = ScreenState.PRELINE;
        }
    }

    public reset():  void {
        this.screen.state = ScreenState.PRELINE;

    }
}
