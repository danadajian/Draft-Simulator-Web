import * as React from 'react';

interface playerAttributes {
    Rank: number,
    Name: string,
    Position: string,
    Team: string,
}

interface playerProps {
    player: playerAttributes,
    isAdd: boolean,
    onChange: () => void
}

const plus = require("./icons/plus.ico") as any;
const minus = require("./icons/minus.ico") as any;

const Player = (props: playerProps) =>
    <tr>
        <td>{props.player.Rank}</td>
        <td>
            <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
            <tr>{props.player.Team} {props.player.Position}</tr>
        </td>
        <td>
            <img src={(props.isAdd) ? plus : minus} alt={"add-or-remove"} onClick={props.onChange} style={{height: '4vmin'}}/>
        </td>
    </tr>;

export const PlayerListBox = (props: { playerList: playerAttributes[], addPlayer: (index: number) => void }) =>
    <table style={{ borderCollapse: 'collapse'}} className={'Draft-grid'}>
        {props.playerList.map(
            (player, index) => (
                <Player player={player} isAdd={true} onChange={() => props.addPlayer(index)}/>
            )
        )}
    </table>;

export const UserListBox = (props: { playerList: playerAttributes[], removePlayer: (index: number) => void }) =>
<table style={{borderCollapse: 'collapse'}} className={'Draft-grid'}>
    {props.playerList.map(
        (player, index) => (
            <Player player={player} isAdd={false} onChange={() => props.removePlayer(index)}/>
        )
    )}
</table>;
