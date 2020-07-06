import Peer from "peerjs";
import {Logger, LoggerManager} from "typescript-logger";
import {Console, IConsoleState} from "../console/Console";
import {createMessage, INetplayPayloadType} from "./NetplayLeader";
import {joypadForP1, joypadForP2, Key, joypadForNetplay} from "../console/controller/Controller";
import {Keyboard} from "../../web/Keyboard";

const HOST = window.location.hostname;
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
    public id: number;
    public roomId: string;

    private console: Console;
    private handlers: INetplayEventHandlers;
    private broker: Peer;

    public constructor(console: Console) {
        this.console = console;
    }

    public setHandlers(handlers: INetplayEventHandlers) {
        this.handlers = handlers;
    }

    public connect(roomId: string): void {
        this.roomId = roomId;
        const { handlers} = this;

        const broker = new Peer({
            host: HOST,
            port: PORT,
        });

        broker.on('error', (err) => {
            if (handlers && handlers.onError) handlers.onError(err);
        });

        this.broker = broker;

        broker.on('open', () => {
            const conn = broker.connect(roomId, {
                reliable: true,
            });
            this.applyOnCreate(roomId);
            if (handlers && handlers.onCreate) handlers.onCreate(roomId);

            conn.on('close', () => {
                this.applyOnDisconnect(conn);
                if (handlers && handlers.onDisconnect) handlers.onDisconnect();
            });

            conn.on('error', (err) => {
                if (handlers && handlers.onError) handlers.onError(err);
            });

            conn.on('open', () => {
                this.applyOnConnect(conn);
                if (handlers && handlers.onConnect) handlers.onConnect();
            });

            conn.on('data', (data) => {
                this.applyOnData(conn, data);
                if (handlers && handlers.onData) handlers.onData(data);
            });
        });
    }

    public disconnect(): void {
        this.broker.destroy();
    }

    private applyOnConnect(conn: Peer.DataConnection): void {

    }

    private applyOnCreate(id: string): void {
        this.roomId = id;
        Keyboard.initialize(joypadForNetplay);
    }

    private applyOnData(conn: Peer.DataConnection, data: any): void {
        const { console, log } = this;
        const json: { type: INetplayPayloadType, message?: any } = JSON.parse(data);

        const type  = json.type;
        const message  = json.message;

        if (type == INetplayPayloadType.STOP) {
            console.stop();
        } else if (type == INetplayPayloadType.RESET) {
            const state: IConsoleState = message;
            console.reset();
            console.loadState(state);

            conn.send(createMessage(
                INetplayPayloadType.KEYS,{
                    controller2: joypadForNetplay.saveState(),
                },
            ));
        } else if (type == INetplayPayloadType.KEYS) {
            const joy1State = message.controller1;
            const joy2State = message.controller2;

            joypadForP1.loadState(joy1State);
            joypadForP2.loadState(joy2State);

            requestAnimationFrame(() => {
                console.ticks(console.tpf);
            });

            conn.send(createMessage(
                INetplayPayloadType.KEYS,
                {
                    controller2: joypadForNetplay.saveState(),
                },
            ));
        } else if (type == INetplayPayloadType.PLAYER_ID) {
            log.info("PLAYER ID");
            this.id = message;
        }
    }

    private applyOnDisconnect(conn: Peer.DataConnection): void {
        console.log("Disconnected");
    }
}