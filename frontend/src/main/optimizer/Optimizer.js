import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import { DfsGrid } from './DfsGrid.tsx';
import { DfsReport } from './DfsReport.tsx';
import { DfsPlayerBox } from './DfsPlayerListBox.tsx'
import football2 from '../../icons/football2.svg';
import search from "../../icons/search.ico";

export class Optimizer extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: false, isReporting: false, sport: '', site: '', slate: '', lineup: [], playerPool: [],
                      filteredPool: [], searchText: '', blackList: [], reportingData: {}, weeks: []};
    }

    generateLineup = (sport, site, slate) => {
        let prevSport = this.state.sport;
        this.setState({
            isLoading: true,
            isReporting: false,
            sport: sport,
            site: site,
            slate: slate});
        fetch(window.location.origin + '/optimize/generate/' + sport + '/' + site + '/' + slate)
            .then(response => {
                if (response.status !== 200) {
                    alert('Failed to generate lineups.');
                } else {
                    response.json()
                        .then((lineupJson) => {
                            this.ingestDfsLineup(lineupJson, sport, prevSport);
                        });
                }
            });
    };

    ingestDfsLineup = (lineupJson, sport, prevSport) => {
        if (typeof lineupJson[0] === "string") {
            this.setState({isLoading: false, sport: prevSport});
            alert(lineupJson[0]);
            return
        }
        let lineup = (typeof lineupJson[0] === "string") ? [] : lineupJson;
        this.setState({
            isLoading: false,
            lineup: lineup});
    };

    clearLineup = (sport, site, slate) => {
        if (!sport) {
            alert('Please select a sport.');
        } else if (!site || !slate) {
            this.setState({sport: sport, site: site, slate: slate});
        } else {
            this.setState({
                isReporting: false,
                sport: sport,
                site: site,
                slate: slate});
            fetch(window.location.origin + '/optimize/clear/' + sport + '/' + site + '/' + slate)
                .then(response => {
                    if (response.status !== 200) {
                        alert('An error occurred.');
                    } else {
                        response.json()
                            .then((data) => {
                                this.setState({
                                    playerPool: data.playerPool,
                                    lineup: data.lineup});
                            });
                    }
                });
        }
    };

    filterPlayers = (event) => {
        let text = event.target.value.toLowerCase();
        let players = this.state.players;
        let filteredPool = players.filter(
            (player) =>
                player.Name.toLowerCase().includes(text)
                || player.Position.toLowerCase().includes(text)
                || player.Team.toLowerCase().includes(text)
        );
        this.setState({
            searchText: text,
            filteredPool: filteredPool});
    };

    addToLineup = (playerIndex) => {
        let {playerPool, lineup} = this.state;
        let playerToAdd = playerPool[playerIndex];
        let spotToReplace;
        let spotsToReplace = lineup.filter(
            (player) =>
                (playerToAdd.Position === player.Position && !player.Name)
                || (['RB', 'WR', 'TE'].includes(playerToAdd.Position) && player.Position === 'FLEX' && !player.Name)
        );
        if (spotsToReplace.length > 0) {
            spotToReplace = spotsToReplace[0];
            let lineupIndex = lineup.indexOf(spotToReplace);
            lineup[lineupIndex] = playerToAdd;
            playerPool.splice(playerIndex, 1);
            this.setState({
                playerPool: playerPool,
                lineup: lineup});
        } else {
            alert('Not enough room in lineup to add player.');
        }
    };

    addToBlackList = (lineupIndex) => {
        let {sport, site, slate, lineup} = this.state;
        let removedPlayer = lineup[lineupIndex].Name;
        this.setState({isLoading: true});
        fetch(window.location.origin + '/optimize/blacklist/' + sport + '/' + site + '/' + slate, {
            method: 'POST',
            body: removedPlayer
        }).then(response => {
            if (response.status !== 200) {
                alert('Error removing player.');
            } else {
                response.json()
                    .then((lineupJson) => {
                        this.ingestDfsLineup(lineupJson, sport, sport, site, slate);
                        let alertString = (site === 'fd') ?
                            ' from your Fanduel lineup.' : ' from your Draftkings lineup.';
                        alert('You have removed ' + removedPlayer + alertString);
                    });
            }
        });
    };

    addToWhiteList = (playerArray) => {
        let {sport, site, slate} = this.state;
        fetch(window.location.origin + '/optimize/whitelist/' + sport + '/' + site + '/' + slate, {
            method: 'POST',
            body: playerArray
        }).then(response => {
            if (response.status !== 200) {
                alert('Error removing player.');
            } else {
                response.json()
                    .then((lineupJson) => {
                        this.ingestDfsLineup(lineupJson, sport, sport, site, slate);
                    });
            }
        });
    };

    fetchReportingData = (sport, slate, site, weeks) => {
        sport = 'nfl';
        if (!sport) {
            alert('Please select a sport.');
        } else {
            fetch(window.location.origin + '/optimize/reporting/' + sport + '/' + site + '/' + slate, {
                method: 'POST',
                body: weeks
            }).then(response => {
                    if (response.status !== 200) {
                        alert('Failed to generate report.');
                    } else {
                        response.json()
                            .then((reportJson) => {
                                this.setState({
                                    isReporting: true,
                                    weeks: weeks,
                                    reportingData: reportJson});
                            });
                    }
                });
        }
    };

    toggleWeek = (selectedWeek) => {
        let {sport, slate, site, weeks} = this.state;
        if (weeks.includes(selectedWeek)) {
            weeks.splice(weeks.indexOf(selectedWeek), 1);
        } else {
            weeks.push(selectedWeek);
        }
        this.fetchReportingData(sport, slate, site, weeks);
        return weeks
    };

    render() {
        const {isLoading, isReporting, sport, site, slate, lineup, playerPool, filteredPool, searchText, blackList,
            reportingData, weeks} = this.state;

        let gridSection;
        let weekArray = [];
        for (let i = 1; i <= reportingData.maxWeek; i++) {
            weekArray.push(i);
        }

        const pointSum = lineup.map((player) => ((player.Projected) ?
            parseFloat(player.Projected) : 0)).reduce((a,b) => a + b, 0);

        const salarySum = lineup.map((player) => ((player.Price) ?
            parseInt(player.Price) : 0)).reduce((a,b) => a + b, 0);

        if (isLoading) {
            gridSection =
                <div className={"Loading"}>
                    <div><p className={"Optimizing-text"}>Optimizing . . .</p></div>
                    <div><img src={football2} className={"App-logo2"} alt="football2"/></div>
                </div>;
        } else if (isReporting) {
            gridSection =
                <div className={"Dfs-grid-section"}>
                    <div>
                        <DfsReport reportingData={reportingData.data}/>
                    </div>
                    <div>
                        <div className={'Dfs-sport'}>
                            <h3>Week</h3>
                            <div className={"Dfs-grid-section"}>
                            {weekArray.map(
                                (weekNumber) => (
                                    <button style={{backgroundColor: (weeks.includes(weekNumber)) ? 'dodgerblue' : 'white'}}
                                            onClick={() => this.toggleWeek(weekNumber)}>{weekNumber}</button>
                                )
                            )}
                            </div>
                        </div>
                    </div>
                </div>
        } else {
            gridSection =
                <div className={"Dfs-grid-section"}>
                    <div className={"Player-list-box"}>
                        <div>
                            {filteredPool.length === 0 &&
                                <img src={search} style={{height: '3vmin', position: 'absolute'}}
                                     alt="search"/>}
                            <input type="text" style={{height: '25px', width: '90%'}}
                                   value={searchText}
                                   onClick={this.filterPlayers}
                                   onChange={this.filterPlayers}>{null}</input>
                        </div>
                        <DfsPlayerBox playerList={playerPool} filterList={filteredPool}
                                      playerFunction={this.addToLineup} isPlayerPool={true}/>
                    </div>
                    <div>
                        <h2 className={"Dfs-header"}>{(site === 'fd') ? 'Fanduel' : 'Draftkings'}</h2>
                        <DfsGrid dfsLineup={lineup} removePlayer={this.addToBlackList} site={site}
                                 pointSum={pointSum} salarySum={salarySum}/>
                    </div>
                    {/*<DfsPlayerBox playerList={blackList} playerFunction={} isPlayerPool={false}/>*/}
                </div>;
        }

        return (
            <Container fluid={true}>
                <Navbar bg="primary" variant="dark">
                    <Nav className="Nav-bar">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/simulate">Back to Draft Simulator</Nav.Link>
                        <Nav.Link href="/logout">Log Out</Nav.Link>
                    </Nav>
                </Navbar>
                <h1 className={"App-header"}>DFS Optimizer</h1>
                <div className={"Dfs-sport"}>
                    <h3>Choose a sport:</h3>
                    <div style={{display: 'flex'}}>
                        <button style={{backgroundColor: (sport === 'mlb') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.clearLineup('mlb', site, 'main')}>MLB</button>
                        <button style={{backgroundColor: (sport === 'nfl') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.clearLineup('nfl', site, slate)}>NFL</button>
                        <button style={{backgroundColor: (sport === 'nba') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.clearLineup('nba', site, 'main')}>NBA</button>
                    </div>
                    {sport && <h3>Choose a game slate:</h3>}
                    {sport &&
                        <div style={{display: 'flex'}}>
                            <button style={{backgroundColor: (slate === 'thurs') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.clearLineup(sport, site, 'thurs')}>Thurs only</button>
                            <button style={{backgroundColor: (slate === 'thurs-mon') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.clearLineup(sport, site, 'thurs-mon')}>Thurs - Mon</button>
                            <button style={{backgroundColor: (slate === 'main') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.clearLineup(sport, site, 'main')}>Sun (Main)</button>
                            <button style={{backgroundColor: (slate === 'sun-mon') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.clearLineup(sport, site, 'sun-mon')}>Sun - Mon</button>
                        </div>}
                    {sport && <h3>Choose a site:</h3>}
                    {sport &&
                        <div style={{display: 'flex'}}>
                        <button style={{backgroundColor: (site === 'fd') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.clearLineup(sport, 'fd', slate)}>Fanduel</button>
                        <button style={{backgroundColor: (site === 'dk') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.clearLineup(sport, 'dk', slate)}>Draftkings</button>
                        </div>}
                    {sport && slate && site && <button style={{marginTop: '10px'}}
                                      onClick={() => this.generateLineup(sport, site, slate)}>Optimize Lineup</button>}
                    {sport && slate && site && <button style={{marginTop: '10px'}}
                                      onClick={() => this.clearLineup(sport, site, slate)}>Clear Lineup</button>}
                    {(sport === 'nfl' && slate && site) && <button style={{marginTop: '10px'}}
                                      onClick={() =>
                                          this.fetchReportingData(sport, slate, site, weekArray)}>Generate Report</button>}
                </div>
                {sport && slate && site && gridSection}
            </Container>
        )
    }
}
