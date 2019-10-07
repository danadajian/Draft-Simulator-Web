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
    onPlusClick: () => void,
    onMinusClick: () => void,
    whiteList: playerAttributes[],
    blackList: playerAttributes[],
    salarySum: number,
    cap: number
}

const plus = require("../../icons/plus.ico") as any;
const minus = require("../../icons/minus.ico") as any;

const Player = (props: playerProps) =>
    <tr style={{backgroundColor: (props.whiteList.includes(props.player)) ? 'lightgreen' : (props.blackList.includes(props.player)) ? 'indianred' : 'white'}}>
        <td>
            <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
            <tr>{props.player.Team} {props.player.Position}</tr>
        </td>
        <td>{props.player.Opp}</td>
        <td style={{color: (props.salarySum + props.player.Price > props.cap) ? 'red' : 'black'}}>
            {'$'.concat(props.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
        </td>
        <td>
            <img src={plus} alt={"add"} onClick={props.onPlusClick} style={{height: '3vmin'}}/>
        </td>
        <td>
            <img src={minus} alt={"remove"} onClick={props.onMinusClick} style={{height: '3vmin'}}/>
        </td>
    </tr>;

export const DfsPlayerBox = (props: {
    playerList: playerAttributes[],
    filterList: playerAttributes[],
    whiteListFunction: (index: number) => void,
    blackListFunction: (index: number) => void,
    whiteList: playerAttributes[],
    blackList: playerAttributes[],
    salarySum: number,
    cap: number}) =>
        <table style={{ borderCollapse: 'collapse'}} className={'Draft-grid'}>
            <tr style={{backgroundColor: 'lightgray'}}>
                <th>Player</th>
                <th>Opp</th>
                <th>Salary</th>
                <th>Add</th>
                <th>Blacklist</th>
            </tr>
            {props.playerList.sort((a, b) => b.Price - a.Price).map(
                (player, index) => {
                    if (!props.filterList || props.filterList.includes(player)) {
                        return (
                            <Player player={player}
                                    onPlusClick={() => props.whiteListFunction(index)}
                                    onMinusClick={() => props.blackListFunction(index)}
                                    whiteList={props.whiteList}
                                    blackList={props.blackList}
                                    salarySum={props.salarySum}
                                    cap={props.cap}
                            />
                        )
                    }
                }
            )}
        </table>;
