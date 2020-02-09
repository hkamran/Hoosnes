import {Register} from "../ppu/Registers";
import {Console} from "../Console";
import {ApuState} from "./Apu";


export class ApuIO00 extends Register {

    public address: string = "0x2140";
    public label: string = "APUIO0";

    public set(val: number): void {
        this.val = val;
        if (this.console.apu.state == ApuState.RESET) {
            this.doReset(val);
        } else if (this.console.apu.state == ApuState.RUNNING) {
            this.doRunning(val);
        } else if (this.console.apu.state == ApuState.TRANSFER) {
            this.doTransfer(val);
        }
    }

    public get(): number {
        return super.get();
    }

    private doReset(val: number) {
        if (this.console.apu.initializing) {
            if (val != 0xCC) return;
            this.console.apu.initializing = false;
        }
        let cmd: number = this.console.apu.registers.apuio1.get();
        if (cmd != 0) {
            this.console.apu.state = ApuState.TRANSFER;
        } else {
            this.console.apu.state = ApuState.RUNNING;
        }
        this.val = val;
    }

    private doRunning(val: number) {
        this.console.apu.reset();
    }

    private doTransfer(val: number) {
        if (this.console.apu.amount == val) {
            this.console.apu.amount++;
        }  else if (this.console.apu.amount < val) {
            this.console.apu.amount = 0x00;
            this.console.apu.state = ApuState.RESET;
            this.doReset(val);
        }
        this.val = val;
    }
}

export class ApuIO01 extends Register {

    public address: string = "0x2141";
    public label: string = "APUIO1";

    public set(val: number): void {
        if (this.console.apu.initializing) return;
        this.val = val;
    }

    public get(): number {
        return super.get();
    }

}

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
        this.apuio1 = new ApuIO02(console);
        this.apuio2 = new ApuIO02(console);
        this.apuio3 = new ApuIO03(console);
    }

}