import {Bus} from "../Bus";
import Console from "../Console";
import {CGram} from "../memory/CGram";
import {Palette} from "./Palette";

export class Ppu {

    public palette: Palette;

    constructor(console: Console) {
        this.palette = new Palette(new CGram());
    }

    public readByte(offset: number) {
        return 0;
    }
}
