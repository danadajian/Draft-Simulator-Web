import * as React from 'react';

interface playerAttributes {
    Rank: number,
    Name: string,
    Position: string,
    Team: string,
}

interface playerProps {
    player: playerAttributes,
    isUserPlayer: boolean,
    onChange: () => void,
    onMove: (direction: string) => void
}

const plus = require("./icons/plus.ico") as any;
const minus = require("./icons/minus.ico") as any;
const up = require("./icons/up.ico") as any;
const down = require("./icons/down.ico") as any;

const Player = (props: playerProps) =>
    <tr>
        <td>{props.player.Rank}</td>
        <td>
            <tr style={{fontWeight: 'bold'}}>{props.player.Name}</tr>
            <tr>{props.player.Team} {props.player.Position}</tr>
        </td>
        <td>
            <img src={(props.isUserPlayer) ? minus : plus} alt={"add-or-remove"} onClick={props.onChange} style={{height: '3vmin'}}/>
        </td>
        {props.isUserPlayer && (
            <td style={{display: 'flex', flexDirection: 'column'}}>
                <img src={up} alt={"up"} onClick={() => props.onMove('up')} style={{height: '3vmin'}}/>
                <img src={down} alt={"down"} onClick={() => props.onMove('down')} style={{height: '3vmin'}}/>
            </td>
            )
        }
    </tr>;

export const PlayerListBox = (props: {
    playerList: playerAttributes[],
    filterList: playerAttributes[],
    addPlayer: (index: number) => void }) =>
        <table style={{ borderCollapse: 'collapse'}} className={'Draft-grid'}>
            {props.playerList.map(
                (player, index) => {
                    if (!props.filterList || props.filterList.includes(player)) {
                        return (
                            <Player player={player}
                                        isUserPlayer={false}
                                        onChange={() => props.addPlayer(index)}
                                        onMove={null}
                            />
                        )
                    }
                }
            )}
        </table>;

export const UserListBox = (props: {
    userRoundList: [playerAttributes[]],
    removePlayer: (roundIndex: number, index: number) => void,
    movePlayer: (roundIndex: number, index: number, direction: string) => void}) =>
        props.userRoundList.map(
            (playerList, roundIndex) => {
                return (
                    <table style={{borderCollapse: 'collapse', marginBottom: '5vmin'}} className={'Draft-grid'}>
                        <th colSpan={4} style={{textAlign: 'center'}}>{'Round ' + (roundIndex + 1)}</th>
                        {playerList.map(
                            (player, index) => (
                                <Player player={player}
                                        isUserPlayer={true}
                                        onChange={() => props.removePlayer(roundIndex, index)}
                                        onMove={(direction) => props.movePlayer(roundIndex, index, direction)}
                                />
                            )
                        )}
                    </table>
                )
            });
