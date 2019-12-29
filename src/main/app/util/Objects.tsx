export class Objects {

    public static requireNonNull(t : any, msg? : string) : void {
        if (t == null) {
            let result = "Null pointer exception";
            if (msg !== null) {
                result = msg;
            }
            throw new Error(result);
        }
    }

    public static assertTrue(t : boolean, msg? : string) : void {
        if (t == null) {
            let result = "Expression did not eval to be true!";
            if (msg !== null) {
                result = msg;
            }
            throw new Error(result);
        }
    }

}
