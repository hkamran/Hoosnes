export class Mode {

    public label : string = "8 bit";
    public size : number = 7;
    public mask : number = 0xFF;

    constructor(label : string, size : number, mask : number) {
        this.label = label;
        this.size = size;
        this.mask = mask;
    }

}

export class Modes {

    public static bit8 : Mode = new Mode("8 bit", 7, 0xFF);
    public static bit16 : Mode = new Mode("16 bit", 15, 0xFFFF);
}

