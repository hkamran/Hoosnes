import {Objects} from "./Objects";

export class ArrayUtil {
    public static create2dMatrix(height: number, width: number) {
        Objects.requireNonNull(height);
        Objects.requireNonNull(width);

        let tile: number[][] = [];
        for (let y = 0; y < height; y++) {
            tile.push([]);
            for (let x = 0; x < width; x++) {
                tile[y].push(0);
            }
        }
        return tile;
    }
}