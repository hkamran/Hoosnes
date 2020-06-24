import {Console} from "../Console";
import {AbstractRegister} from "../../interfaces/AbstractRegister";

export class HdmaEnableRegister extends AbstractRegister {

    public address = 0x420C;
    public label: string = "HDMAEN";

}

export class HdmaTableIndirectAddressRegister extends AbstractRegister {

    public address = 0x43F7;
    public label: string = "DASBx";
}

export class HdmaTableAddressLowRegister extends AbstractRegister {

    public address = 0x43F9;
    public label: string = "A2AxH";
}

export class HdmaTableAddressHighRegister extends AbstractRegister {

    public address = 0x43F8;
    public label: string = "A2AxL";
}

export class HdmaLineCounterRegister extends AbstractRegister {

    public address = 0x43FA;
    public label: string = "NTLRX";

}