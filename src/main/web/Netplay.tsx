import * as React from "react";
import ReactTooltip from "react-tooltip";

export class Netplay extends React.Component<any, any> {

    public render() {
        const isPlayerOneJoined = false;
        const isPlayerTwoJoined = false;

        const isPlayerOne = false;

        const playerOneDataTip = `Player 1 ${(isPlayerOne ? ` (You)` : (isPlayerOneJoined ? ` (JOINED)` : ` (EMPTY)`))}`;
        const playerTwoDataTip = `Player 2 ${(!isPlayerOne ? ` (You)` : (isPlayerTwoJoined ? ` (JOINED)` : ` (EMPTY)`))}`;

        const handleFocus = (event) => event.target.select();
        return (
            <div style={{display: "flex"}}>
                <div className={"netplay wrapper"}>
                    <div className={"netplay"}>
                        <div className={"room"}>
                            <div className={"label"}>
                                ROOM
                            </div>
                            <div className={"value"}>
                                <input type="text" id="roomId" readOnly={true} value="http://notimplemented.com" onFocus={handleFocus}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"netplay wrapper"} style={{width: "55px", flexGrow: 0, marginLeft: "15px"}}>
                    <div className={"netplay"}>
                        <div className={"value users"}>
                            <i className="fa fa-user" aria-hidden="true" style={{marginRight: "8px"}} data-tip={playerOneDataTip} />
                            <i className="fa fa-user" aria-hidden="true" data-tip={playerTwoDataTip} />
                        </div>
                    </div>
                </div>
                <ReactTooltip/>
            </div>
        );
    }

}