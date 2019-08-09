import React, {Component} from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import './App.css';
import JqxPopover from './jqxwidgets/react_jqxpopover'
import JqxSlider from './jqxwidgets/react_jqxslider'
import { PlayerListBox, UserListBox } from "./PlayerListBox.tsx"
import { DraftResultsTable } from "./DraftResultsTable.tsx";
import football from './icons/football.ico'
import search from './icons/search.ico'

export class Simulator extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], searchText: '', filteredPlayers: null,
            userPlayers: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            teamCount: 10, pickOrder: 5, roundCount: 16, isDrafting: false, isRandom: false,
            allFreqs: [], userFreqs: [], expectedTeam: [], frequencyData: []};
    }

    componentDidMount() {
        this.fetchPlayersForSimulator(window.location.pathname);
    }

    fetchPlayersForSimulator = (site) => {
        fetch(window.location.origin + site + '-players')
            .then(response => {
                if (response.status !== 200) {
                    alert('Could not load players.');
                } else {
                    response.json()
                        .then((players) => {
                            this.setState({
                                isLoading: false,
                                players: players,
                            });
                            this.bindSlidersToChangeEvent();
                        })
                }
            });
    };

    bindSlidersToChangeEvent = () => {
        this.refs.teamCountSlider.on('change', (event) => {
            let newTeamCount = event.args.value;
            this.refs.pickOrderSlider.setOptions({max: newTeamCount});
        });
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
        if (window.location.pathname.startsWith('/yahoo')) {
            window.location.href = window.location.href.replace('yahoo', 'espn');
        } else if (window.location.pathname.startsWith('/espn')) {
            window.location.href = window.location.href.replace('espn', 'yahoo');
        }
    };

    saveRankings = () => {
        let userPlayers = this.state.userPlayers;
        if (userPlayers.every((roundList) => roundList.length === 0)) {
            alert('Please rank at least one player before saving.');
        } else {
            fetch(window.location.origin + '/save-ranking', {
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
        let players = this.state.players;
        fetch(window.location.origin + '/load-ranking')
            .then(response => {
                if (response.status !== 200) {
                    alert('Could not load user ranking data.');
                }  else {
                    response.json()
                        .then((userRanking) => {
                            if (userRanking === 'No ranking specified.') {
                                alert('No ranking specified.');
                            } else {
                                this.clearPlayers();
                                let allUserPlayers = userRanking.flat();
                                for (let i = 0; i < allUserPlayers.length; i++) {
                                    let userPlayerRank = allUserPlayers[i].Rank;
                                    let playerIndex = players.findIndex((player) => player.Rank === userPlayerRank);
                                    players.splice(playerIndex, 1);
                                }
                                this.setState({players: players, userPlayers: userRanking})
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
        let players = this.state.players;
        let userPlayers = this.state.userPlayers;
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
        let players = this.state.players;
        let userPlayers = this.state.userPlayers;
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
        let players = this.state.players;
        let userPlayers = this.state.userPlayers;
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
        let userPlayers = this.state.userPlayers;
        if (userPlayers.every((roundList) => roundList.length === 0)) {
            alert('Please select at least one player to draft.');
        } else {
            let playerNames = userPlayers.map((roundList) => roundList.map((player) => player.Name));
            let teamCount = this.refs.teamCountSlider.getValue();
            let roundCount = this.refs.roundCountSlider.getValue();
            let userPick = this.refs.pickOrderSlider.getValue();
            let pickOrder = (this.state.isRandom) ? 0: userPick;
            this.setState({
                isDrafting: true,
                teamCount: teamCount,
                pickOrder: userPick,
                roundCount: roundCount
            });
            fetch(window.location.origin + '/draft-results', {
                method: 'POST',
                body: JSON.stringify(playerNames) + '|' + teamCount + '|' + pickOrder + '|' + roundCount + '|' + window.location.pathname
            }).then(response => {
                if (response.status !== 200) {
                    alert('Error loading draft results.');
                } else {
                    response.json()
                        .then((draftResults) => {
                            this.generateDraftOutput(draftResults);
                        })
                }
            });
        }
    };

    generateDraftOutput = (draftResults) => {
        if (draftResults === 'Draft error!') {
            alert('No players were drafted. :( \nSomething went wrong . . .');
        }
        this.setState({
            isDrafting: false,
            userFreqs: draftResults.UserFrequencies,
            allFreqs: draftResults.AllFrequencies,
            expectedTeam: draftResults.ExpectedTeam,
            frequencyData: draftResults.UserFrequencies
        });

        this.bindSlidersToChangeEvent();
    };

    toggleFrequencyData = (frequencyData) => {
        this.setState({frequencyData: frequencyData});
    };

    render() {
        const {isLoading, players, filteredPlayers, userPlayers, teamCount, pickOrder, roundCount, isDrafting, isRandom,
            userFreqs, allFreqs, expectedTeam, frequencyData} = this.state;

        if (isLoading) {
            return (
                <div className={"Loading"}>
                    <div><p className={"Loading-text"}>Loading . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                </div>
            );
        } else if (isDrafting) {
            return (
                <div className={"Loading"}>
                    <div><p className={"Loading-text"}>Drafting . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                    <div>
                        <button onClick={() => this.simulateDrafts(true)} className={"Cancel-draft-button"}>Cancel
                        </button>
                    </div>
                </div>
            );
        } else {
            const swapButtonText = window.location.pathname.startsWith('/espn') ? 'Switch to Yahoo' : 'Switch to ESPN';
            const swapButtonColor = window.location.pathname.startsWith('/espn') ? '#6C00B3' : '#CE0000';

            return (
                <Container fluid={true}>
                    <Navbar bg="primary" variant="dark">
                        <Nav className="Nav-bar">
                          <Nav.Link href="/">Home</Nav.Link>
                          <Nav.Link href="#about">About</Nav.Link>
                          <Nav.Link href="#instructions">Instructions</Nav.Link>
                          <Nav.Link href="/dfs-optimizer">DFS Optimizer</Nav.Link>
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </Nav>
                    </Navbar>
                    <div className={"Info-buttons"}>
                        <JqxPopover ref='about' isModal={true} width={310}
                            position={'bottom'} title={'About Draft Simulator'} selector={'a[href$="#about"]'}>
                            <p>Draft Simulator is a fantasy football draft preparation tool.</p>
                            <p>More often than not, others in your league will only draft among the "top available players"
                                in each round, which are determined by ESPN's preseason rankings.</p>
                            <p>However, Draft Simulator allows you to create and refine your own personal rankings that you
                                can bring to your draft to get the team you've always dreamed of.</p>
                            <button onClick={this.closeAbout}
                            style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                                Got it!</button>
                        </JqxPopover>
                        <JqxPopover ref='instructions' isModal={true} width={310}
                            position={'bottom'} title={'Instructions'} selector={'a[href$="#instructions"]'}>
                            <ol>
                                <li>Search for and select players from the player list. These should be players you'd feel
                                    strongly about drafting.</li>
                                <li>Click "Add" to move them to your preferred list.</li>
                                <li>Drag and drop your players in order of overall preference.</li>
                                <li>Adjust the sliders to your desired specifications, then click "Draft".</li>
                                <li>See how often you were able to draft each player under the "Draft Frequency" tab.</li>
                                <li>The "All Players" tab shows the draft frequency of all players taken, not just your
                                    preferred players.</li>
                                <li>The "Expected Team" tab shows your most likely fantasy team given the simulations.</li>
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
                                {!filteredPlayers && <img src={search} style={{height: '3vmin', position: 'absolute'}} alt="search"/>}
                                <input type="text" style={{height: '25px', width: '90%'}}
                                       value={this.state.searchText}
                                       onClick={this.filterPlayers}
                                       onChange={this.filterPlayers}>{null}</input>
                            </div>
                            <PlayerListBox playerList={players} filterList={filteredPlayers} addPlayer={this.addPlayer}/>
                        </div>
                        <div className={"Player-buttons"}>
                            <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                            <button id='rankingButton' onClick={this.loadRankings} className={"Ranking-button"}>Load Saved Rankings</button>
                            <button id='swapButton' style={{backgroundColor: swapButtonColor}} onClick={this.swapRankings} className={"Swap-button"}>{swapButtonText}</button>
                        </div>
                        <div className={"Player-list-box"}>
                            <UserListBox userRoundList={userPlayers} removePlayer={this.removePlayer} movePlayer={this.movePlayer} className={"Player-list-box"}/>
                        </div>
                        <div className={"Draft-buttons"}>
                            <button onClick={this.saveRankings} style={{fontSize: 16}} className={"Ranking-button"}>Save Player Rankings</button>
                            <button onClick={() => this.simulateDrafts(false)} style={{fontSize: 16}} className={"Draft-button"}>Draft!</button>
                        </div>
                        <div className={"Player-list-box"}>
                            <tr>
                                <button
                                    onClick={() => this.toggleFrequencyData(userFreqs)}
                                    style={{borderStyle: (frequencyData === userFreqs) ? 'inset' : 'outset'}}>Your Players</button>
                                <button
                                    onClick={() => this.toggleFrequencyData(allFreqs)}
                                    style={{borderStyle: (frequencyData === allFreqs) ? 'inset' : 'outset'}}>All Players</button>
                                <button
                                    onClick={() => this.toggleFrequencyData(expectedTeam)}
                                    style={{borderStyle: (frequencyData === expectedTeam) ? 'inset' : 'outset'}}>Expected Team</button>
                            </tr>
                            <DraftResultsTable frequencyData={frequencyData}/>
                        </div>
                    </div>
                    <div className={"Slider-row"}>
                        <div className={"Sliders"}>
                        <p>Number of teams per draft:</p>
                        <JqxSlider ref='teamCountSlider'
                        height={55} width={350}
                        value={teamCount} min={6} max={14} showTickLabels={true} step={2}
                        ticksFrequency={2} tooltip={true} mode={'fixed'}/>
                        </div>
                        <div className={"Sliders"}>
                        <p>Your pick in the draft:</p>
                        <JqxSlider ref='pickOrderSlider'
                            height={55} width={350}
                            value={pickOrder} min={1} max={teamCount} showTickLabels={true}
                            ticksFrequency={1} tooltip={true} mode={'fixed'}/>
                        <form>
                          <label>
                            Randomize:
                            <input type="checkbox" checked={isRandom} onChange={this.determineIfRandom}/>
                          </label>
                        </form>
                        </div>
                        <div className={"Sliders"}>
                        <p>Number of rounds per draft:</p>
                        <JqxSlider ref='roundCountSlider'
                        height={55} width={350}
                        value={roundCount} min={1} max={16} showTickLabels={true}
                        ticksFrequency={15} showMinorTicks={true}
                        minorTicksFrequency={1} tooltip={true} mode={'fixed'}/>
                        </div>
                    </div>
                </Container>
            )
        }
    }
}