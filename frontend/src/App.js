import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import './App.css';
import JqxPopover from './jqxwidgets/react_jqxpopover'
import JqxListBox from './jqxwidgets/react_jqxlistbox'
import JqxTabs from './jqxwidgets/react_jqxtabs'
import JqxGrid from './jqxwidgets/react_jqxgrid'
import JqxSlider from './jqxwidgets/react_jqxslider'
import JqxDropDownList from './jqxwidgets/react_jqxdropdownlist'
import $ from 'jquery';
import football from './football.ico'

let teamCount = 10;
let pickOrder = 5;
let sliderPick = 5;
let sliderLength = 10;
let roundCount = 16;
let startingList = [];
let lineup1 = '';
let lineup2 = '';
let blankLineup = '[{"Position": "", "Player": "Not enough player data.", "Projected": "", "Price": ""}]';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], userPlayers: [], isDrafting: false, isRandom: false,
            allFreqs: '', userFreqs: '', expectedTeam: '', sport: '', fdLineup: '', dkLineup: ''};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        if (window.location.pathname === '/espn') {
            $.get(window.location.origin + '/espn-players', (data) => {
                const playerList = data.substring(2, data.length - 2).split(/', '|", '|', "/);
                this.setState({isLoading: false, players: playerList});
                for (let i = 0; i < playerList.length; i++) {
                    startingList.push(playerList[i]);
                }
            });
        } else if (window.location.pathname === '/yahoo') {
            $.get(window.location.origin + '/yahoo-players', (data) => {
                const playerList = data.substring(2, data.length - 2).split(/', '|", '|', "/);
                this.setState({isLoading: false, players: playerList});
                for (let i = 0; i < playerList.length; i++) {
                    startingList.push(playerList[i]);
                }
            });
        } else if (window.location.pathname === '/dfs-optimizer') {
            this.setState({isLoading: false});
            this.setState({sport: 'reset'}, function () {
                $.get(window.location.origin + '/optimized-lineup/' + 'reset');
            })
        }
    }

    componentWillUpdate() {
        if (this.refs.fdGrid) {
            this.refs.fdGrid.on('rowclick', (event) => {
                let index = this.refs.dropDown.selectedIndex();
                let sport = '';
                if (index === 0) {
                    sport = 'mlb';
                } else if (index === 1) {
                    sport = 'nba';
                }

                let row_index = event.args.rowindex;
                let row_data = this.refs.fdGrid.getrowdata(row_index);

                const postToEndpoint = async () => {
                    return await $.post(window.location.origin + '/optimized-lineup/' + sport, row_index + '|fd');
                };

                const getFromEndpoint = async () => {
                    return await $.get(window.location.origin + '/optimized-lineup/' + sport, (data) => {
                        const lineup = data.split('|');
                        lineup1 = lineup[0].toString();

                        if (lineup1 !== this.state.fdLineup) {
                            if (lineup1 === 'Not enough player data is currently available.') {
                                this.setState({fdLineup: blankLineup});
                            } else {
                                this.setState({fdLineup: lineup1}, function () {
                                    this.refs.fdGrid.unselectrow(row_index);
                                    alert('You have removed ' + row_data.Player + ' from your Fanduel lineup.');
                                });
                            }
                        }
                    });
                };

                const changePlayers = async () => {
                    await postToEndpoint();
                    await getFromEndpoint();
                };

                return changePlayers();
            });
        }

        if (this.refs.dkGrid) {
            this.refs.dkGrid.on('rowclick', (event) => {
                let index = this.refs.dropDown.selectedIndex();
                let sport = '';
                if (index === 0) {
                    sport = 'mlb';
                } else if (index === 1) {
                    sport = 'nba';
                }

                let row_index = event.args.rowindex;
                let row_data = this.refs.dkGrid.getrowdata(row_index);

                const postToEndpoint = async () => {
                    return await $.post(window.location.origin + '/optimized-lineup/' + sport, row_index + '|dk');
                };

                const getFromEndpoint = async () => {
                    return await $.get(window.location.origin + '/optimized-lineup/' + sport, (data) => {
                        const lineup = data.split('|');
                        lineup2 = lineup[1].toString();
                        if (lineup2 !== this.state.dkLineup) {
                            if (lineup1 === 'Not enough player data is currently available.') {
                                this.setState({fdLineup: blankLineup});
                            } else {
                                this.setState({dkLineup: lineup2}, function () {
                                    this.refs.dkGrid.unselectrow(row_index);
                                    alert('You have removed ' + row_data.Player + ' from your Draftkings lineup.');
                                });
                            }
                        }
                    });
                };

                const changePlayers = async () => {
                    await postToEndpoint();
                    await getFromEndpoint();
                };

                return changePlayers();
            });
        }
    }

    componentDidUpdate() {
        let done = 0;
        if (this.refs.dropDown) {
            this.refs.dropDown.on('change', () => {
                done += 1;
                if (done % 2 === 1) {
                    let sport = '';
                    let index = this.refs.dropDown.selectedIndex();
                    if (index === 0) {
                        sport = 'mlb';
                    } else if (index === 1) {
                        sport = 'nba';
                    }
                    $.get(window.location.origin + '/optimized-lineup/' + sport, (data) => {
                        const lineup = data.split('|');
                        lineup1 = lineup[0].toString();
                        lineup2 = lineup[1].toString();

                        if (lineup1 === 'Not enough player data is currently available.') {
                            this.setState({fdLineup: blankLineup}, function () {
                                alert('Not enough player data is currently available. \nPlease try again later.');
                            });
                        } else {
                            this.setState({fdLineup: lineup1});
                        }
                        if (lineup2 === 'Not enough player data is currently available.') {
                            this.setState({dkLineup: blankLineup}, function () {
                                alert('Not enough player data is currently available. \nPlease try again later.');
                            });
                        } else {
                            this.setState({dkLineup: lineup2});
                        }
                    });
                }
            });
        }

        if (document.getElementById("swapButton")) {
            document.getElementById("swapButton").innerHTML =
                (window.location.pathname.startsWith('/espn')) ? 'Switch to Yahoo' : 'Switch to ESPN';

            document.getElementById("swapButton").style.backgroundColor =
                (window.location.pathname.startsWith('/espn')) ? '#6C00B3' : '#CE0000';
        }

        if (this.refs.teamCountSlider) {
            sliderLength = this.refs.teamCountSlider.getValue();
            window.$("[id^='jqxSliderjqx']:eq(1)").jqxSlider({max: sliderLength});
            this.refs.teamCountSlider.on('change', () => {
                sliderLength = this.refs.teamCountSlider.getValue();
                window.$("[id^='jqxSliderjqx']:eq(1)").jqxSlider({max: sliderLength});
            });
        }
    }

    hitEsc = () => {
        const esc = window.$.Event("keydown", {keyCode: 27});
        window.$("body").trigger(esc);
        let url = window.location.pathname.split('#');
        window.location.href = window.location.origin + url[0].toString() + '#';
    };

    loadRankings = () => {
        let playerList = this.state.players;
        let userPlayers = this.state.userPlayers;
        $.get(window.location.origin + '/user-rankings', (data) => {
            let userRanking = data.split(',');
            if (userPlayers) {this.clearPlayers()}
            for (let i = 0; i < userRanking.length; i++) {
                this.refs.userListbox.addItem(userRanking[i]);
                this.refs.playerListbox.removeItem(userRanking[i]);
                let playerIndex = playerList.indexOf(userRanking[i]);
                playerList.splice(playerIndex, 1);
            }
            this.setState({userPlayers: userRanking});
        });
    };

    swapRankings = () => {
        if (window.location.pathname.startsWith('/yahoo')) {
            window.location.href = window.location.href.replace('yahoo', 'espn');
        } else if (window.location.pathname.startsWith('/espn')) {
            window.location.href = window.location.href.replace('espn', 'yahoo');
        }
    };

    updateListsAndClearSelections = (playerList, userPlayers) => {
        this.setState({players: playerList});
        this.setState({userPlayers: userPlayers});
        this.refs.playerListbox.clearFilter();
        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    addPlayers = () => {
        let playerList = this.state.players;
        let userPlayers = this.state.userPlayers;
        userPlayers = (typeof userPlayers === 'string') ? userPlayers.split(','): userPlayers;
        let selectedItems = this.refs.playerListbox.getSelectedItems();

        for (let i = 0; i < selectedItems.length; i++) {
            if (!userPlayers.includes(selectedItems[i].label)) {
                this.refs.playerListbox.unselectItem(selectedItems[i].label);
                this.refs.userListbox.addItem(selectedItems[i].label);
                userPlayers.push(selectedItems[i].label);
                this.refs.playerListbox.removeItem(selectedItems[i].label);
                let playerIndex = playerList.indexOf(selectedItems[i].label);
                playerList.splice(playerIndex, 1);
            }
        }
        this.updateListsAndClearSelections(playerList, userPlayers);
    };

    removePlayers = () => {
        let playerList = this.state.players;
        let selectedUserItems = this.refs.userListbox.getSelectedItems();
        let sortedItems = selectedUserItems.sort(function (a,b) {
            return startingList.indexOf(a.label) - startingList.indexOf(b.label)
        });

        for (let i = 0; i < sortedItems.length; i++) {
            if (!playerList.includes(sortedItems[i].label)) {
                this.refs.userListbox.removeItem(sortedItems[i].label);
                let playerIndex = startingList.indexOf(sortedItems[i].label);
                this.refs.playerListbox.insertAt(sortedItems[i].label, playerIndex);
                playerList.splice(playerIndex, 0, sortedItems[i].label);
            }
        }

        let remainingPlayers = [];
        let userItems = this.refs.userListbox.getItems();
        if (userItems) {
            for (let i = 0; i < userItems.length; i++) {
                remainingPlayers.push(userItems[i].label);
            }
        }
        this.updateListsAndClearSelections(playerList, remainingPlayers);
    };

    clearPlayers = () => {
        let playerList = this.state.players;
        let userItems = this.refs.userListbox.getItems();
        if (userItems) {
            let sortedItems = userItems.sort(function (a, b) {
                return startingList.indexOf(a.label) - startingList.indexOf(b.label)
            });

            this.refs.userListbox.clear();
            for (let i = 0; i < sortedItems.length; i++) {
                if (!playerList.includes(sortedItems[i].label)) {
                    let playerIndex = startingList.indexOf(sortedItems[i].label);
                    this.refs.playerListbox.insertAt(sortedItems[i].label, playerIndex);
                    playerList.splice(playerIndex, 0, sortedItems[i].label);
                }
            }
            this.updateListsAndClearSelections(playerList, []);
        }
    };

    saveRankings = () => {
        let userRanking = this.state.userPlayers;
        if (!userRanking || userRanking.length === 0) {
            alert('Please rank at least one player before saving.');
            return;
        }
        $.post(window.location.origin + '/save-ranking', userRanking.toString());
    };

    simulateDraft = () => {
        this.setState({allFreqs: '', userFreqs: '', expectedTeam: ''});
        let userPick = this.refs.pickOrderSlider.getValue();
        this.setState({isRandom: window.$("input[type='checkbox']").is(":checked")}, function () {
            pickOrder = (this.state.isRandom) ? 0: userPick;
            sliderPick = userPick;
        });
        teamCount = this.refs.teamCountSlider.getValue();
        roundCount = this.refs.roundCountSlider.getValue();
        let reorderedPlayers = [];
        let userItems = this.refs.userListbox.getItems();
        if (!userItems || userItems.length === 0) {
            alert('Please select at least one player to draft.');
            return;
        }
        this.setState({isDrafting: true}, function () {
            for (let i = 0; i < userItems.length; i++) {
                reorderedPlayers.push(userItems[i].label);
            }

            const postToEndpoint = async () => {
                return await $.post(window.location.origin + '/draft-results',
                    this.state.userPlayers + '|' + teamCount + '|' + pickOrder + '|' + roundCount);
            };

            const postPlayers = async () => {
                if (this.state.isDrafting) {
                    await postToEndpoint();
                }
            };

            const getFromEndpoint = async () => {
                return await $.get(window.location.origin + '/draft-results', (data) => {
                    if (data === 'Draft error!') {
                        this.setState({isDrafting: false}, function () {
                            alert('No players were drafted. :(' +
                                '\nSomething went wrong . . .');
                        })
                    } else {
                        this.setState({isDrafting: false}, function () {
                            const output = data.split('|');
                            this.setState({userFreqs: output[0].toString(), allFreqs: output[1].toString(),
                            expectedTeam: output[2].toString()});
                        });
                    }
                });
            };

            const getResults = async () => {
                if (this.state.isDrafting) {
                    await getFromEndpoint();
                }
            };

            this.setState({userPlayers: reorderedPlayers.toString()}, function () {
                const playersArePosted = async () => {
                    return await postPlayers();
                };
                const draftPlayers = async () => {
                    await playersArePosted();
                    getResults();
                };
                draftPlayers();
            });
        });
        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    cancelDraft = () => {
        this.setState({isDrafting: false});
    };

    render() {
        const {isLoading, players, userPlayers,
            isDrafting, isRandom, allFreqs, userFreqs, expectedTeam, fdLineup, dkLineup} = this.state;

        if (window.location.pathname === '/home') {
            return (
                <div className={'Home'}>
                    <h1 className={'Home-header'}>Welcome to Draft Simulator!</h1>
                    <h3 className={'Dfs-header'}>To start, choose a draft site:</h3>
                    <div className={"Home-buttons"}>
                    <button onClick={() => {window.location.href = window.location.origin + '/espn'}} className={'Site-button'}>ESPN</button>
                    <button onClick={() => {window.location.href = window.location.origin + '/yahoo'}} className={'Site-button'}>Yahoo</button>
                    </div>
                    <h3 className={'Dfs-header'}>Or, check out our DFS Optimizer:</h3>
                    <button onClick={() => {window.location.href = window.location.origin + '/dfs-optimizer'}} className={'Dfs-button'}>DFS Optimizer</button>
                    <div><a href={window.location.origin + '/logout'} className={'Dfs-header'}>Sign Out</a></div>
                </div>
            )
        }

        if (isLoading) {
            return <p className={"Loading-text"}>Loading . . .</p>;
        } else if (isDrafting) {
            return (
                <div className={"Drafting"}>
                    <div><p className={"Draft-text"}>Drafting . . .</p></div>
                    <div><img src={football} className={"App-logo"} alt="football"/></div>
                    <div><button onClick={this.cancelDraft} className={"Cancel-draft-button"}>Cancel</button></div>
                </div>
            );
        }

        if (window.location.pathname === '/dfs-optimizer') {

            const sports = ['MLB', 'NBA'];

            const dfsFields = [{ name: 'Position', type: 'string' },
                               { name: 'Player', type: 'string' },
                               { name: 'Projected', type: 'string' },
                               { name: 'Price', type: 'string' }];

            const dfsColumns = [{ text: 'Position', datafield: 'Position', width: 75 },
                                { text: 'Player', datafield: 'Player', width: 175 },
                                { text: 'Projected', datafield: 'Projected', width: 100 },
                                { text: 'Price', datafield: 'Price', width: 75 }];

            let dfsSource1 = {datatype: 'json', datafields: dfsFields, localdata: fdLineup};
            let dfsSource2 = {datatype: 'json', datafields: dfsFields, localdata: dkLineup};
            let dfsDataAdapter1 = new window.$.jqx.dataAdapter(dfsSource1);
            let dfsDataAdapter2 = new window.$.jqx.dataAdapter(dfsSource2);

            if (fdLineup + dkLineup) {
                window.$("[id^='jqxGridjqx']:eq(0)").jqxGrid({source: dfsDataAdapter1});
                window.$("[id^='jqxGridjqx']:eq(1)").jqxGrid({source: dfsDataAdapter2});
            }

            return (
                <Container fluid={true}>
                    <Navbar bg="primary" variant="dark">
                        <Nav className="Nav-bar">
                          <Nav.Link href="/">Home</Nav.Link>
                          <Nav.Link href="/espn">Back to Draft Simulator</Nav.Link>
                        </Nav>
                    </Navbar>
                    <h1 className={"App-header"}>DFS Optimizer</h1>
                    <div className={"Dfs-sport"}>
                    <h3>Choose a sport:</h3>
                    <JqxDropDownList ref='dropDown' className={"Drop-down"} width={100} height={30}
                                     source={sports} autoDropDownHeight={true}/>
                    </div>
                    <div className={"Dfs-grid"}>
                        <div>
                        <h2 className={"Dfs-header"}>Fanduel</h2>
                        <JqxGrid ref='fdGrid' width={425} height={420} autoheight={true}
                                 source={dfsDataAdapter1} columns={dfsColumns}/>
                        </div>
                        <div>
                        <h2 className={"Dfs-header"}>Draftkings</h2>
                         <JqxGrid ref='dkGrid' width={425} height={420} autoheight={true}
                         source={dfsDataAdapter2} columns={dfsColumns}/>
                        </div>
                    </div>
                </Container>
            )
        }

        const userPlayersList = (typeof userPlayers === 'string') ? userPlayers.split(','): userPlayers;

        const dsFields = [{ name: 'Position', type: 'string' },
                           { name: 'Player', type: 'string' },
                           { name: 'DraftFreq', type: 'string' }];

        let source1 = {datatype: 'json', datafields: dsFields, localdata: userFreqs};
        let dataAdapter1 = new window.$.jqx.dataAdapter(source1);

        let source2 = {datatype: 'json', datafields: dsFields, localdata: allFreqs};
        let dataAdapter2 = new window.$.jqx.dataAdapter(source2);

        let source3 = {datatype: 'json', datafields: dsFields, localdata: expectedTeam};
        let dataAdapter3 = new window.$.jqx.dataAdapter(source3);

        let tabSpecs = [{ text: 'Position', datafield: 'Position', width: 95 },
                        { text: 'Player', datafield: 'Player', width: 175 },
                        { text: 'Draft Frequency', datafield: 'DraftFreq', width: 130 }];

        if (userFreqs + allFreqs + expectedTeam) {
            window.$("[id^='jqxGridjqx']:eq(0)").jqxGrid({source: dataAdapter1});
            window.$("[id^='jqxGridjqx']:eq(1)").jqxGrid({source: dataAdapter2});
            window.$("[id^='jqxGridjqx']:eq(2)").jqxGrid({source: dataAdapter3});
        }

        if (isRandom) {
            window.$("input[type='checkbox']").prop('checked', true);
        }

        return (
            <Container fluid={true}>
                <Navbar bg="primary" variant="dark">
                    <Nav className="Nav-bar">
                      <Nav.Link href="/">Home</Nav.Link>
                      <Nav.Link href="#about">About</Nav.Link>
                      <Nav.Link href="#instructions">Instructions</Nav.Link>
                      <Nav.Link href="/dfs-optimizer">DFS Optimizer</Nav.Link>
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
                        <button onClick={this.hitEsc}
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
                        <button onClick={this.hitEsc}
                        style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Let's draft!</button>
                    </JqxPopover>
                </div>
                <h1 className={"App-header"}>Draft Simulator</h1>
                <div className={"Buttons-and-boxes"}>
                    <JqxListBox ref='playerListbox'
                                width={250} height={400}
                                source={players} filterable={true} searchMode={"containsignorecase"}
                                multiple={true} className={"Player-list-box"}/>
                    <div className={"Player-buttons"}>
                        <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                        <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove
                        </button>
                        <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                        <button id='rankingButton' onClick={this.loadRankings} className={"Ranking-button"}>Load Saved Rankings</button>
                        <button id='swapButton' onClick={this.swapRankings} className={"Swap-button"}>Swap Button</button>
                    </div>
                    <JqxListBox ref='userListbox' width={250} height={400}
                                source={userPlayersList} allowDrag={true}
                                allowDrop={true} multiple={true} className={"Player-list-box"}/>
                    <div className={"Draft-buttons"}>
                        <button onClick={this.saveRankings} style={{fontSize: 16}} className={"Ranking-button"}>Save Player Rankings</button>
                        <button onClick={this.simulateDraft} style={{fontSize: 16}} className={"Draft-button"}>Draft!</button>
                    </div>
                    <JqxTabs width={400} height={400}>
                        <ul>
                            <li style={{ marginLeft: 15 }}>Draft Frequency</li>
                            <li>All Players</li>
                            <li>Expected Team</li>
                        </ul>
                        <div style={{ overflow: 'hidden' }}>
                            <JqxGrid style={{ border: 'none' }}
                                width={'100%'} height={'100%'} source={dataAdapter1} columns={tabSpecs}/>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <JqxGrid style={{ border: 'none' }}
                                width={'100%'} height={'100%'} source={dataAdapter2} columns={tabSpecs}/>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <JqxGrid style={{ border: 'none' }}
                                width={'100%'} height={'100%'} source={dataAdapter3} columns={tabSpecs}/>
                        </div>
                    </JqxTabs>
                </div>
                <div className={"Slider-row"}>
                    <div className={"Sliders"}>
                    <p>Number of teams per draft:</p>
                    <JqxSlider ref='teamCountSlider'
                    height={55} width={350}
                    value={teamCount} min={6} max={14} showTickLabels={true}
                    ticksFrequency={2} tooltip={true} mode={'fixed'}/>
                    </div>
                    <div className={"Sliders"}>
                    <p>Your pick in the draft:</p>
                    <JqxSlider ref='pickOrderSlider'
                        height={55} width={350}
                        value={sliderPick} min={1} max={sliderLength} showTickLabels={true}
                        ticksFrequency={1} tooltip={true} mode={'fixed'}/>
                    <form>
                      <label>
                        Randomize:
                        <input type="checkbox" value="checked"/>
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

export default App;
