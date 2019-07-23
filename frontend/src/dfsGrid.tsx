import React, { Component } from 'react';
import './App.css';

interface playerAttributes {
    position: string,
    team: string,
    player: string,
    projected: number,
    price: string,
    opp: string,
    weather: string
}

interface playerProps {
    player: playerAttributes,
    onRemove: () => void
}

const Player = (props: playerProps) =>
    <tr>
        <td>
            <button onClick={props.onRemove}>X</button>
        </td>
        <td>{props.player.position}</td>
        <td>{props.player.team}</td>
        <td>{props.player.player}</td>
        <td>{props.player.projected}</td>
        <td>{props.player.price}</td>
        <td>{props.player.opp}</td>
        <td>{props.player.weather}</td>
    </tr>;

export class dfsGrid extends Component {
    render() {
        return (
            <table>
                <tr>
                    <th>
                    </th>
                    <th>Position</th>
                    <th>Team</th>
                    <th>Player</th>
                    <th>Projected</th>
                    <th>Opp</th>
                    <th>Weather</th>
                </tr>
                {this.props.dfsLineup.map(
                    (player, playerIndex) => (
                        <Player player={player} onRemove={() => this.removePlayer(playerIndex, 'fd')}/>
                    )
                )}
            </table>
        )
    }
}
