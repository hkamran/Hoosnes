import * as React from "react";
import {Card} from "../../core/layout/Card";
import {Console} from "../../../app/Console";
import {TickEvent} from "../../Main";

interface IDebuggerCardProps {
    snes: Console;
}

export class LogCard extends React.Component<IDebuggerCardProps, any> {

    public divLog: React.RefObject<HTMLDivElement>;

    constructor(props : IDebuggerCardProps) {
        super(props);
        this.divLog = React.createRef<HTMLDivElement>();
    }

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: Readonly<IDebuggerCardProps>, prevState: Readonly<any>, snapshot?: any): void {
        this.divLog.current.scrollTop = this.divLog.current.scrollHeight;
    }
    public render() {
        return (
            <Card title="Logs" grow={true}>
                <div style={{display: "flex", flexDirection: "row", flexGrow: 1, height: "419px"}} >
                    <fieldset style={{border: "1px solid rgb(100, 100, 100)", flexGrow: 1}}>
                        <div ref={this.divLog} style={{display: "flex", flexDirection: "column", fontSize: "12px", height: "273px", overflowY: "auto"}}>

                        </div>
                    </fieldset>
                </div>
            </Card>
        );
    }

}
