export class ByteReader {

    public static readByte(data: number[], address: number): number {
        if (data == null || data.length == 0) {
            return 0;
        }
        return data[address];
    }

    public static readWord(data: number[], address: number): number {
        let low = this.readByte(data, address);
        let high = this.readByte(data, address + 1);
        return (high << 8) | low;
    }

}
