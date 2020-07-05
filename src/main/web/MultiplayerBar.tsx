import * as React from "react";
import ReactTooltip from "react-tooltip";
import {NetplayClient} from "../app/netplay/NetplayClient";

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

export class MultiplayerBar extends React.Component<IMultiplayerBarProps, IMultiplayerBarState> {

    private client: NetplayClient;

    public state = {
        hasPlayerOneJoined: false,
        hasPlayerTwoJoined: false,
        isUserPlayerOne: false,
    };

    public componentDidMount(): void {
        const id: string = this.props.playerRoomId;
        const doCreateRoom: boolean = id == null;

        const isUserPlayerOne = id == null;

        this.client = new NetplayClient(2);

        window.client = this.client;
        if (doCreateRoom) {
            this.client.createRoom({
                onCreate: () => {
                    this.setState({
                        clientRoomId: this.client.id,
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
            });
        } else {
            this.client.joinRoom(id, {
                onCreate: () => {
                    this.setState({
                        clientRoomId: this.client.id,
                        isUserPlayerOne,
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
            });
        }
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
        const url = this.client ? `${host}?roomId=${this.client.id}` : ``;

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