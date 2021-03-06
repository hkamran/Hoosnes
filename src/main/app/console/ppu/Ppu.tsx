import {Console} from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";
import {Sprites} from "./Sprites";
import {Oam} from "../memory/Oam";
import {TileMaps} from "./TileMaps";
import {Vram} from "../memory/Vram";
import {IPpuRegistersState, Registers} from "./Registers";
import {Screen, ScreenRegion, ScreenState} from "./Screen";
import {InterruptType} from "../cpu/Interrupts";
import {Renderer} from "./Renderer";
import {Tiles} from "./Tiles";
import {Backgrounds} from "./Backgrounds";
import {joypadForP1, joypadForP2} from "../controller/Controller";
import {ICpuState} from "../cpu/Cpu";

export interface IPpuState {
    scanline: number;
    cycle: number;
    frames: number;

    status: IStatusState;
    registers: IPpuRegistersState;
    cgram: number[];
    oam: {
        high: number[];
        low: number[],
    };
    vram: number[];
}

export interface IStatusState {
    latchedHCounter: number;
    latchedVCounter: number;
    externalLatchFlag: boolean;

    opHCounterToggle: boolean;
    opVCounterToggle: boolean;

    timeOver: boolean;
    rangeOver: boolean;

    masterSlaveToggle: boolean;

    palMode: boolean;
    interlaceFrame: boolean;
}

export class Status {
    public latchedHCounter: number = 0;
    public latchedVCounter: number = 0;
    public externalLatchFlag: boolean = false;

    public opHCounterToggle: boolean = false;
    public opVCounterToggle: boolean = false;

    public timeOver: boolean = false;
    // If more than 34 sprite-tiles  were encountered on a single line
    // The flag is reset at the end of V-Blank

    public rangeOver: boolean = false;
    // If more than 32 sprites were encountered on a single line
    // The flag is reset at the end of V-Blank

    public masterSlaveToggle = false;

    public palMode: boolean = false;
    public interlaceFrame: boolean = false;

    public chip5C77Version: number = 1;
    public chip5C78Version: number = 3;


    public toggleInterlaceFrame() {
        this.interlaceFrame = !this.interlaceFrame;
    }

    public setLatchCounter(hCounter: number, vCounter: number) {
        this.latchedHCounter = hCounter;
        this.latchedVCounter = vCounter;
        this.externalLatchFlag = true;
    }

    public clearLatchCounter() {
        this.externalLatchFlag = false;
        this.opHCounterToggle = false;
        this.opVCounterToggle = false;
    }

    public reset(): void {
        this.latchedHCounter = 0;
        this.latchedVCounter = 0;
        this.externalLatchFlag = false;

        this.opHCounterToggle = false;
        this.opVCounterToggle = false;

        this.timeOver = false;
        this.rangeOver = false;

        this.masterSlaveToggle = false;

        this.palMode = false;
        this.interlaceFrame = false;
    }

    public saveState(): IStatusState {
        return {
            latchedHCounter: this.latchedHCounter,
            latchedVCounter: this.latchedVCounter,
            externalLatchFlag: this.externalLatchFlag,

            opHCounterToggle: this.opHCounterToggle,
            opVCounterToggle: this.opVCounterToggle,

            timeOver: this.timeOver,
            rangeOver: this.rangeOver,

            masterSlaveToggle: this.masterSlaveToggle,

            palMode: this.palMode,
            interlaceFrame: this.interlaceFrame,
        };
    }

    public loadState(state: IStatusState): void {
        this.latchedVCounter = state.latchedVCounter;
        this.latchedHCounter = state.latchedHCounter;
        this.externalLatchFlag = state.externalLatchFlag;

        this.opVCounterToggle = state.opVCounterToggle;
        this.opHCounterToggle = state.opHCounterToggle;

        this.timeOver = state.timeOver;
        this.rangeOver = state.rangeOver;

        this.masterSlaveToggle = state.masterSlaveToggle;

        this.palMode = state.palMode;
        this.interlaceFrame = state.interlaceFrame;
    }
}

export class Ppu {

    public scanline: number = 0;
    public cycle: number = 0;
    public frames: number = 0;

