import {Bus} from "../Bus";
import Console from "../Console";
import {CGram} from "../memory/CGram";

export class Ppu {

    public palette: CGram = new CGram();

    constructor(memory: Console) {

    }


    public readByte(offset: number) {
        return 0;
    }
}
