import {Bus} from "../Bus";
import Console from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";
import {Sprites} from "./Sprites";
import {Oam} from "../memory/Oam";
import {TileMap} from "./TileMap";
import {Vram} from "../memory/Vram";
import {Registers} from "./Registers";
import {ScanlineState, Screen} from "./Screen";

export class Ppu {

    public cgram: CGram;
    public oam: Oam;
    public vram: Vram;

    public palette: Palette;
    public sprites: Sprites;
    public tiles: TileMap;
    public registers: Registers;

    constructor(console: Console) {
        this.cgram = new CGram();
        this.oam = new Oam();
        this.vram = new Vram();

        this.palette = new Palette(this.cgram);
        this.sprites = new Sprites(this.oam);
        this.tiles = new TileMap(this.vram);
        this.registers = new Registers(this);
    }

    public readByte(offset: number) {
        return 0;
    }

    public tick(): void {

        //f-blank (forced)
        for (let y = 0; y < Screen.HEIGHT; y++) {
            if (ScanlineState.VERT_RENDERLINE.isInRange(y)) {
                for (let x = 0; x < Screen.WIDTH; x++) {

                    if (ScanlineState.HORT_PRELINE.isInRange(x)) {

                    } else if (ScanlineState.HORT_RENDERLINE.isInRange(x)) {

                    } else if (ScanlineState.HORT_BLANK.isInRange(x)) {
                        //hblank
                    }
                }
            }
            if (ScanlineState.VERT_BLANK.isInRange(y)) {
                //nmi
                //vblank
            }
        }

    }

    public reset():  void {

    }
}
