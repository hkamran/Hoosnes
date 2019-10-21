export class Address {

    public bank: number = 0;
    public offset: number = 0;

    // public page: number = 0; // 256 bytes makes a page
    // public bank: number = 0; // 256 page makes a bank
    // public byte: number = 0; // 256 banks (16 mb total address space)

    private constructor(bank: number, offset : number) {
        if (bank == null || bank < 0 || bank > 0xFF)
            throw new Error("Invalid Address");
        if (offset == null || offset < 0 || offset > 0xFFFF)
            throw new Error("Invalid Address");

        this.bank = (bank) & 0xFF;
        this.offset = (offset) & 0xFFFF;
    }

    public getPage(): number {
        let value : number = this.toValue();
        return (value >> 2) & 0xFFFF;
    }

    public getBank(): number {
        return this.bank;
    }

    public toValue(): number {
        return (this.bank << 16) | (this.offset);
    }

    public static create(val: number, bank?: number): Address {
        if (val == null || bank == null)
            throw new Error("Invalid Address");

        bank = bank | (val >> 16);
        return new Address(bank, val);
    }

}
