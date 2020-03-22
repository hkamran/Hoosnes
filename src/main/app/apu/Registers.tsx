import {Register} from "../ppu/Registers";
import {Console} from "../Console";
import {ApuState} from "./Apu";


/*
    $2140 = Status
    $2141 = Command / Data
    $2142-3 = Address

    Initializing the transfer
    1.  Wait for port $2140 to be $AA and port $2141 to be $BB.  (This means the ROM program is through initializing, and is ready to begin a transfer.)
    2. 	Write any value other than 0 to $2141.  (A value of 0 has a different meaning which will be explained later.)
    3. 	Write the destination address of the transfer to ports $2142 and $2143, with the low byte written to $2142.
    4. 	Write $CC to port $2140.
    5. 	Wait for $2140 to be $CC.

    Transferring data
    1.  Write the first byte to be transferred to port $2141.
    2. 	Write $00 to port $2140.
    3. 	Wait for $2140 to be $00.
    4. 	Write the next byte to be transferred to port $2141.
    5. 	Increase the value in $2140 by 1, and write it back.
    6. 	Wait for $2140 to be the same as the value written.
    7. 	Goto step 4 until all bytes are transferred

    Beginning another transfer
    1.  Write a non-zero value to port $2141.
    2. 	Write the destination address of the transfer to ports $2142 and $2143, with the low byte written to $2142.
    3. 	Increase the value in $2140 by 2.  If it's 0, increase it again.  Write it back.
    4. 	Wait for $2140 to be the same as the value written, then go to the section "Transferring data".

    Ending transfers
    1.  Write 0 to port $2141.
    2. 	Write the address to begin execution to ports $2142 and $2143, with the low byte written to $2142.
    3. 	Increase the value in $2140 by 2, and write it back.

    Summary

    Between transfers, a non-zero value sent to $2141 means to begin a transfer,
    and a zero value means to end a transfer and begin execution.
    16-bit addresses are written to $2142-3.
    During transfers, in $2140 a value less than means the APU is busy,
    a value equal means it's ready for the next byte.
    Writing a value one greater means the next byte ($2141) is ready to be stored.
    Writing a value two or more greater means to end the transfer and apply the command in $2141.
    (Because of the internal workings of the ROM program,
    the value in $2140 must be non-zero if the command is to start another transfer.)
*/

export class ApuIO00 extends Register {

    public address: string = "0x2140";
    public label: string = "APUIO0";
    public isReset: boolean = false;

    public set(val: number): void {
        let { state } = this.console.apu;

        if (state == ApuState.READY) {
            this.doReady(val);
        } else if (state == ApuState.TRANSFER) {
            this.doTransfer(val);
        }
    }

    public get(): number {
        return super.get();
    }

    private doReady(val: number) {
        if (val == 0xCC) {
            this.console.apu.state = ApuState.TRANSFER;
            this.val = 0xCC;
            return;
        }
        this.val = val;
    }

    private doInit(val: number) {
        if (val == 0x00) {
            this.val = 0x00;
            this.console.apu.state = ApuState.TRANSFER;
            this.val = val;
        }
    }

    private doTransfer(val: number) {
        if (val == this.console.apu.amount) {
            this.console.apu.amount++;
        } else if (val > this.console.apu.amount) {
            this.console.apu.amount = 0;
            this.console.apu.state = ApuState.READY;
            this.doReady(val);
        }
        this.val = val;
    }

    public reset(): void {
        this.val = 0xAA;
    }
}

export class ApuIO01 extends Register {

    public address: string = "0x2141";
    public label: string = "APUIO1";

    public set(val: number): void {
        if (this.console.apu.state == ApuState.TRANSFER) {
            this.val = val;
        } else {
            if (val == 0x00) {
                this.console.apu.reset();
                return;
            }
        }
    }

    public get(): number {
        return super.get();
    }

    public reset(): void {
        this.val = 0xBB;
    }
}

// low addr
export class ApuIO02 extends Register {

    public address: string = "0x2142";
    public label: string = "APUIO2";

    public set(val: number): void {
        this.val = val;
    }

    public get(): number {
        return super.get();
    }

}

// high addr
export class ApuIO03 extends Register {

    public address: string = "0x2143";
    public label: string = "APUIO3";

    public set(val: number): void {
        this.val = val;
    }

    public get(): number {
        return super.get();
    }

}

export class Registers {

    public apuio0: ApuIO00;
    public apuio1: ApuIO01;
    public apuio2: ApuIO02;
    public apuio3: ApuIO03;

    constructor(console: Console) {
        this.apuio0 = new ApuIO00(console);
        this.apuio1 = new ApuIO01(console);
        this.apuio2 = new ApuIO02(console);
        this.apuio3 = new ApuIO03(console);
    }

}