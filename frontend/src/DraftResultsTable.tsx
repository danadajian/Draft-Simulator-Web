import * as React from 'react';

interface playerAttributes {
    Name: string,
    Position: string,
    Team: string,
    Frequency: string
}

export const DraftResultsTable = (props: {
    frequencyData: playerAttributes[]}) =>
    <table>
        <tr>
            <th>Player</th>
            <th>Draft Frequency</th>
        </tr>
        {props.frequencyData.map(
            (player) => (
                <tr>
                    <td>
                        <tr style={{fontWeight: 'bold'}}>{player.Name}</tr>
                        <tr>{player.Team} {player.Position}</tr>
                    </td>
                    <td>{player.Frequency}</td>
                </tr>
            )
        )}
    </table>;