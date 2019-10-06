import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import { getAddToLineupState } from './getAddToLineupState'
import { getRemoveFromLineupState } from './getRemoveFromLineupState'
import { getToggleBlackListState } from './getToggleBlackListState'
import { getFilterPlayersState } from "./getfilterPlayersState"
import { sumAttribute } from './sumAttribute'
import { DfsGrid } from './DfsGrid.tsx';
import { DfsReport } from './DfsReport.tsx';
import { DfsPlayerBox } from './DfsPlayerListBox.tsx'
import { DfsBlackListBox } from './DfsBlackListBox.tsx'
import football2 from '../../icons/football2.svg';
import football from '../../icons/football.ico';
import search from "../../icons/search.ico";

export class Optimizer extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: false, isOptimizing: false, isReporting: false, sport: '', site: '', slate: '',
                      lineup: [], cap: 0, playerPool: [], filteredPool: null, searchText: '', whiteList: [],
                      blackList: [], reportingData: {}, weeks: []};
    }

    generateLineup = (sport, site, slate) => {
        let {lineup, blackList} = this.state;
        let whiteListNames = lineup.filter((player) => player.Name).map((player) => (player.Name));
        let blackListNames = blackList.filter((player) => player.Name).map((player) => (player.Name));
        this.setState({
            isOptimizing: true,
            isReporting: false,
            sport: sport,
            site: site,
            slate: slate,
            whiteList: lineup.filter((player) => player.Name)
        });
        fetch(window.location.origin + '/optimize/generate/' + sport + '/' + site + '/' + slate, {
            method: 'POST',
            body: whiteListNames.toString() + '|' + blackListNames.toString()
        }).then(response => {
            if (response.status !== 200) {
                alert('Error removing player.');
            } else {
                response.json()
                    .then((lineupJson) => {
                        this.ingestDfsLineup(lineupJson);
                    });
            }
        });
    };

    ingestDfsLineup = (lineupJson) => {
        if (typeof lineupJson === "string") {
            this.setState({isOptimizing: false});
            alert(lineupJson);
            return
        }
        let lineup = (typeof lineupJson === "string") ? [] : lineupJson;
        this.setState({
            isOptimizing: false,
            lineup: lineup
        });
    };

    clearLineup = (sport, site, slate) => {
        if (!sport) {
            alert('Please select a sport.');
        } else if (!site || !slate) {
            this.setState({sport: sport, site: site, slate: slate});
        } else {
            this.setState({
                isLoading: true,
                isReporting: false,
                sport: sport,
                site: site,
                slate: slate
            });
            fetch(window.location.origin + '/optimize/clear/' + sport + '/' + site + '/' + slate)
                .then(response => {
                    if (response.status !== 200) {
                        alert('An error occurred.');
                    } else {
                        response.json()
                            .then((data) => {
                                this.setState({
                                    isLoading: false,
                                    playerPool: data.playerPool,
                                    lineup: data.lineup,
                                    cap: data.cap,
                                    whiteList: [],
                                    blackList: []
                                });
                            });
                    }
                });
        }
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

    filterPlayers = (attribute, value) => {
        let newState = getFilterPlayersState(attribute, value, this.state);
        this.setState(newState);
    };

    addToLineup = (playerIndex) => {
        let newState = getAddToLineupState(playerIndex, this.state);
        if (typeof newState === 'string') {
            alert(newState);
        } else {
            this.setState(newState);
        }
    };

    removeFromLineup = (playerIndex) => {
        let newState = getRemoveFromLineupState(playerIndex, this.state);
        this.setState(newState);
    };

    toggleBlackList = (playerIndex) => {
        let newState = getToggleBlackListState(playerIndex, this.state);
        this.setState(newState);
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
        const {isLoading, isOptimizing, isReporting, sport, site, slate, lineup, cap, playerPool, filteredPool,
            searchText, whiteList, blackList, reportingData, weeks} = this.state;

        let gridSection;
        let weekArray = [];
        for (let i = 1; i <= reportingData.maxWeek; i++) {
            weekArray.push(i);
        }

        if (isLoading) {
            gridSection =
                <div className={"Loading"}>
                    <div><p className={"Loading-text"}>Loading . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                </div>;
        } else if (isOptimizing) {
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
                        <h2 className={"Dfs-header"}>Blacklist</h2>
                        <DfsBlackListBox blackList={blackList}/>
                    </div>
                    <div>
                        <h2 className={"Dfs-header"}>Players</h2>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {!filteredPool &&
                                <img src={search} style={{height: '3vmin', position: 'absolute'}}
                                     alt="search"/>}
                            <input type="text" style={{height: '25px', width: '90%'}}
                                   value={searchText}
                                   onChange={(event) =>
                                       this.filterPlayers('Name', event.target.value)}>{null}</input>
                        </div>
                        <div style={{display: 'flex'}}>
                            <button onClick={() => this.filterPlayers('Position', 'All')}>All</button>
                            {
                                [... new Set(playerPool.map((player) => player.Position))]
                                    .map((position) =>
                                        <button onClick={() => this.filterPlayers('Position', position)}>{position}</button>
                                    )
                            }
                            <select onChange={(event) => this.filterPlayers('Team', event.target.value)}>
                                <option selected={"selected"} value={'All'}>All</option>
                                {[... new Set(playerPool.map((player) => player.Team))].sort().map((team) =>
                                    <option value={team}>{team}</option>
                                )}
                            </select>
                        </div>
                        <div className={"Player-list-box"}>
                            <DfsPlayerBox playerList={playerPool} filterList={filteredPool}
                                          whiteListFunction={this.addToLineup} blackListFunction={this.toggleBlackList}
                                          whiteList={whiteList} blackList={blackList} salarySum={sumAttribute(lineup, 'Price')}
                                          cap={cap}/>
                        </div>
                    </div>
                    <div>
                        <h2 className={"Dfs-header"}>Lineup</h2>
                        <DfsGrid dfsLineup={lineup} removePlayer={this.removeFromLineup} site={site}
                                 whiteList={whiteList} pointSum={sumAttribute(lineup, 'Projected')}
                                 salarySum={sumAttribute(lineup, 'Price')} cap={cap}/>
                    </div>
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
                    {sport === 'nfl' && <h3>Choose a game slate:</h3>}
                    {sport === 'nfl' &&
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
                    <div style={{display: 'flex', margin: '2%'}}>
                        {sport && slate && site && <button style={{marginTop: '10px'}}
                                      onClick={() => this.generateLineup(sport, site, slate)}>Optimize Lineup</button>}
                        {sport && slate && site && <button style={{marginTop: '10px'}}
                                          onClick={() => this.clearLineup(sport, site, slate)}>Clear Lineup</button>}
                        {(sport === 'nfl' && slate && site) && <button style={{marginTop: '10px'}}
                                          onClick={() =>
                                              this.fetchReportingData(sport, slate, site, weekArray)}>Generate Report</button>}
                    </div>
                </div>
                {sport && slate && site && gridSection}
            </Container>
        )
    }
}
