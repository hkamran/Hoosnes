// The second data area, the OAM, is used to store properties of the sprites. It includes information about position,
// size, priority, etc. There can be 128 objects maximum, and the memory is 544 bytes: the first 512 bytes have four
// bytes of information per sprite, and the last 32 bytes have two more bits of information.  Two or more sprites can
// share the same set of tiles.

import {Objects} from "../util/Objects";
import {NumberUtil} from "../util/NumberUtil";

export class ObjectRam {

    public readByte(address: number, bank?: number): number {
        return 0;
    }

    public writeByte(address: number, val: number, bank?: number): void {
    }
}