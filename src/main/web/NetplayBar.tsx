import * as React from "react";
import ReactTooltip from "react-tooltip";
import {NetplayClient} from "../app/netplay/NetplayClient";
import {NetplayLeader} from "../app/netplay/NetplayLeader";

interface IMultiplayerBarProps {
    playerRoomId: string;
    setMessageHandler: (message: string) => void;
    leader: NetplayLeader;
    client: NetplayClient;
}

interface IMultiplayerBarState {
    clientRoomId?: string;
    hasPlayerOneJoined: boolean;
    hasPlayerTwoJoined: boolean;
    isUserPlayerOne: boolean;
}

declare let window: any;

export class NetplayBar extends React.Component<IMultiplayerBarProps, IMultiplayerBarState> {

    private leader: NetplayLeader;
    private client: NetplayClient;

    public state: IMultiplayerBarState = {
        hasPlayerOneJoined: false,
        hasPlayerTwoJoined: false,
        isUserPlayerOne: false,
    };

    public componentDidMount(): void {
        const id: string = this.props.playerRoomId;
        const doCreateRoom: boolean = id == null;

        if (doCreateRoom) {
            this.createRoom();
        } else {
            this.joinRoom();
        }
    }

    public componentWillUnmount() {
        const {leader, client} = this;

        if (leader) {
            leader.disconnect();
        }

        if (client) {
            client.disconnect();
        }

        this.props.setMessageHandler("");
    }

    public createRoom() {
        const id: string = this.props.playerRoomId;
        const leader = this.props.leader;
        const isUserPlayerOne = id == null;

        this.props.setMessageHandler("Connecting");

        const handlers = {
            onCreate: (roomId) => {
                this.setState({
                    clientRoomId: roomId,
                    isUserPlayerOne,
                    hasPlayerOneJoined: true,
                });
                this.props.setMessageHandler("Waiting");
            },
            onConnect: () => {
                this.setState({
                    hasPlayerTwoJoined: true,
                });
                this.props.setMessageHandler("");
            },
            onDisconnect: () => {
                this.setState({
                    hasPlayerTwoJoined: false,
                });
                this.props.setMessageHandler("Waiting");
            },
            onError: (err) => {
                this.props.setMessageHandler("Disconnected");
            },
            onData: (data) => {

            },
        };
        leader.setHandlers(handlers);
        leader.connect();
        window.client = leader;
        this.leader = leader;
    }

    public joinRoom() {
        const id: string = this.props.playerRoomId;
        const client = this.props.client;

        const handlers = {
            onCreate: () => {
                this.setState({
                    clientRoomId: id,
                    isUserPlayerOne: false,
                    hasPlayerTwoJoined: true,
                });
                this.props.setMessageHandler("Connecting");
            },
            onConnect: () => {
                this.setState({
                    hasPlayerOneJoined: true,
                });
                this.props.setMessageHandler("");
            },
            onDisconnect: () => {
                this.setState({
                    hasPlayerOneJoined: false,
                });
                this.props.setMessageHandler("Disconnected");
            },
            onError: (err) => {
                this.props.setMessageHandler("Disconnected");
            },
            onData: (data) => {

            },
        };
        client.setHandlers(handlers);
        client.connect(id);
        window.client = client;
        this.client = client;
    }

    public render() {
        const {hasPlayerOneJoined, hasPlayerTwoJoined, isUserPlayerOne} = this.state;

        const playerOneDataTip = `Player 1 ${(isUserPlayerOne ? ` (You)` : (hasPlayerOneJoined ? ` (JOINED)` : ` (EMPTY)`))}`;
        const playerTwoDataTip = `Player 2 ${(!isUserPlayerOne ? ` (You)` : (hasPlayerTwoJoined ? ` (JOINED)` : ` (EMPTY)`))}`;

        const userColor = "#fece15";
        const emptySlotColor = "#383838";
        const filledSlotColor = "#eaeaea";

        const playerOneStyle = {
            marginRight: "8px",
            color: (hasPlayerOneJoined ? (isUserPlayerOne ? userColor: filledSlotColor) : emptySlotColor),
        };

        const playerTwoStyle = {
            color: (hasPlayerTwoJoined ? (!isUserPlayerOne ? userColor: filledSlotColor) : emptySlotColor),
        };

        const host = window.location.href.split('?')[0];
        const url = this.state.clientRoomId ? `${host}?roomId=${this.state.clientRoomId}` : ``;

        const handleFocus = (event) => event.target.select();
        return (
            <div style={{display: "flex"}}>
                <div className={"netplay wrapper"}>
                    <div className={"netplay"}>
                        <div className={"room"}>
                            <div className={"label"}>
                                SHARE
                            </div>
                            <div className={"value"}>
                                <input type="text" id="roomId" readOnly={true} value={url} onFocus={handleFocus}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"netplay wrapper"} style={{flexGrow: 0, marginLeft: "15px"}}>
                    <div className={"netplay"}>
                        <div className={"users"}>
                            <div className={"label"}>
                                ROOM
                            </div>
                            <div className={"value"} style={{width: "55px"}}>
                                <i className="fa fa-user" aria-hidden="true" style={playerOneStyle} data-tip={playerOneDataTip} />
                                <i className="fa fa-user" aria-hidden="true" style={playerTwoStyle} data-tip={playerTwoDataTip} />
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTooltip/>
            </div>
        );
    }

}