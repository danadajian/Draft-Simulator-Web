import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import { DfsGrid } from './DfsGrid.tsx';
import { DfsReport } from './DfsReport.tsx';
import football2 from '../icons/football2.svg';

export class Optimizer extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: false, isReporting: false, sport: '', slate: '', fdLineup: [], dkLineup: [],
        reportingData: {}, weeks: [], site: ''};
    }

    fetchOptimalLineups = (sport, slate) => {
        if (!sport) {
            alert('Please select a sport.');
        } else if (!slate) {
            this.setState({sport: sport});
        } else {
            let prevSport = this.state.sport;
            this.setState({isLoading: true, isReporting: false, sport: sport, slate: slate});
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
        return {'fdLineup': fdLineup, 'dkLineup': dkLineup}
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

    fetchReportingData = (sport, slate, site, weeks) => {
        sport = 'nfl';
        if (!sport) {
            alert('Please select a sport.');
        } else {
            fetch(window.location.origin + '/optimize/reporting/' + sport + '/' + slate, {
                method: 'POST',
                body: site + '|' + weeks
            }).then(response => {
                    if (response.status !== 200) {
                        alert('Failed to generate report.');
                    } else {
                        response.json()
                            .then((reportJson) => {
                                this.setState({
                                    isReporting: true,
                                    sport: sport,
                                    slate: slate,
                                    site: site,
                                    weeks: weeks,
                                    reportingData: reportJson});
                            });
                    }
                });
        }
    };

    toggleSite = (selectedSite) => {
        let {sport, slate, site, weeks} = this.state;
        site = (selectedSite) ? ((site === selectedSite) ? '' : selectedSite) : '';
        this.fetchReportingData(sport, slate, site, weeks);
        return site
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
        const {isLoading, isReporting, sport, slate, fdLineup, dkLineup, reportingData, site, weeks} = this.state;

        let gridSection;
        let weekArray = [];
        for (let i = 1; i <= reportingData.maxWeek; i++) {
            weekArray.push(i);
        }

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
                            <h3>Site</h3>
                            <div className={"Dfs-grid-section"}>
                                <button style={{backgroundColor: (site === 'fd') ? 'dodgerblue' : 'white'}}
                                        onClick={() => this.toggleSite('fd')}>Fanduel</button>
                                <button style={{backgroundColor: (site === 'dk') ? 'dodgerblue' : 'white'}}
                                        onClick={() => this.toggleSite('dk')}>Draftkings</button>
                            </div>
                        </div>
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
                    <div style={{display: 'flex'}}>
                        <button style={{backgroundColor: (sport === 'mlb') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.fetchOptimalLineups('mlb', 'main')}>MLB</button>
                        <button style={{backgroundColor: (sport === 'nfl') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.fetchOptimalLineups('nfl', slate)}>NFL</button>
                        <button style={{backgroundColor: (sport === 'nba') ? 'dodgerblue' : 'white'}}
                                onClick={() => this.fetchOptimalLineups('nba', 'main')}>NBA</button>
                    </div>
                    {(sport === 'nfl') && <h3>Choose a game slate:</h3>}
                    {(sport === 'nfl') &&
                        <div style={{display: 'flex'}}>
                            <button style={{backgroundColor: (slate === 'thurs') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.fetchOptimalLineups(sport, 'thurs')}>Thurs only</button>
                            <button style={{backgroundColor: (slate === 'thurs-mon') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.fetchOptimalLineups(sport, 'thurs-mon')}>Thurs - Mon</button>
                            <button style={{backgroundColor: (slate === 'main') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.fetchOptimalLineups(sport, 'main')}>Sun (Main)</button>
                            <button style={{backgroundColor: (slate === 'sun-mon') ? 'dodgerblue' : 'white'}}
                                    onClick={() => this.fetchOptimalLineups(sport, 'sun-mon')}>Sun - Mon</button>
                        </div>}
                    {sport && slate && <button style={{marginTop: '10px'}}
                                      onClick={() => this.fetchOptimalLineups(sport, slate)}>Reset Lineups</button>}
                    {(sport === 'nfl' && slate) && <button style={{marginTop: '10px'}}
                                      onClick={() =>
                                          this.fetchReportingData(sport, slate, site, weekArray)}>Generate Report</button>}
                </div>
                {gridSection}
            </Container>
        )
    }
}
