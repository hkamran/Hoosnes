export class AddressUtil {

    public static assertValid(value: number) {
        if (value == null || value < 0 || value > 0xFFFFFF) {
            throw new Error(`Invalid address given ${value ? value.toString(16) : null}`);
        }
    }

    public static getBank(value: number) {
        return (value >> 16) & 0xFF;
    }

    public static getPage(value: number) {
        return (value) & 0xFFFF;
    }

}