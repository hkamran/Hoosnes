import {Address} from "./Address";

export class Write {

    private address: Address;
    private value: number = 0;
    private cycles: number = 0;

    constructor(address: Address, value: number, cycles: number) {
        if (address == null || value == null || value < 0 || value > 0xFF) {
            throw new Error("Invalid write being made at " + address + " with value=0x" + value.toString(16));
        }

        this.address = address;
        this.value = value;
        this.cycles = cycles;
    }

}