import * as React from 'react';

interface playerAttributes {
    Rank: number,
    Name: string,
    Position: string,
    Team: string,
}

interface playerProps {
    player: playerAttributes,
    onChange: () => void
}

const Player = (props: playerProps) =>
    <tr>
        <td>{props.player.Rank}</td>
        <td>
            <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
            <tr>{props.player.Team} {props.player.Position}</tr>
        </td>
        <td>
            <button onClick={props.onChange}>Add</button>
        </td>
    </tr>;

export const PlayerListBox = (props: { playerList: playerAttributes[], addPlayer: (index: number) => void }) =>
    <table className={'Dfs-grid'}>
        {props.playerList.map(
            (player) => (
                <Player player={player} onChange={() => props.addPlayer(player.Rank)}/>
            )
        )}
    </table>;

export const UserListBox = (props: { playerList: playerAttributes[], removePlayer: (index: number) => void }) =>
<table className={'Dfs-grid'}>
    {props.playerList.map(
        (player, index) => (
            <Player player={player} onChange={() => props.removePlayer(index)}/>
        )
    )}
</table>;
