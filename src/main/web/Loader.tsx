import * as React from "react";

declare let window : any;

export class Loader extends React.Component<any, any> {

    constructor(props : any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event) {
        let file : File = event.target.files[0];
        let promise = this.readFileDataAsBase64(file);
        promise.then((value) => {
            this.props.snes.load(value);
        });
    }

    public readFileDataAsBase64(file : Blob) {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event : any) => {
                let str : string = event.target.result;
                window.raw = str;
                let bytes : number[] = [];
                for (let i = 0; i < str.length; ++i) {
                    let charCode = str.charCodeAt(i);
                    bytes.push(charCode & 0xFF);
                }
                resolve(bytes);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsBinaryString(file);
        });
    }

    public render() {
        return (
            <input type="file" id="file" onChange={this.handleChange} />
        );
    }
}
