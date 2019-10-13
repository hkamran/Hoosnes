export class Address {

    public source: number;

    public addr: number = 0;
    public page: number = 0; // 256 bytes makes a page
    public bank: number = 0; // 256 page makes a bank
    public byte: number = 0; // 256 banks (16 mb total address space)

    private constructor(addr : number) {
        this.source = addr;

        this.page = (addr >> 2) & 0xFFFF;
        this.bank = (addr >> 4) & 0xFF;
        this.byte = (addr >> 0) & 0xFF;
        this.addr = (addr >> 0) & 0xFFFF;
    }

    public static create(val: number): Address {
        if (val == null || val < 0) {
            throw new Error("Invalid Address");
        }
        return new Address(val);
    }

}
