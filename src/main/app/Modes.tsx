export class Mode {

    public label : string = "8 bit";
    public size : number = 0xFF;

    constructor(label : string, size : number) {
        this.label = label;
        this.size = size;
    }

}

export class Modes {

    public static bit8 : Mode = new Mode("8 bit", 0xFF);
    public static bit16 : Mode = new Mode("16 bit", 0xFFFF);
}

