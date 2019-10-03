import * as React from 'react';

interface playerAttributes {
    Position: string,
    Team: string,
    Name: string,
    Status: string,
    Projected: number,
    Price: number,
    Opp: string,
    Weather: any
}

interface playerProps {
    player: playerAttributes
}

const Player = (props: playerProps) =>
    <tr>
        <td>
            <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
            <tr>{props.player.Team} {props.player.Position}</tr>
        </td>
        <td>{props.player.Opp}</td>
        <td>
            {'$'.concat(props.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
        </td>
    </tr>;

export const DfsBlackListBox = (props: {
    blackList: playerAttributes[]
    }) =>
        <table style={{ borderCollapse: 'collapse'}} className={'Draft-grid'}>
            <tr style={{backgroundColor: 'indianred'}}>
                <th>Player</th>
                <th>Opp</th>
                <th>Salary</th>
            </tr>
            {props.blackList.sort((a, b) => b.Price - a.Price).map(
                (player) => {
                    return (
                        <Player player={player}/>
                    )
                }
            )}
        </table>;
