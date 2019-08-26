import {Objects} from "./Objects";

export class NumberUtil {

    public static toHex(val: number): string {
        Objects.requireNonNull(val);
        return val.toString(16);
    }

    public static inRange(val: number, start: number, end: number): boolean {
        Objects.requireNonNull(val);

        if (start <= val && val <= end) {
            return true;
        }
        return false;
    }

}