    public console: Console;
    public status: Status;

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
        this.status = new Status();

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
        let isVblankEnd: boolean =
            ScreenRegion.VERT_BLANK.end == this.scanline &&
            ScreenRegion.HORT_BLANK.end == this.cycle;

        let isCycleFinished: boolean =
            ScreenRegion.HORT_BLANK.end <= this.cycle;

        let isFrameFinished: boolean =
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
            if (isFrameFinished) {
                this.scanline = 0;
            }
        }

        if (isRendering) {
            this.screen.state = ScreenState.RENDER;
            if (ScreenRegion.HORT_RENDERLINE.end == this.cycle) {
                this.renderer.tick();
                this.triggerIRQ();
            }
        }

        if (isVblankEnd) {
            this.frames++;
            this.screen.setMosaic(this.registers.mosaic.getMosaicSize());
            this.screen.render();
            this.status.toggleInterlaceFrame();
            this.status.rangeOver = false;
            this.status.timeOver = false;

            this.console.io.registers.hvbjoy.setVBlankFlag(false);
            this.console.io.registers.hvbjoy.setJoypadFlag(false);

            this.console.io.registers.rdnmi.setNmiStatus(false);
            this.console.io.registers.timeup.setIRQFlag(false);
        }

        if (isVBlankStart) {
            this.screen.state = ScreenState.VBLANK;
            this.console.io.registers.hvbjoy.setVBlankFlag(true);
            this.console.io.registers.rdnmi.setNmiStatus(true);

            if (this.console.io.registers.nmitimen.getNmiEnable()) {
                this.console.cpu.interrupts.set(InterruptType.NMI);
            }

            if (this.console.io.registers.nmitimen.getAutoJoypadEnable()) {
                this.console.io.registers.hvbjoy.setJoypadFlag(false);
                this.console.io.registers.joy1l.set(joypadForP1.readByte(0));
                this.console.io.registers.joy1h.set(joypadForP1.readByte(1));
                this.console.io.registers.joy2l.set(joypadForP2.readByte(0));
                this.console.io.registers.joy2h.set(joypadForP2.readByte(1));
            }
        }

        if (isHBlank) {
            this.console.io.registers.hvbjoy.setHBlankFlag(true);
            this.screen.state = ScreenState.HBLANK;
        }

        if (isPreline) {
            this.console.io.registers.hvbjoy.setHBlankFlag(false);
            this.screen.state = ScreenState.PRELINE;
        }


    }

    public reset():  void {
        this.screen.state = ScreenState.PRELINE;

        this.scanline = 0;
        this.cycle = 0;
        this.frames = 0;

        this.status.reset();
        this.registers.reset();
        this.cgram.reset();
        this.oam.reset();
        this.vram.reset();

        this.tiles.reset();
        this.tileMaps.reset();
        this.palette.reset();
        this.sprites.reset();
        this.backgrounds.reset();
    }

    public loadState(state: IPpuState): void {
        this.scanline = state.scanline;
        this.cycle = state.cycle;
        this.frames = state.frames;

        this.cgram.data = state.cgram;
        this.oam.high = state.oam.high;
        this.oam.low = state.oam.low;
        this.vram.data = state.vram;

        this.status.loadState(state.status);
    }

    public saveState(): IPpuState {
        return {
            scanline: this.scanline,
            cycle: this.cycle,
            frames: this.frames,

            status: this.status.saveState(),
            registers: this.registers.saveState(),
            cgram: this.cgram.data,
            oam: {
                high: this.oam.high,
                low: this.oam.low,
            },
            vram: this.vram.data,
        };
    }

    private triggerIRQ(): void {
        const mode = this.console.io.registers.nmitimen.getIRQMode();
        if (mode == 0) {
            // Do nothing
        } else if (mode == 1) {
            this.console.cpu.interrupts.set(InterruptType.IRQ);
        } else if (mode == 2 || mode == 3) {
            if (this.console.ppu.scanline == this.console.io.registers.vtime.get()) {
                this.console.cpu.interrupts.set(InterruptType.IRQ);
            }
        } else {
            throw new Error(`Invalid IRQ mode: ${mode}`);
        }
    }
}
