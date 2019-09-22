import * as React from "react";
import {CSSProperties} from "react";
import {RefObject} from "react";
import Stats from 'stats.js';

const screenStyle: CSSProperties = {
    padding: '0.5rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    margin: '20px',
    borderRadius: '4px',
    flexDirection: "column",
    display: "flex",
    alignSelf: "baseline",
};

export class Card extends React.Component<any, any> {

    constructor(props : any) {
        super(props);
    }

    public render() {
        return (
            <div style={screenStyle}>
                {this.props.children}
            </div>
        );
    }

}
