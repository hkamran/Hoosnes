import * as React from "react";
import {Console} from "../app/Console";

interface ICartridgeModalProps {
    snes: Console;
    closeCallBack: () => {};
}

export class CartridgeModal extends React.Component<ICartridgeModalProps, any> {

    public state = {
    };

    constructor(props : any) {
        super(props);
    }

    public render() {
        return (
            <div className={"model-background"}>
                <div>

                </div>
            </div>
        );
    }

}
