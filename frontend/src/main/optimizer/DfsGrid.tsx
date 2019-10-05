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
    onRemove: () => void,
    whiteList: playerAttributes[]
}

const cloudy = require("../../icons/cloudy.ico") as any;
const partlyCloudy = require("../../icons/partlycloudy.ico") as any;
const rainy = require("../../icons/rainy.ico") as any;
const snowy = require("../../icons/snowy.ico") as any;
const stormy = require("../../icons/stormy.ico") as any;
const sunny = require("../../icons/sunny.ico") as any;

const Player = (props: playerProps) => {
    const forecast = (props.player.Weather.forecast) ? props.player.Weather.forecast.toLowerCase() : null;
    const weatherImage = (props.player.Weather.forecast) ?
        (forecast.includes('partly')) ? partlyCloudy :
        (forecast.includes('cloud') || forecast.includes('fog')) ? cloudy :
        (forecast.includes('storm') || forecast.includes('thunder')) ? stormy :
        (forecast.includes('rain') || forecast.includes('shower')) ? rainy :
        (forecast.includes('snow') || forecast.includes('flurr')) ? snowy :
        (forecast.includes('sun') || forecast.includes('clear')) ? sunny : null
        : null;

    return (
        <tr style={{backgroundColor: (props.player.Name && props.whiteList.filter(
            (player) => player.Name).map((player) => (player.Name)).includes(props.player.Name)) ? 'lightgreen' : null}}>
            <td>{props.player.Position}</td>
            <td>{props.player.Team}</td>
            <td style={{fontWeight: (props.player.Position) ? 'normal' : 'bold'}}>
                {props.player.Name} <b style={{color: 'red'}}>{props.player.Status}</b></td>
            <td style={{fontWeight: (props.player.Position) ? 'normal' : 'bold'}}>
                {props.player.Projected}</td>
            <td style={{fontWeight: (props.player.Position) ? 'normal' : 'bold'}}>
                {props.player.Price && '$'.concat(props.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</td>
            <td>{props.player.Opp}</td>
            <td style={{display: 'flex', alignItems: 'center'}}>
                {props.player.Weather.forecast && <img src={weatherImage} alt={"weather"} style={{height: '4vmin'}}/>}
                <p>{props.player.Weather.details}</p>
            </td>
            <td>
                {props.player.Position && props.player.Name && <button onClick={props.onRemove} style={{fontWeight: 'bold'}}>X</button>}
            </td>
        </tr>
    );
};

export const DfsGrid = (props: {
    dfsLineup: playerAttributes[],
    removePlayer: (playerIndex: number) => void,
    site: string,
    whiteList: playerAttributes[],
    pointSum: number,
    salarySum: number,
    cap: number}) =>
        <table className={'Dfs-grid'}>
            <tr style={{backgroundColor: (props.site === 'fd') ? 'dodgerblue' : 'black'}}>
                <th>Position</th>
                <th>Team</th>
                <th>Player</th>
                <th>Projected</th>
                <th>Price</th>
                <th>Opp</th>
                <th>Weather</th>
                <th>Remove</th>
            </tr>
            {props.dfsLineup.map(
                (player, playerIndex) => (
                    <Player player={player}
                            onRemove={() => props.removePlayer(playerIndex)}
                            whiteList={props.whiteList}
                    />
                )
            )}
            <tr style={{fontWeight: 'bold'}}>
                <td>{null}</td>
                <td>{null}</td>
                <td>Total</td>
                <td>{props.pointSum.toFixed(1)}</td>
                <td style={{color: (props.salarySum > props.cap) ? 'indianred' : 'black'}}>
                    {'$'.concat(props.salarySum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                </td>
                <td>{null}</td>
                <td>{null}</td>
                <td>{null}</td>
            </tr>
        </table>;
