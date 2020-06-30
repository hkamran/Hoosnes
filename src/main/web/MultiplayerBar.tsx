import * as React from "react";
import ReactTooltip from "react-tooltip";

export class MultiplayerBar extends React.Component<any, any> {

    public render() {
        const isPlayerOneJoined = false;
        const isPlayerTwoJoined = false;

        const isUserPlayerOne = true;

        const playerOneDataTip = `Player 1 ${(isUserPlayerOne ? ` (You)` : (isPlayerOneJoined ? ` (JOINED)` : ` (EMPTY)`))}`;
        const playerTwoDataTip = `Player 2 ${(!isUserPlayerOne ? ` (You)` : (isPlayerTwoJoined ? ` (JOINED)` : ` (EMPTY)`))}`;

        const playerOneStyle = {
            marginRight: "8px",
            color: (isPlayerOneJoined ? "#eaeaea": "#383838"),
        };

        const playerTwoStyle = {
            color: (isPlayerTwoJoined ? "#eaeaea": "#383838"),
        };

        if (isUserPlayerOne) {
            playerOneStyle.color = "#fece15";
        } else {
            playerTwoStyle.color = "#fece15";
        }

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
                                <input type="text" id="roomId" readOnly={true} value="http://notimplemented.com" onFocus={handleFocus}/>
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