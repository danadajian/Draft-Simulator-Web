import * as React from 'react';

interface playerAttributes {
    Position: string,
    Team: string,
    Player: string,
    Projected: number,
    Price: string,
    Opp: string,
    Weather: string
}

interface playerProps {
    player: playerAttributes,
    onRemove: () => void
}

const Player = (props: playerProps) =>
    <tr>
        <td>
            {props.player.Position && <button onClick={props.onRemove}>X</button>}
        </td>
        <td>{props.player.Position}</td>
        <td>{props.player.Team}</td>
        <td>{props.player.Player}</td>
        <td>{props.player.Projected}</td>
        <td>{props.player.Price}</td>
        <td>{props.player.Opp}</td>
        <td>{props.player.Weather}</td>
    </tr>;

export const DfsGrid = (props: {
        dfsLineup: playerAttributes[],
        removePlayer: (playerIndex: number, site: string) => void,
        site: string}) =>
    <table className={"Dfs-player-grids"}>
        <tr>
            <th>
            </th>
            <th>Position</th>
            <th>Team</th>
            <th>Player</th>
            <th>Projected</th>
            <th>Price</th>
            <th>Opp</th>
            <th>Weather</th>
        </tr>
        {props.dfsLineup.map(
            (player, playerIndex) => (
                <Player player={player} onRemove={() => props.removePlayer(playerIndex, props.site)}/>
            )
        )}
    </table>;
