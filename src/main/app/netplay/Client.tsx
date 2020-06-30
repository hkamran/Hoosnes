import Peer from "peerjs";
import {Logger, LoggerManager} from "typescript-logger";


const HOST = "localhost";
const PORT = 9000;

let broker: Peer;
let conn: Peer.DataConnection;

export class Client {

    public log : Logger = LoggerManager.create('Client');
    public id: string;

    constructor() {
        if (conn) {
            this.close();
        }

        broker = new Peer({
            host: HOST,
            port: PORT,
            debug: 3,
            config: {
                iceCandidatePoolSize: 2,
            },
        });

        broker.on('error', (err) => {
            alert(''+err);
        });
    }

    public createRoom(onCreate?: () => void, onConnection?: (conn: Peer.DataConnection) => void): void {
        broker.on('open', (id) => {
            this.id = id;
            this.log.info(`client connected id=${id}`);

            if (onCreate) onCreate();
        });

        broker.on('connection', (dataConnection: Peer.DataConnection) => {
            this.log.info(`connection successful!`);
            conn = dataConnection;

            if (onConnection) onConnection(conn);
        });
    }

    public joinRoom(id: string, onConnection?: (conn: Peer.DataConnection) => void): void {
        broker.on('open', () => {
            this.id = id;
            conn = broker.connect(id, {
                reliable: true,
            });

            if (onConnection) onConnection(conn);
        });
    }

    public close() {
        try {
            if (broker) {
                broker.destroy();
            }
            broker = null;
        } catch {

        }
    }
}