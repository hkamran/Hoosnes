import Peer from "peerjs";
import {Logger, LoggerManager} from "typescript-logger";

const HOST = "localhost";
const PORT = 9000;

export interface INetplayEventHandlers {
    onCreate?(): void;
    onConnect?(): void;
    onDisconnect?(): void;
    onError?(err: any): void;
    onData?(data: any): void;
}

export class NetplayClient {

    public log : Logger = LoggerManager.create('Client');
    public id: string;
    public count: number = 0;
    public size: number;

    public broker: Peer;

    constructor(size: number) {
        this.size = size;

        this.broker = new Peer({
            host: HOST,
            port: PORT,
            debug: 3,
        });

        this.broker.on('error', (err) => {
            alert(''+err);
        });
    }

    public createRoom(handlers: INetplayEventHandlers): void {
        this. broker.on('open', (id) => {
            this.id = id;
            this.log.info(`room created id=${id}`);
            this.count = 1;

            if (handlers && handlers.onCreate) handlers.onCreate();

            this.broker.on('connection', (conn: Peer.DataConnection) => {
                if (handlers && handlers.onConnect) handlers.onConnect();

                this.count++;
                if (this.count > this.size) {
                    this.count = this.size;
                    try {
                        conn.close();
                    } catch (e) {}
                    return;
                }

                conn.on('close', () => {
                    this.count--;
                    if (handlers && handlers.onDisconnect) handlers.onDisconnect();
                });

                conn.on('error', (err) => {
                    this.count--;
                    try {
                        conn.close();
                    } finally {}
                    if (handlers && handlers.onError) handlers.onError(err);
                });

                conn.on('data', (data) => {
                    if (handlers && handlers.onData) handlers.onData(data);
                });
            });
        });
    }

    public joinRoom(id: string, handlers: INetplayEventHandlers): void {
        this.broker.on('open', () => {
            this.id = id;
            const conn = this.broker.connect(id, {
                reliable: true,
            });
            if (handlers && handlers.onCreate) handlers.onCreate();

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