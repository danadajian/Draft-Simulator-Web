import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
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

    filterPlayersByText = (event) => {
        let text = event.target.value.toLowerCase();
        let playerPool = this.state.playerPool;
        let filteredPool = playerPool.filter(
            (player) => player.Name.toLowerCase().includes(text.toLowerCase())
        );
        this.setState({
            searchText: text,
            filteredPool: filteredPool
        });
    };

    filterPlayersByPosition = (position) => {
        let playerPool = this.state.playerPool;
        if (position === 'All') {
            this.setState({
            searchText: '',
            filteredPool: playerPool
        });
        } else {
            let filteredPool = playerPool.filter(
                (player) => player.Position === position
            );
            this.setState({
                searchText: '',
                filteredPool: filteredPool
            });
        }
    };

    filterPlayersByTeam = (team) => {
        let playerPool = this.state.playerPool;
        if (team === 'All') {
            this.setState({
            searchText: '',
            filteredPool: playerPool,
        });
        } else {
            let filteredPool = playerPool.filter(
                (player) => player.Team === team
            );
            this.setState({
                searchText: '',
                filteredPool: filteredPool
            });
        }
    };

    handleTeamChange = (event) => {
        this.filterPlayersByTeam(event.target.value);
    };

    addToLineup = (playerIndex) => {
        let {playerPool, lineup, whiteList, blackList} = this.state;
        let playerToAdd = playerPool[playerIndex];
        if (lineup.includes(playerToAdd)) {
            alert('Player already added to lineup.');
            return
        }
        let spotToReplace;
        let spotsToReplace = lineup.filter(
            (player) =>
                (playerToAdd.Position === player.Position && !player.Name)
                || (['RB', 'WR', 'TE'].includes(playerToAdd.Position) && player.Position === 'FLEX' && !player.Name)
        );
        if (spotsToReplace.length === 0) {
            alert('Not enough positions available to add player.');
        } else {
            whiteList.push(playerToAdd);
            if (blackList.includes(playerToAdd)) {
                blackList.splice(blackList.indexOf(playerToAdd), 1)
            }
            spotToReplace = spotsToReplace[0];
            let lineupIndex = lineup.indexOf(spotToReplace);
            lineup[lineupIndex] = playerToAdd;
            this.setState({
                lineup: lineup,
                whiteList: whiteList,
                blackList: blackList,
                filteredPool: null,
                searchText: ''
            });
        }
    };

    removeFromLineup = (playerIndex) => {
        let {playerPool, lineup, whiteList} = this.state;
        let playerToRemove = lineup[playerIndex];
        if (whiteList.includes(playerToRemove)) {
            whiteList.splice(whiteList.indexOf(playerToRemove), 1)
        }
        lineup[playerIndex] = {
            Position: playerToRemove.Position,
            Team: '',
            Name: '',
            Status: '',
            Projected: '',
            Price: '',
            Opp: '',
            Weather: ''
        };
        this.setState({
            playerPool: playerPool,
            lineup: lineup,
            whiteList: whiteList
        });
    };

    toggleBlackList = (playerIndex) => {
        let {playerPool, lineup, whiteList, blackList} = this.state;
        let blackListedPlayer = playerPool[playerIndex];
        if (lineup.includes(blackListedPlayer)) {
            this.removeFromLineup(lineup.indexOf(blackListedPlayer));
        }
        if (blackList.includes(blackListedPlayer)) {
            blackList.splice(blackList.indexOf(blackListedPlayer), 1)
        } else {
            blackList.push(blackListedPlayer);
        }
        this.setState({
            playerPool: playerPool,
            whiteList: whiteList,
            blackList: blackList,
            filteredPool: null,
            searchText: ''
        });
    };

    sumPoints = (lineup) => {
         return lineup.map((player) => ((player.Projected) ? parseFloat(player.Projected) : 0)).reduce((a,b) => a + b, 0);
    };

    sumSalary = (lineup) => {
        return lineup.map((player) => ((player.Price) ? parseInt(player.Price) : 0)).reduce((a, b) => a + b, 0);
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
                                   onClick={this.filterPlayersByText}
                                   onChange={this.filterPlayersByText}>{null}</input>
                        </div>
                        <div style={{display: 'flex'}}>
                            <button onClick={() => this.filterPlayersByPosition('All')}>All</button>
                            {
                                ['QB', 'RB', 'WR', 'TE', 'D/ST']
                                    .map((position) =>
                                        <button onClick={() => this.filterPlayersByPosition(position)}>{position}</button>
                                    )
                            }
                            <select onChange={(event) => this.handleTeamChange(event)}>
                                <option selected={"selected"} value={'All'}>All</option>
                                {[... new Set(playerPool.map((player) => player.Team))].sort().map((team) =>
                                    <option value={team}>{team}</option>
                                )}
                            </select>
                        </div>
                        <div className={"Player-list-box"}>
                            <DfsPlayerBox playerList={playerPool} filterList={filteredPool}
                                          whiteListFunction={this.addToLineup} blackListFunction={this.toggleBlackList}
                                          whiteList={whiteList} blackList={blackList} salarySum={this.sumSalary(lineup)}
                                          cap={cap}/>
                        </div>
                    </div>
                    <div>
                        <h2 className={"Dfs-header"}>Lineup</h2>
                        <DfsGrid dfsLineup={lineup} removePlayer={this.removeFromLineup} site={site}
                                 whiteList={whiteList} pointSum={this.sumPoints(lineup)}
                                 salarySum={this.sumSalary(lineup)} cap={cap}/>
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
