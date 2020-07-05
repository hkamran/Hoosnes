import * as React from "react";
import ReactTooltip from "react-tooltip";
import {NetplayClient} from "../app/netplay/NetplayClient";
import {NetplayLeader} from "../app/netplay/NetplayLeader";

interface IMultiplayerBarProps {
    playerRoomId: string;
}

interface IMultiplayerBarState {
    clientRoomId?: string;
    hasPlayerOneJoined: boolean;
    hasPlayerTwoJoined: boolean;
    isUserPlayerOne: boolean;
}

declare let window: any;

export class NetplayBar extends React.Component<IMultiplayerBarProps, IMultiplayerBarState> {

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

    public createRoom() {
        const id: string = this.props.playerRoomId;
        const isUserPlayerOne = id == null;

        const handlers = {
            onCreate: (roomId) => {
                this.setState({
                    clientRoomId: roomId,
                    isUserPlayerOne,
                    hasPlayerOneJoined: true,
                });
            },
            onConnect: () => {
                this.setState({
                    hasPlayerTwoJoined: true,
                });
            },
            onDisconnect: () => {
                this.setState({
                    hasPlayerTwoJoined: false,
                });
            },
            onError: (err) => {
                alert(''+err);
            },
            onData: (data) => {

            },
        };
        let leader = new NetplayLeader(2, window.snes, handlers);
        leader.connect();
        window.client = leader;
    }

    public joinRoom() {
        const id: string = this.props.playerRoomId;

        const handlers = {
            onCreate: () => {
                this.setState({
                    clientRoomId: id,
                    isUserPlayerOne: false,
                    hasPlayerTwoJoined: true,
                });
            },
            onConnect: () => {
                this.setState({
                    hasPlayerOneJoined: true,
                });
            },
            onDisconnect: () => {
                this.setState({
                    hasPlayerOneJoined: false,
                });
            },
            onError: (err) => {
                alert(''+err);
            },
            onData: (data) => {

            },
        };
        let client = new NetplayClient(id, window.snes, handlers);
        client.connect();
        window.client = client;
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