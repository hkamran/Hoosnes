import * as React from "react";
import {CSSProperties} from "react";
import {RefObject} from "react";

const screenStyle: CSSProperties = {
    padding: '0.5rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    margin: '20px',
    borderRadius: '4px',
    flexDirection: "column",
    display: "flex",
    alignSelf: "baseline",
    border: "1px solid #53535387",
};

const fieldSetStyle: CSSProperties = {
    padding: "10px",
    margin: "10px",
};

const legendSetStyle: CSSProperties = {
    maxWidth: "100%",
    border: "0",
};

interface ICardProps {
    title: string;
    grow?: boolean;
}


export class Card extends React.Component<ICardProps, any> {

    constructor(props : ICardProps) {
        super(props);
    }

    public render() {
        return (
            <div className="debug-card" style={{...screenStyle, flexGrow: this.props.grow ? 1 : 0}}>
                <div style={{marginBottom: "5px"}}>{this.props.title}</div>
                {this.props.children}
            </div>
        );
    }

}
