import {Register} from "../ppu/Registers";
import {Console} from "../Console";

export class HdmaEnableRegister extends Register {

    public address: string = "0x420C";
    public label: string = "HDMAEN";

    constructor(console: Console) {
        super(console);
    }

    public set(val: number): void {
        super.set(val);
    }
}

export class HdmaTableIndirectAddressRegister extends Register {

    public address: string = "0x43x7";
    public label: string = "DASBx";

    public set(val: number): void {
        super.set(val);
    }
}


export class HdmaTableAddressLowRegister extends Register {

    public address: string = "0x43x9";
    public label: string = "A2AxH";

    public set(val: number): void {
        super.set(val);
    }
}

export class HdmaTableAddressHighRegister extends Register {

    public address: string = "0x43x8";
    public label: string = "A2AxL";

    public set(val: number): void {
        super.set(val);
    }
}

export class HdmaLineCounterRegister extends Register {

    public address: string = "0x43xA";
    public label: string = "NTLRX";

    public set(val: number): void {
        super.set(val);
    }
}