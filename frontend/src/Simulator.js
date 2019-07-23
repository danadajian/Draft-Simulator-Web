import React, { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap'
import './App.css';
import JqxPopover from './jqxwidgets/react_jqxpopover'
import JqxListBox from './jqxwidgets/react_jqxlistbox'
import JqxTabs from './jqxwidgets/react_jqxtabs'
import JqxGrid from './jqxwidgets/react_jqxgrid'
import JqxSlider from './jqxwidgets/react_jqxslider'
import football from './football.ico'

let startingList = [];

export class Simulator extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], userPlayers: [], teamCount: 10, pickOrder: 5, roundCount: 16,
            isDrafting: false, isRandom: false, allFreqs: '', userFreqs: '', expectedTeam: ''};
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
                    response.text()
                        .then((data) => {
                            const playerList = data.substring(2, data.length - 2).split(/', '|", '|', "/);
                            this.setState({isLoading: false, players: playerList});
                            this.bindSlidersToChangeEvent();
                            for (let i = 0; i < playerList.length; i++) {
                                startingList.push(playerList[i]);
                            }
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

    loadRankings = () => {
        let playerList = this.state.players;
        let userPlayers = this.state.userPlayers;
        fetch(window.location.origin + '/user-rankings')
            .then(response => {
                if (response.status !== 200) {
                    alert('Could not load user ranking data.');
                }  else {
                    response.text()
                        .then((data) => {
                            if (data === 'No ranking specified.') {
                                alert('No ranking specified.');
                            } else {
                                let userRanking = data.split(',');
                                if (userPlayers) {
                                    this.clearPlayers()
                                }
                                for (let i = 0; i < userRanking.length; i++) {
                                    this.refs.userListbox.addItem(userRanking[i]);
                                    this.refs.playerListbox.removeItem(userRanking[i]);
                                    let playerIndex = playerList.indexOf(userRanking[i]);
                                    playerList.splice(playerIndex, 1);
                                }
                                this.updateListsAndClearSelections(playerList, userRanking);
                            }
                        })
                }
            });
    };

    saveRankings = () => {
        let userItems = this.refs.userListbox.getItems();
        if (!userItems) {
            alert('Please rank at least one player before saving.');
        } else {
            let userRanking = [];
            for (let i = 0; i < userItems.length; i++) {
                userRanking.push(userItems[i].label)
            }
            fetch(window.location.origin + '/saved-ranking', {
                method: 'POST',
                body: userRanking.toString()
            }).then(response => {
                if (response.status === 200) {
                    alert('User ranking saved successfully.');
                } else {
                    alert('User ranking unable to be saved.');
                }
            });
        }
    };

    addPlayers = () => {
        let playerList = this.state.players;
        let userPlayers = this.state.userPlayers;
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

    updateListsAndClearSelections = (playerList, userPlayers) => {
        this.setState({players: playerList, userPlayers: userPlayers});
        this.refs.playerListbox.clearFilter();
        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    determineIfRandom = (event) => {
        this.setState({isRandom: event.target.checked})
    };

    simulateDrafts = (draftCancelled) => {
        if (draftCancelled) {
            this.setState({isDrafting: false});
            return
        }
        let userPlayers = this.refs.userListbox.getItems();
        if (!userPlayers || userPlayers.length === 0) {
            alert('Please select at least one player to draft.');
        } else {
            let reorderedPlayers = [];
            for (let i = 0; i < userPlayers.length; i++) {
                reorderedPlayers.push(userPlayers[i].label);
            }
            let teamCount = this.refs.teamCountSlider.getValue();
            let roundCount = this.refs.roundCountSlider.getValue();
            let userPick = this.refs.pickOrderSlider.getValue();
            let pickOrder = (this.state.isRandom) ? 0: userPick;
            this.setState({
                isDrafting: true,
                userPlayers: reorderedPlayers,
                teamCount: teamCount,
                pickOrder: userPick,
                roundCount: roundCount
            });
            fetch(window.location.origin + '/draft-results', {
                method: 'POST',
                body: reorderedPlayers.toString() + '|' + teamCount + '|' + pickOrder + '|' + roundCount
            }).then(response => {
                if (response.status !== 200) {
                    alert('Error loading draft results.');
                } else {
                    response.text()
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
        const output = draftResults.split('|');
        this.setState({
            isDrafting: false,
            userFreqs: output[0].toString(),
            allFreqs: output[1].toString(),
            expectedTeam: output[2].toString()
        });

        this.bindSlidersToChangeEvent();
        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    render() {
        const {isLoading, players, userPlayers, teamCount, pickOrder, roundCount, isDrafting, isRandom,
            allFreqs, userFreqs, expectedTeam} = this.state;

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
                            <button id='swapButton' style={{backgroundColor: swapButtonColor}} onClick={this.swapRankings} className={"Swap-button"}>{swapButtonText}</button>
                        </div>
                        <JqxListBox ref='userListbox' width={250} height={400}
                                    source={userPlayers} allowDrag={true}
                                    allowDrop={true} multiple={true} className={"Player-list-box"}/>
                        <div className={"Draft-buttons"}>
                            <button onClick={this.saveRankings} style={{fontSize: 16}} className={"Ranking-button"}>Save Player Rankings</button>
                            <button onClick={() => this.simulateDrafts(false)} style={{fontSize: 16}} className={"Draft-button"}>Draft!</button>
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