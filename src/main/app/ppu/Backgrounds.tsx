import {Vram} from "../memory/Vram";

/**
 *
 BG Modes
 --------

 The SNES has 7 background modes, two of which have major variations. The modes
 are selected by bits 0-2 of register $2105. The variation of Mode 1 is selected
 by bit 3 of $2105, and the variation of Mode 7 is selected by bit 6 of $2133.

 Mode    # Colors for BG
 1   2   3   4
 ======---=---=---=---=
 0        4   4   4   4
 1       16  16   4   -
 2       16  16   -   -
 3      256  16   -   -
 4      256   4   -   -
 5       16   4   -   -
 6       16   -   -   -
 7      256   -   -   -
 7EXTBG 256 128   -   -

 In all modes and for all BGs, color 0 in any palette is considered transparent.
 */

export class Backgrounds {

    private vram: Vram;

    constructor(vram: Vram) {
        this.vram = vram;
    }

}

export class Background {



    public getSize() {

    }

}