import JqxListBox from './jqxwidgets/react_jqxlistbox';
import * as React from 'react';

interface playerInfo {
    Rank: number,
    Player: string
    Position: string,
    Team: string
}

export const PlayerListBox = (props: { playerList: playerInfo[] }) => {

    return (
    <JqxListBox ref={playerListBox}
        width={250} height={400} mySelections={this.getSelectedItems()}
        source={props.playerList} filterable={true} searchMode={"containsignorecase"}
        multiple={true} className={"Player-list-box"}/>
    );
};
