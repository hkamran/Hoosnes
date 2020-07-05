import {Logger, LoggerManager} from "typescript-logger";
import Peer from "peerjs";
import {INetplayEventHandlers} from "./NetplayClient";
import {Console} from "../console/Console";
import {joy1, joy2} from "../console/controller/Controller";

const HOST = "localhost";
const PORT = 9000;

export enum INetplayPayloadType {
    RESET, PLAYER_ID, STOP, PLAY, KEYS,
}

export interface INetplayPayload {
    type: INetplayPayloadType;
    message: Record<string, string>;
}

export class NetplayLeader {

    public log : Logger = LoggerManager.create('NetplayLeader');
    public id: number = 1;
    public roomId: string;

    public capacity: number;
    public connections: Record<string, Peer.DataConnection> = {};

    private console: Console;
    private handlers: INetplayEventHandlers;

    public constructor(capacity: number, console: Console, handlers?: INetplayEventHandlers) {
        this.capacity = Math.max(0, capacity - 1);
        this.console = console;
        this.handlers = handlers;
    }

    public connect(): void {
        const { handlers } = this;

        const broker = new Peer({
            host: HOST,
            port: PORT,
        });

        broker.on('error', (err) => {
            alert(''+err);
        });

        broker.on('open', (id) => {
            this.applyOnCreate(id);

            if (handlers && handlers.onCreate) handlers.onCreate(id);

            broker.on('connection', (conn: Peer.DataConnection) => {
                if (handlers && handlers.onConnect) handlers.onConnect();

                const occupants = Object.keys(this.connections).length;
                const isFull = occupants + 1 > this.capacity;
                if (isFull) {
                    try { conn.close(); } catch (e) {}
                    return;
                }

                conn.on('close', () => {
                    this.applyOnDisconnect(conn);
                    if (handlers && handlers.onDisconnect) handlers.onDisconnect();
                });

                conn.on('error', (err) => {
                    this.applyOnDisconnect(conn);
                    if (handlers && handlers.onError) handlers.onError(err);
                });

                conn.on('data', (data) => {
                    this.applyOnData(conn, data);
                    if (handlers && handlers.onData) handlers.onData(data);
                });

                conn.on('open', () => {
                    this.applyOnConnect(conn);
                });
            });
        });
    }

    private applyOnConnect(conn: Peer.DataConnection): void {
        const occupants = Object.keys(this.connections).length;

        this.connections[conn.peer] = conn;
        this.console.stop();

        for (const connection of Object.values(this.connections)) {
            connection.send(createMessage(
                INetplayPayloadType.STOP,
            ));
        }

        conn.send(createMessage(
            INetplayPayloadType.PLAYER_ID,
            occupants + 1,
        ));

        conn.send(createMessage(
            INetplayPayloadType.RESET,
            this.console.saveState(),
        ));
    }

    private applyOnCreate(id: string): void {
        this.roomId = id;
        this.console.stop();
    }

    private applyOnData(conn: Peer.DataConnection, data: any): void {
        const { console, log } = this;
        const json: { type: INetplayPayloadType, message?: any } = JSON.parse(data);

        const type  = json.type;
        const message  = json.message;

        if (type == INetplayPayloadType.KEYS) {
            const id = message.id;
            const state = message.controller;
            joy2.loadState(state);

            requestAnimationFrame(() => {
                console.ticks(console.tpf);
            });

            conn.send(createMessage(INetplayPayloadType.KEYS, {
                id: this.id,
                controller: joy1.saveState(),
            }));
        }
    }

    private applyOnDisconnect(conn: Peer.DataConnection): void {
        try {
            conn.close();
        } finally {}
        delete this.connections[conn.peer];
    }

}

export function createMessage(type: INetplayPayloadType, message?: any) {
    return JSON.stringify({
        type,
        message,
    });
}