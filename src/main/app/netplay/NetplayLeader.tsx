import {Logger, LoggerManager} from "typescript-logger";
import Peer from "peerjs";
import {INetplayEventHandlers} from "./NetplayClient";

const HOST = "localhost";
const PORT = 9000;

export class NetplayLeader {

    public log : Logger = LoggerManager.create('NetplayLeader');

    public capacity: number;
    public occupants: number;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public create(handlers: INetplayEventHandlers): void {
        const broker = new Peer({
            host: HOST,
            port: PORT,
            debug: 3,
        });

        broker.on('error', (err) => {
            alert(''+err);
        });

        broker.on('open', (id) => {
            this.log.info(`room created id=${id}`);
            this.occupants = 1;

            if (handlers && handlers.onCreate) handlers.onCreate(id);

            broker.on('connection', (conn: Peer.DataConnection) => {
                if (handlers && handlers.onConnect) handlers.onConnect();

                this.occupants++;
                if (this.occupants > this.capacity) {
                    this.occupants = this.capacity;
                    try {
                        conn.close();
                    } catch (e) {}
                    return;
                }

                conn.on('close', () => {
                    this.occupants--;
                    if (handlers && handlers.onDisconnect) handlers.onDisconnect();
                });

                conn.on('error', (err) => {
                    this.occupants--;
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
}