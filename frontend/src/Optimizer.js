import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import { DfsGrid } from './DfsGrid.tsx';
import football2 from './icons/football2.svg';

export class Optimizer extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: false, sport: '', slate: 'main', fdLineup: [], dkLineup: []};
    }

    dfsSportChange = (event) => {
        let newSport = event.target.value;
        if (newSport !== 'none') {
            this.fetchOptimalLineups(newSport, this.state.slate);
        }
    };

    slateChange = (event) => {
        let newSlate = event.target.value;
        this.fetchOptimalLineups(this.state.sport, newSlate);
    };

    fetchOptimalLineups = (sport, slate) => {
        if (!sport) {
            alert('Please select a sport.');
        } else {
            let prevSport = this.state.sport;
            this.setState({isLoading: true, sport: sport, slate: slate});
            fetch(window.location.origin + '/optimized-lineup/' + sport + '/' + slate)
                .then(response => {
                    if (response.status !== 200) {
                        alert('Failed to generate lineups.');
                    } else {
                        response.json()
                            .then((lineupJson) => {
                                this.ingestDfsLineup(lineupJson, sport, prevSport, false);
                            });
                    }
                });
        }
    };

    ingestDfsLineup = (lineupJson, sport, prevSport, remove) => {
        if (!remove) {
            if (lineupJson.length === 1) {
                this.setState({isLoading: false, sport: prevSport});
                alert(lineupJson[0]);
                return
            }
            if (typeof lineupJson[0] === "string") {
                alert(lineupJson[0]);
            } else if (lineupJson.length === 2 && lineupJson[1] === "string") {
                alert(lineupJson[1]);
            }
        }
        let fdLineup = (typeof lineupJson[0] === "string") ? [] : lineupJson[0];
        let dkLineup = (typeof lineupJson[1] === "string") ? [] : lineupJson[1];
        this.setState({isLoading: false, fdLineup: fdLineup, dkLineup: dkLineup});
    };

    removePlayerFromDfsLineup = (lineupIndex, site) => {
        let {sport, slate} = this.state;
        let removedPlayer = (site === 'fd') ? this.state.fdLineup[lineupIndex].Name : this.state.dkLineup[lineupIndex].Name;
        fetch(window.location.origin + '/optimized-lineup/' + sport + '/' + slate, {
            method: 'POST',
            body: removedPlayer + '|' + site
        }).then(response => {
            if (response.status !== 200) {
                alert('Error removing player.');
            } else {
                response.json()
                    .then((lineupJson) => {
                        this.ingestDfsLineup(lineupJson, sport, sport, true);
                        let alertString = (site === 'fd') ?
                            ' from your Fanduel lineup.' : ' from your Draftkings lineup.';
                        alert('You have removed ' + removedPlayer + alertString);
                    });
            }
        });
    };

    render() {
        const {isLoading, sport, slate, fdLineup, dkLineup} = this.state;
        let gridSection;

        if (isLoading) {
            gridSection =
                <div className={"Loading"}>
                    <div><p className={"Optimizing-text"}>Optimizing . . .</p></div>
                    <div><img src={football2} className={"App-logo2"} alt="football2"/></div>
                </div>;
        } else {
            gridSection =
                <div className={"Dfs-grid-section"}>
                    <div>
                        <h2 className={"Dfs-header"}>Fanduel</h2>
                        <DfsGrid dfsLineup={fdLineup} removePlayer={this.removePlayerFromDfsLineup} site={'fd'}/>
                    </div>
                    <div>
                        <h2 className={"Dfs-header"}>Draftkings</h2>
                        <DfsGrid dfsLineup={dkLineup} removePlayer={this.removePlayerFromDfsLineup} site={'dk'}/>
                    </div>
                </div>;
        }

        return (
            <Container fluid={true}>
                <Navbar bg="primary" variant="dark">
                    <Nav className="Nav-bar">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/simulate">Back to Draft Simulator</Nav.Link>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <h1 className={"App-header"}>DFS Optimizer</h1>
                <div className={"Dfs-sport"}>
                    <h3>Choose a sport:</h3>
                    <select className={"Drop-down"} onChange={this.dfsSportChange} value={sport}>
                        <option value="none"> </option>
                        <option value="mlb">MLB</option>
                        <option value="nfl">NFL</option>
                        <option value="nba">NBA</option>
                    </select>
                    {(sport === 'nfl') && <h3>Choose a game slate:</h3>}
                    {(sport === 'nfl') && <select className={"Drop-down"} onChange={this.slateChange} value={slate}>
                                            <option value="thurs">Thurs only</option>
                                            <option value="thurs-mon">Thurs - Mon</option>
                                            <option value="main">Sun (Main)</option>
                                            <option value="sun-mon">Sun - Mon</option>
                                          </select>}
                    <button style={{marginTop: '10px'}}
                            onClick={() => this.fetchOptimalLineups(sport, slate)}>Reset</button>
                </div>
                {gridSection}
            </Container>
        )
    }
}
