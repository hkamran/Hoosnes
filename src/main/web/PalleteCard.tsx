import * as React from "react";
import {CSSProperties} from "react";
import {RefObject} from "react";
import Stats from 'stats.js';
import {Card} from "./core/layout/Card";

declare let window : any;

export class PalleteCard extends React.Component<any, any> {

    constructor(props : any) {
        super(props);
    }

    public render() {
        return (
            <Card>
                <div>
                    {
                        this.props.snes.ppu.palette.colors.map((color, i) => {
                            return (
                                <div key={i} style={{width: "10px", height: "10px"}}></div>
                            );
                        })
                    }
                </div>
            </Card>
        );
    }

}
