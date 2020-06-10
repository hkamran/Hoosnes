import {Controller, joy1, Key} from "../app/console/controller/Controller";

export enum KeyboardMapping {
    R = "T",
    L = "G",
    X = "Y",
    A = "H",
    RIGHT = "D",
    LEFT = "A",
    DOWN = "S",
    UP = "W",
    START = "B",
    SELECT = "N",
    Y = "U",
    B = "J",
}

export class Keyboard {

    public joy: Controller;
    public static instance: Keyboard = new Keyboard();

    public static initialize(joy: Controller): void {
        console.log(`Interfacing keyboard to joy${joy.id}`);

        Keyboard.instance.joy = joy;
        document.onkeyup = Keyboard.instance.onKeyUp.bind(Keyboard.instance);
        document.onkeydown = Keyboard.instance.onKeyDown.bind(Keyboard.instance);
    }

    public onKeyDown(e: KeyboardEvent): void {
        let code = e.key ? e.key.toUpperCase() : null;

        if (code == KeyboardMapping.UP) {
            this.joy.pressKey(Key.UP);
        } else if (code == KeyboardMapping.DOWN) {
            this.joy.pressKey(Key.DOWN);
        } else if (code == KeyboardMapping.LEFT) {
            this.joy.pressKey(Key.LEFT);
        } else if (code == KeyboardMapping.RIGHT) {
            this.joy.pressKey(Key.RIGHT);
        } else if (code == KeyboardMapping.START) {
            this.joy.pressKey(Key.START);
        } else if (code == KeyboardMapping.SELECT) {
            this.joy.pressKey(Key.SELECT);
        } else if (code == KeyboardMapping.A) {
            this.joy.pressKey(Key.A);
        } else if (code == KeyboardMapping.B) {
            this.joy.pressKey(Key.B);
        } else if (code == KeyboardMapping.X) {
            this.joy.pressKey(Key.X);
        } else if (code == KeyboardMapping.Y) {
            this.joy.pressKey(Key.Y);
        } else if (code == KeyboardMapping.R) {
            this.joy.pressKey(Key.R);
        } else if (code == KeyboardMapping.L) {
            this.joy.pressKey(Key.L);
        }
    }

    public onKeyUp(e: KeyboardEvent): void {
        let code = e.key ? e.key.toUpperCase() : null;

        if (code == KeyboardMapping.UP) {
            this.joy.releaseKey(Key.UP);
        } else if (code == KeyboardMapping.DOWN) {
            this.joy.releaseKey(Key.DOWN);
        } else if (code == KeyboardMapping.LEFT) {
            this.joy.releaseKey(Key.LEFT);
        } else if (code == KeyboardMapping.RIGHT) {
            this.joy.releaseKey(Key.RIGHT);
        } else if (code == KeyboardMapping.START) {
            this.joy.releaseKey(Key.START);
        } else if (code == KeyboardMapping.SELECT) {
            this.joy.releaseKey(Key.SELECT);
        } else if (code == KeyboardMapping.A) {
            this.joy.releaseKey(Key.A);
        } else if (code == KeyboardMapping.B) {
            this.joy.releaseKey(Key.B);
        } else if (code == KeyboardMapping.X) {
            this.joy.releaseKey(Key.X);
        } else if (code == KeyboardMapping.Y) {
            this.joy.releaseKey(Key.Y);
        } else if (code == KeyboardMapping.R) {
            this.joy.releaseKey(Key.R);
        } else if (code == KeyboardMapping.L) {
            this.joy.releaseKey(Key.L);
        }
    }
}
