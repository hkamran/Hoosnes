export class Bank {

    public memory : number[] = new Array<number>(0xFFFF);

}

export class Memory {

    public banks : Bank[] = new Array<Bank>(0xFF);

    constructor() {

        for (let i = 0; i < 0xFF; i++) {
            this.banks[i] = new Bank();
        }

    }

}
