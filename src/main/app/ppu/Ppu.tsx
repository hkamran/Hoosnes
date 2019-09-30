import {Bus} from "../Bus";
import Console from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";
import {Sprites} from "./Sprites";
import {Oam} from "../memory/Oam";

export class Ppu {

    public cgram: CGram;
    public oam: Oam;

    public palette: Palette;
    public sprites: Sprites;

    constructor(console: Console) {
        this.cgram = new CGram();
        this.oam = new Oam();

        this.palette = new Palette(this.cgram);
        this.sprites = new Sprites(this.oam);
    }

    public readByte(offset: number) {
        return 0;
    }
}
