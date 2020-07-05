import Peer from "peerjs";
import {Logger, LoggerManager} from "typescript-logger";

const HOST = "localhost";
const PORT = 9000;

export interface INetplayEventHandlers {
    onCreate?(id: string): void;
    onConnect?(): void;
    onDisconnect?(): void;
    onError?(err: any): void;
    onData?(data: any): void;
}

export class NetplayClient {

    public log : Logger = LoggerManager.create('NetplayClient');
    public id: string;

    public join(id: string, handlers: INetplayEventHandlers): void {
        const broker = new Peer({
            host: HOST,
            port: PORT,
            debug: 3,
        });

        broker.on('error', (err) => {
            alert(''+err);
        });

        broker.on('open', () => {
            this.id = id;
            const conn = broker.connect(id, {
                reliable: true,
            });
            if (handlers && handlers.onCreate) handlers.onCreate(id);

            conn.on('close', () => {
                if (handlers && handlers.onDisconnect) handlers.onDisconnect();
            });

            conn.on('error', (err) => {
                if (handlers && handlers.onError) handlers.onError(err);
            });

            conn.on('open', () => {
                if (handlers && handlers.onConnect) handlers.onConnect();
            });

            conn.on('data', (data) => {
                if (handlers && handlers.onData) handlers.onData(data);
            });
        });
    }
}