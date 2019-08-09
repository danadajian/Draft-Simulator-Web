import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import { DfsGrid } from './DfsGrid.tsx';
import football from './icons/football.ico';

export class Optimizer extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, sport: '', fdLineup: [], dkLineup: []};

        this.removePlayerFromDfsLineup = this.removePlayerFromDfsLineup.bind(this);
    }

    componentDidMount() {
        this.fetchPlayersForOptimizer();
    }

    fetchPlayersForOptimizer = () => {
        fetch(window.location.origin + '/dfs-optimizer/projections', {
            method: 'POST'
        }).then((response) => {
                    if (response.status !== 200) {
                        alert('Projections data failed to load.');
                    }
                    this.setState({isLoading: false});
                });
    };

    dfsSportChange = (event) => {
        let sport = event.target.value;
        if (sport !== 'none') {
            this.fetchOptimalLineups(sport);
        }
    };

    fetchOptimalLineups = (sport) => {
        if (!sport) {
            alert('Please select a sport.');
        } else {
            fetch(window.location.origin + '/optimized-lineup/' + sport)
                .then(response => {
                    if (response.status !== 200) {
                        alert('Failed to generate lineups.');
                    } else {
                        response.json()
                            .then((lineupData) => {
                                this.ingestDfsLineup(lineupData, sport, false);
                            });
                    }
                });
        }
    };

    ingestDfsLineup = (lineupJson, sport, remove) => {
        if (!remove) {
            if (lineupJson.length === 1) {
                alert(lineupJson[0]);
                return
            }
            if (typeof lineupJson[0] === "string") {
                alert(lineupJson[0]);
            } else if (lineupJson.length === 2 && lineupJson[1] === "string") {
                alert(lineupJson[1]);
            }
        }
        let fdLineup = (typeof lineupJson[0] === "string") ? this.state.fdLineup : lineupJson[0];
        let dkLineup = (typeof lineupJson[1] === "string") ? this.state.dkLineup : lineupJson[1];
        this.setState({sport: sport, fdLineup: fdLineup, dkLineup: dkLineup});
    };

    removePlayerFromDfsLineup = (lineupIndex, site) => {
        let sport = this.state.sport;
        let removedPlayer = (site === 'fd') ? this.state.fdLineup[lineupIndex].Name : this.state.dkLineup[lineupIndex].Name;
        fetch(window.location.origin + '/optimized-lineup/' + sport, {
            method: 'POST',
            body: removedPlayer + '|' + site
        }).then(response => {
            if (response.status !== 200) {
                alert('Error removing player.');
            } else {
                response.json()
                    .then((lineupJson) => {
                        this.ingestDfsLineup(lineupJson, sport, true);
                        let alertString = (site === 'fd') ?
                            ' from your Fanduel lineup.' : ' from your Draftkings lineup.';
                        alert('You have removed ' + removedPlayer + alertString);
                    });
            }
        });
    };

    render() {
        const {isLoading, sport, fdLineup, dkLineup} = this.state;

        if (isLoading) {
            return (
                <div className={"Loading"}>
                    <div><p className={"Loading-text"}>Loading . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                </div>
            );
        } else {
            return (
                <Container fluid={true}>
                    <Navbar bg="primary" variant="dark">
                        <Nav className="Nav-bar">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="/espn">Back to Draft Simulator</Nav.Link>
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </Nav>
                    </Navbar>
                    <h1 className={"App-header"}>DFS Optimizer</h1>
                    <div className={"Dfs-sport"}>
                        <h3>Choose a sport:</h3>
                        <select ref={"dropDown"} className={"Drop-down"} onChange={this.dfsSportChange} value={sport}>
                            <option value="none"> </option>
                            <option value="mlb">MLB</option>
                            <option value="nfl">NFL</option>
                            <option value="nba">NBA</option>
                        </select>
                        <button style={{marginTop: '10px'}}
                                onClick={() => this.fetchOptimalLineups(sport)}>Reset
                        </button>
                    </div>
                    <div className={"Dfs-grid-section"}>
                        <div>
                            <h2 className={"Dfs-header"}>Fanduel</h2>
                            <DfsGrid dfsLineup={fdLineup} removePlayer={this.removePlayerFromDfsLineup} site={'fd'}/>
                        </div>
                        <div>
                            <h2 className={"Dfs-header"}>Draftkings</h2>
                            <DfsGrid dfsLineup={dkLineup} removePlayer={this.removePlayerFromDfsLineup} site={'dk'}/>
                        </div>
                    </div>
                </Container>
            )
        }
    }
}
