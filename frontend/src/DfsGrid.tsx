import * as React from 'react';

interface playerAttributes {
    Position: string,
    Team: string,
    Player: string,
    Projected: number,
    Price: string,
    Opp: string,
    Weather: any
}

interface playerProps {
    player: playerAttributes,
    onRemove: () => void
}

const cloudy = require("./icons/cloudy.ico") as any;
const partlyCloudy = require("./icons/partlycloudy.ico") as any;
const rainy = require("./icons/rainy.ico") as any;
const snowy = require("./icons/snowy.ico") as any;
const stormy = require("./icons/stormy.ico") as any;
const sunny = require("./icons/sunny.ico") as any;

const Player = (props: playerProps) => {
    const forecast = props.player.Weather.forecast.toLowerCase();
    const weatherImage =
        (forecast.includes('partly')) ? partlyCloudy :
        (forecast.includes('cloud')) ? cloudy :
        (forecast.includes('rain')) ? rainy :
        (forecast.includes('snow')) ? snowy :
        (forecast.includes('storm')) ? stormy :
        (forecast.includes('sun')) ? sunny : null;

    return (
        <tr>
            <td>
                {props.player.Position && <button onClick={props.onRemove} style={{fontWeight: 'bold'}}>X</button>}
            </td>
            <td>{props.player.Position}</td>
            <td>{props.player.Team}</td>
            <td style={{fontWeight: (props.player.Position) ? 'normal' : 'bold'}}>{props.player.Player}</td>
            <td style={{fontWeight: (props.player.Position) ? 'normal' : 'bold'}}>{props.player.Projected}</td>
            <td style={{fontWeight: (props.player.Position) ? 'normal' : 'bold'}}>{props.player.Price}</td>
            <td>{props.player.Opp}</td>
            <td style={{display: 'flex', alignItems: 'center'}}>
                {props.player.Weather.forecast && <img src={weatherImage} alt={"weather"} style={{height: '4vmin'}}/>}
                <p>{props.player.Weather.details}</p>
            </td>
        </tr>
    );
};

export const DfsGrid = (props: {
        dfsLineup: playerAttributes[],
        removePlayer: (playerIndex: number, site: string) => void,
        site: string}) =>
    <table className={'Dfs-grid'}>
        <tr style={{backgroundColor: (props.site === 'fd') ? 'dodgerblue' : 'black'}}>
            <th>Exclude</th>
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
