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

}
