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

const Player = (props: playerProps) =>
    <tr>
        <td>{props.player.Rank}</td>
        <td>
            <table>
                <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
                <tr>{props.player.Team} {props.player.Position}</tr>
            </table>
        </td>
        <td>
            <button onClick={props.onChange}>{(props.isAdd) ? 'Add' : 'Remove'}</button>
        </td>
    </tr>;

export const PlayerListBox = (props: { playerList: playerAttributes[], addPlayer: (index: number) => void }) =>
    <table className={'Dfs-grid'}>
        {props.playerList.map(
            (player, index) => (
                <Player player={player} isAdd={true} onChange={() => props.addPlayer(index)}/>
            )
        )}
    </table>;

export const UserListBox = (props: { playerList: playerAttributes[], removePlayer: (index: number) => void }) =>
<table className={'Dfs-grid'}>
    {props.playerList.map(
        (player, index) => (
            <Player player={player} isAdd={false} onChange={() => props.removePlayer(index)}/>
        )
    )}
</table>;
