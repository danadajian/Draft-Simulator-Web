import React, {Component} from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import './App.css';
import JqxPopover from './jqxwidgets/react_jqxpopover'
import { PlayerListBox, UserListBox } from "./PlayerListBox.tsx"
import { DraftResultsTable } from "./DraftResultsTable.tsx";
import football from './icons/football.ico'
import search from './icons/search.ico'

export class Simulator extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], searchText: '', filteredPlayers: null, site: 'espn',
            userPlayers: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            teamCount: 10, pickOrder: 5, roundCount: 16, isDrafting: false, isRandom: false,
            allFreqs: [], userFreqs: [], expectedTeam: [], frequencyData: []};
    }

    componentDidMount() {
        this.fetchPlayersForSimulator(this.state.site);
    }

    fetchPlayersForSimulator = (site) => {
        this.setState({isLoading: true});
        fetch(window.location.origin + '/' + site + '-players')
            .then(response => {
                if (response.status !== 200) {
                    alert('Could not load players.');
                } else {
                    response.json()
                        .then((players) => {
                            this.setState({
                                isLoading: false,
                                players: players,
                                site: site
                            });
                        })
                }
            });
    };

    handleSliderChange = (param, event) => {
        this.setState({[param]: event.target.value})
    };

    closeAbout = () => {
        this.refs.about.close();
        let url = window.location.pathname.split('#');
        window.location.href = window.location.origin + url[0].toString() + '#';
    };

    closeInstructions = () => {
        this.refs.instructions.close();
        let url = window.location.pathname.split('#');
        window.location.href = window.location.origin + url[0].toString() + '#';
    };

    swapRankings = () => {
        let newSite = (this.state.site === 'espn') ? 'yahoo' : 'espn';
        this.fetchPlayersForSimulator(newSite);
    };

    saveRankings = () => {
        let {userPlayers, site} = this.state;
        if (userPlayers.every((roundList) => roundList.length === 0)) {
            alert('Please rank at least one player before saving.');
        } else {
            fetch(window.location.origin + '/save-ranking/' + site, {
                method: 'POST',
                body: JSON.stringify(userPlayers)
            }).then(response => {
                if (response.status === 200) {
                    alert('User ranking saved successfully.');
                } else {
                    alert('User ranking unable to be saved.');
                }
            });
        }
    };

    loadRankings = () => {
        let site = this.state.site;
        fetch(window.location.origin + '/load-ranking/' + site)
            .then(response => {
                if (response.status !== 200) {
                    alert('Could not load user ranking data.');
                }  else {
                    response.json()
                        .then((userRanking) => {
                            if (userRanking[0] === 'No ranking specified.') {
                                alert(userRanking[0]);
                            } else {
                                let {players, userPlayers} = this.state;
                                let allPlayers = players.concat(userPlayers.flat());
                                players = allPlayers.sort((a, b) => a.Rank - b.Rank);
                                let allLoadedPlayers = userRanking.flat();
                                for (let i = 0; i < allLoadedPlayers.length; i++) {
                                    let userPlayerRank = allLoadedPlayers[i].Rank;
                                    let playerIndex = players.findIndex(
                                        (player) => player.Rank === userPlayerRank);
                                    players.splice(playerIndex, 1);
                                }
                                this.setState({
                                    players: players,
                                    userPlayers: userRanking,
                                    filteredPlayers: null
                                })
                            }
                        })
                }
            });
    };

    filterPlayers = (event) => {
        let text = event.target.value.toLowerCase();
        let players = this.state.players;
        let filteredPlayers = players.filter(
            (player) =>
                player.Name.toLowerCase().includes(text)
                || player.Position.toLowerCase().includes(text)
                || player.Team.toLowerCase().includes(text)
        );
        this.setState({
            searchText: text,
            filteredPlayers: filteredPlayers});
    };

    addPlayer = (playerIndex) => {
        let {players, userPlayers} = this.state;
        let playerToAdd = players[playerIndex];
        players.splice(playerIndex, 1);
        userPlayers[0].push(playerToAdd);
        this.setState({
            players: players,
            userPlayers: userPlayers,
            filteredPlayers: null,
            searchText: ''
        });
    };

    removePlayer = (roundIndex, playerIndex) => {
        let {players, userPlayers} = this.state;
        let roundList = userPlayers[roundIndex];
        let removedPlayer = roundList[playerIndex];
        let removedPlayerRank = removedPlayer.Rank;
        const originalPlayerNeighbor = players.find((player) => player.Rank > removedPlayerRank);
        players.splice(players.indexOf(originalPlayerNeighbor), 0, removedPlayer);
        roundList.splice(playerIndex, 1);
        this.setState({
            players: players,
            userPlayers: userPlayers
        });
    };

    clearPlayers = () => {
        let {players, userPlayers} = this.state;
        let allUserPlayers = userPlayers.flat();
        let allPlayers = players.concat(allUserPlayers);
        this.setState({
            players: allPlayers.sort((a, b) => a.Rank - b.Rank),
            userPlayers: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            filteredPlayers: null
        });
    };

    movePlayer = (roundIndex, playerIndex, direction) => {
        let userPlayers = this.state.userPlayers;
        let roundList = userPlayers[roundIndex];
        let player = roundList[playerIndex];
        userPlayers[roundIndex].splice(playerIndex, 1);
        if (direction === 'up') {
            if (playerIndex > 0) {
                userPlayers[roundIndex].splice(playerIndex - 1, 0, player);
            } else if (roundIndex > 0) {
                userPlayers[roundIndex - 1].push(player);
            } else {
                userPlayers[roundIndex].splice(playerIndex, 0, player);
            }
        } else if (direction === 'down') {
            if (playerIndex < roundList.length) {
                roundList.splice(playerIndex + 1, 0, player);
            } else if (roundIndex < userPlayers.length - 1) {
                userPlayers[roundIndex + 1].splice(0, 0, player);
            } else {
                userPlayers[roundIndex].splice(playerIndex, 0, player);
            }
        }
        this.setState({userPlayers: userPlayers});
    };

    determineIfRandom = (event) => {
        this.setState({isRandom: event.target.checked})
    };

    simulateDrafts = (draftCancelled) => {
        if (draftCancelled) {
            this.setState({isDrafting: false});
            return
        }
        let {userPlayers, teamCount, pickOrder, roundCount, site} = this.state;
        if (userPlayers.every((roundList) => roundList.length === 0)) {
            alert('Please select at least one player to draft.');
        } else {
            let playerNames = userPlayers.map((roundList) => roundList.map((player) => player.Name));
            this.setState({isDrafting: true});
            fetch(window.location.origin + '/draft-results', {
                method: 'POST',
                body: JSON.stringify(playerNames) + '|' + teamCount + '|' + pickOrder + '|' + roundCount + '|' + site
            }).then(response => {
                if (response.status !== 200) {
                    alert('Error loading draft results.');
                } else {
                    response.json()
                        .then((draftResults) => {
                            if (typeof draftResults[0] == "string") {
                                alert(draftResults[0]);
                            } else {
                                this.generateDraftOutput(draftResults);
                            }
                        })
                }
            });
        }
    };

    generateDraftOutput = (draftResults) => {
        if (draftResults === ['Draft error!']) {
            alert('No players were drafted. :( \nSomething went wrong . . .');
        }
        this.setState({
            isDrafting: false,
            userFreqs: draftResults.UserFrequencies,
            allFreqs: draftResults.AllFrequencies,
            expectedTeam: draftResults.ExpectedTeam,
            frequencyData: draftResults.UserFrequencies
        });
    };

    toggleFrequencyData = (frequencyData) => {
        this.setState({frequencyData: frequencyData});
    };

    render() {
        const {isLoading, players, filteredPlayers, site,
            userPlayers, teamCount, pickOrder, roundCount, isDrafting, isRandom,
            userFreqs, allFreqs, expectedTeam, frequencyData} = this.state;
        let playerListBox, draftResultsTable;

        if (isLoading) {
            playerListBox =
                <div className={"Loading"}>
                    <div><p className={"Loading-text"}>Loading players . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                </div>;
        } else {
            playerListBox =
                <PlayerListBox playerList={players} filterList={filteredPlayers} addPlayer={this.addPlayer}/>;
        }
        if (isDrafting) {
            draftResultsTable =
                <div className={"Loading"}>
                    <div><p className={"Loading-text"}>Drafting . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                    <div>
                        <button onClick={() => this.simulateDrafts(true)}
                                className={"Cancel-draft-button"}>Cancel</button>
                    </div>
                </div>;
        } else {
            draftResultsTable = <DraftResultsTable frequencyData={frequencyData}/>;
        }

        const swapButtonText = (site === 'espn') ? 'Switch to Yahoo' : 'Switch to ESPN';
        const swapButtonColor = (site === 'espn') ? '#6C00B3' : '#CE0000';

        return (
            <Container fluid={true}>
                <Navbar bg="primary" variant="dark">
                    <Nav className="Nav-bar">
                      <Nav.Link href="/">Home</Nav.Link>
                      <Nav.Link href="#about">About</Nav.Link>
                      <Nav.Link href="#instructions">Instructions</Nav.Link>
                      <Nav.Link href="/optimize">DFS Optimizer</Nav.Link>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <div className={"Info-buttons"}>
                    <JqxPopover ref='about' isModal={true} width={310}
                        position={'bottom'} title={'About Draft Simulator'} selector={'a[href$="#about"]'}>
                        <p>Draft Simulator is a fantasy football draft preparation tool.</p>
                        <p>More often than not, others in your league will only draft among the "top available
                            players" in each round, which are determined by ESPN's preseason rankings.</p>
                        <p>However, Draft Simulator allows you to create and refine your own personal rankings that
                            you can bring to your draft to get the team you've always dreamed of.</p>
                        <button onClick={this.closeAbout}
                        style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Got it!</button>
                    </JqxPopover>
                    <JqxPopover ref='instructions' isModal={true} width={310}
                        position={'bottom'} title={'Instructions'} selector={'a[href$="#instructions"]'}>
                        <ol>
                            <li>Search for and select players from the player list. These should be players you'd
                                feel strongly about drafting.</li>
                            <li>Click "Add" to move them to your preferred list.</li>
                            <li>Drag and drop your players in order of overall preference.</li>
                            <li>Adjust the sliders to your desired specifications, then click "Draft".</li>
                            <li>See how often you were able to draft each player under the "Draft Frequency"
                                tab.</li>
                            <li>The "All Players" tab shows the draft frequency of all players taken, not just your
                                preferred players.</li>
                            <li>The "Expected Team" tab shows your most likely fantasy team given the
                                simulations.</li>
                        </ol>
                        <button onClick={this.closeInstructions}
                        style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Let's draft!</button>
                    </JqxPopover>
                </div>
                <h1 className={"App-header"}>Draft Simulator</h1>
                <div className={"Buttons-and-boxes"}>
                    <div className={"Player-list-box"}>
                        <div>
                            {!filteredPlayers && <img src={search} style={{height: '3vmin', position: 'absolute'}}
                                                      alt="search"/>}
                            <input type="text" style={{height: '25px', width: '90%'}}
                                   value={this.state.searchText}
                                   onClick={this.filterPlayers}
                                   onChange={this.filterPlayers}>{null}</input>
                        </div>
                        {playerListBox}
                    </div>
                    <div className={"Player-buttons"}>
                        <button onClick={this.clearPlayers} style={{fontSize: 16}}
                                className={"Clear-button"}>Clear</button>
                        <button id='rankingButton' onClick={this.loadRankings}
                                className={"Ranking-button"}>Load Saved Rankings</button>
                        <button id='swapButton' style={{backgroundColor: swapButtonColor}}
                                onClick={this.swapRankings} className={"Swap-button"}>{swapButtonText}</button>
                    </div>
                    <div className={"Player-list-box"}>
                        <UserListBox userRoundList={userPlayers} removePlayer={this.removePlayer}
                                     movePlayer={this.movePlayer} className={"Player-list-box"}/>
                    </div>
                    <div className={"Draft-buttons"}>
                        <button onClick={this.saveRankings} style={{fontSize: 16}}
                                className={"Ranking-button"}>Save Player Rankings</button>
                        <button onClick={() => this.simulateDrafts(false)}
                                style={{fontSize: 16}} className={"Draft-button"}>Draft!</button>
                    </div>
                    <div className={"Player-list-box"}>
                        <tr>
                            <button
                                onClick={() => this.toggleFrequencyData(userFreqs)}
                                style={{borderStyle: (frequencyData === userFreqs) ?
                                        'inset' : 'outset'}}>Your Players</button>
                            <button
                                onClick={() => this.toggleFrequencyData(allFreqs)}
                                style={{borderStyle: (frequencyData === allFreqs) ?
                                        'inset' : 'outset'}}>All Players</button>
                            <button
                                onClick={() => this.toggleFrequencyData(expectedTeam)}
                                style={{borderStyle: (frequencyData === expectedTeam) ?
                                        'inset' : 'outset'}}>Expected Team</button>
                        </tr>
                        {draftResultsTable}
                    </div>
                </div>
                <div className={"Slider-row"}>
                    <div className={"Sliders"}>
                        <p>Number of teams per draft:</p>
                        <div>{teamCount}</div>
                        <input type={"range"} min={6} max={14} step={2} value={teamCount}
                               onChange={(event) => this.handleSliderChange('teamCount', event)}/>
                    </div>
                    <div className={"Sliders"}>
                        <p>Your pick in the draft:</p>
                        <div>{pickOrder}</div>
                        <input type={"range"} min={1} max={teamCount} value={pickOrder}
                                   onChange={(event) => this.handleSliderChange('pickOrder', event)}/>
                        <form>
                          <label>
                            Randomize:
                            <input type="checkbox" checked={isRandom} onChange={this.determineIfRandom}/>
                          </label>
                        </form>
                    </div>
                    <div className={"Sliders"}>
                        <p>Number of rounds per draft:</p>
                        <div>{roundCount}</div>
                        <input type={"range"} min={1} max={16} value={roundCount}
                                   onChange={(event) => this.handleSliderChange('roundCount', event)}/>
                    </div>
                </div>
            </Container>
        )
    }
}