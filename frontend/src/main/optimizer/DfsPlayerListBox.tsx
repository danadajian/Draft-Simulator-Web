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
    player: playerAttributes,
    isPlayerPool: boolean,
    onChange: () => void,
    onMove: (direction: string) => void
}

const plus = require("../../icons/plus.ico") as any;
const minus = require("../../icons/minus.ico") as any;

const Player = (props: playerProps) =>
    <tr>
        <td>
            <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
            <tr>{props.player.Team} {props.player.Position}</tr>
        </td>
        <td>{props.player.Opp}</td>
        <td>{'$'.concat(props.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</td>
        <td>
            <img src={(props.isPlayerPool) ? plus : minus} alt={"add-or-remove"} onClick={props.onChange} style={{height: '3vmin'}}/>
        </td>
    </tr>;

export const DfsPlayerBox = (props: {
    playerList: playerAttributes[],
    filterList: playerAttributes[],
    playerFunction: (index: number) => void,
    isPlayerPool: boolean}) =>
        <table style={{ borderCollapse: 'collapse'}} className={'Draft-grid'}>
            <tr style={{backgroundColor: 'gray'}}>
                <th>Player</th>
                <th>Opp</th>
                <th>Salary</th>
                <th>Add</th>
            </tr>
            {props.playerList.sort((a, b) => b.Price - a.Price).map(
                (player, index) => {
                    if (props.filterList.length === 0 || props.filterList.includes(player)) {
                        return (
                            <Player player={player}
                                        isPlayerPool={props.isPlayerPool}
                                        onChange={() => props.playerFunction(index)}
                                        onMove={null}
                            />
                        )
                    }
                }
            )}
        </table>;
