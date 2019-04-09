import React from 'react';
import './App.css';
import JqxListBox from './jqxwidgets/react_jqxlistbox'
import JqxGrid from './jqxwidgets/react_jqxgrid'
import JqxTabs from './jqxwidgets/react_jqxtabs'
import JqxSlider from './jqxwidgets/react_jqxslider'
import JqxNavBar from './jqxwidgets/react_jqxnavbar'
import JqxPopover from './jqxwidgets/react_jqxpopover'
import $ from 'jquery';
import football from './football.ico'

let teamCount = 10;
let pickOrder = 5;
let sliderPick = 5;
let sliderLength = 10;
let roundCount = 16;
let startingList = [];
let offset1 = {};
let buttonOffset = {};
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], userPlayers: [],
            isDrafting: false, isRandom: false, allFreqs: '', userFreqs: '', expectedTeam: ''};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        $.get((window.location.href.endsWith('draft-results'))
            ? window.location.href.slice(0, -13) + 'players' : window.location.href + 'players', (data) => {
            const playerList = data.substring(2, data.length - 2).split(/', '|", '|', "/);
            this.setState({isLoading: false, players: playerList});
            for (let i = 0; i < playerList.length; i++) {
                startingList.push(playerList[i]);
            }
        });
    }

    componentDidUpdate() {
        if (this.refs.navBar) {
            this.refs.navBar.on('change', () => {
                let index = this.refs.navBar.getSelectedIndex();
                console.log(index);
            })
        }

        if (this.refs.popover1) {
            offset1 = window.$("[id^='jqxListBoxjqx']:eq(0)").offset();
            buttonOffset = window.$("#firstHelp").offset();
            window.$("[id^='jqxPopoverjqx']:eq(0)").jqxPopover({offset: {left: offset1.left - buttonOffset.left + 100,
                    top: offset1.top - buttonOffset.top}});
            window.onresize = async () => {
                await window.$('#firstHelp').on('click', () => {
                    offset1 = window.$("[id^='jqxListBoxjqx']:eq(0)").offset();
                    buttonOffset = window.$("#firstHelp").offset();
                    window.$("[id^='jqxPopoverjqx']:eq(0)").jqxPopover({offset: {left: offset1.left - buttonOffset.left + 100,
                        top: offset1.top - buttonOffset.top}})}
            )};
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
    };

    addPlayers = () => {
        let playerList = this.state.players;
        let userPlayers = this.state.userPlayers;
        userPlayers = (typeof userPlayers === 'string') ? userPlayers.split(','): userPlayers;
        let selectedItems = this.refs.playerListbox.getSelectedItems();

        for (let i = 0; i < selectedItems.length; i++) {
            this.refs.playerListbox.unselectItem(selectedItems[i].label);
            this.refs.userListbox.addItem(selectedItems[i].label);
            userPlayers.push(selectedItems[i].label);
            this.refs.playerListbox.removeItem(selectedItems[i].label);
            let playerIndex = playerList.indexOf(selectedItems[i].label);
            playerList.splice(playerIndex, 1);
        }

        this.setState({players: playerList});
        this.setState({userPlayers: userPlayers});
        this.refs.playerListbox.clearFilter();
        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    removePlayers = () => {
        let playerList = this.state.players;
        let selectedUserItems = this.refs.userListbox.getSelectedItems();
        let sortedItems = selectedUserItems.sort(function (a,b) {
            return startingList.indexOf(a.label) - startingList.indexOf(b.label)
        });

        for (let i = 0; i < sortedItems.length; i++) {
            this.refs.userListbox.removeItem(sortedItems[i].label);
            let playerIndex = startingList.indexOf(sortedItems[i].label);
            this.refs.playerListbox.insertAt(sortedItems[i].label, playerIndex);
            playerList.splice(playerIndex, 0, sortedItems[i].label);
        }

        let remainingPlayers = [];
        let userItems = this.refs.userListbox.getItems();
        if (userItems) {
            for (let i = 0; i < userItems.length; i++) {
                remainingPlayers.push(userItems[i].label);
            }
        }

        this.setState({players: playerList});
        this.setState({userPlayers: remainingPlayers});
        this.refs.playerListbox.clearFilter();
        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
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
                let playerIndex = startingList.indexOf(sortedItems[i].label);
                this.refs.playerListbox.insertAt(sortedItems[i].label, playerIndex);
                playerList.splice(playerIndex, 0, sortedItems[i].label);
            }

            this.setState({players: playerList});
            this.setState({userPlayers: []});
            this.refs.playerListbox.clearFilter();
            this.refs.playerListbox.clearSelection();
            this.refs.userListbox.clearSelection();
        }
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
                return await $.post(window.location.href + 'draft-results',
                    this.state.userPlayers + '|' + teamCount + '|' + pickOrder + '|' + roundCount);
            };

            const postPlayers = async () => {
                await postToEndpoint();
            };

            const getFromEndpoint = async () => {
                return await $.get(window.location.href + 'draft-results', (data) => {
                    if (data === '[]') {
                        alert('No players were drafted. :(');
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
                await getFromEndpoint();
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

    render() {
        const {isLoading, players, userPlayers,
            isDrafting, isRandom, allFreqs, userFreqs, expectedTeam} = this.state;
        const userPlayersList = (typeof userPlayers === 'string') ? userPlayers.split(','): userPlayers;

        if (isLoading) {
            return <p className={"Loading-text"}>Loading players from ESPN . . .</p>;
        } else if (isDrafting) {
            return (
                <div>
                    <div><p className={"Loading-text"}>Drafting . . .</p></div>
                    <div><img src={football} className="App-logo" alt="football"/></div>
                </div>
            );
        }

        const structure = [
                    { name: 'Position', type: 'string' },
                    { name: 'Player', type: 'string' },
                    { name: 'DraftFreq', type: 'string' }
                ];

        let source1 = {datatype: 'json', datafields: structure, localdata: userFreqs};
        let dataAdapter1 = new window.$.jqx.dataAdapter(source1);

        let source2 = {datatype: 'json', datafields: structure, localdata: allFreqs};
        let dataAdapter2 = new window.$.jqx.dataAdapter(source2);

        let source3 = {datatype: 'json', datafields: structure, localdata: expectedTeam};
        let dataAdapter3 = new window.$.jqx.dataAdapter(source3);

        let tabSpecs =
            [
                { text: 'Position', datafield: 'Position', width: 100 },
                { text: 'Player', datafield: 'Player', width: 175 },
                { text: 'Draft Frequency', datafield: 'DraftFreq', width: 125 }
            ];

        if (userFreqs + allFreqs + expectedTeam !== '') {
            window.$("[id^='jqxGridjqx']:eq(0)").jqxGrid({source: dataAdapter1});
            window.$("[id^='jqxGridjqx']:eq(1)").jqxGrid({source: dataAdapter2});
            window.$("[id^='jqxGridjqx']:eq(2)").jqxGrid({source: dataAdapter3});
        }

        if (isRandom) {
            window.$("input[type='checkbox']").prop('checked', true);
        }

        return (
            <div className={"App"}>
                <div>
                <JqxNavBar ref='navBar' minimizedTitle={"Draft Simulator"} minimized={true} minimizedHeight={40}
                       height={70} minimizeButtonPosition={"right"} width={"100%"}>
                    <ul>
                        <li>Home</li>
                        <li>Instructions</li>
                        <li>About</li>
                    </ul>
                </JqxNavBar>
                <div>
                    <JqxPopover ref='popover1' isModal={true} showCloseButton={true}
                        position={'top'} title={'Available Players'} selector={'#firstHelp'}>
                        <p>Search for and select players from this list</p>
                        <button id="secondHelp" style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Next</button>
                    </JqxPopover>
                    <JqxPopover
                        offset={{ left: 100, top: 40 }}
                        position={'top'} title={'Your Players'} selector={'#secondHelp'}>
                        <p>Drag and drop your players in order of draft preference</p>
                        <button
                            id="thirdHelp" style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Next</button>
                    </JqxPopover>
                    <JqxPopover
                        offset={{ left: 0, top: 0 }}
                        position={'top'} title={'Draft Results'} selector={'#thirdHelp'}>
                        <p>See how often you were able to draft each player here!</p>
                        <button
                            id="fourthHelp" style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Next</button>
                    </JqxPopover>
                    <JqxPopover
                        offset={{ left: 0, top: 0 }}
                        position={'bottom'} selector={'#fourthHelp'}>
                        <button onClick={this.hitEsc}
                        style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Got it!</button>
                    </JqxPopover>
                    <div style={{ padding: '5px' }}>
                        <button id="firstHelp" ref='helpButton' style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Help
                        </button>
                    </div>
                </div>
                </div>
                <h1 className={"App-header"}>Draft Simulator</h1>
                <div className={"Player-list-box-div"}>
                <JqxListBox ref='playerListbox'
                            width={250} height={300}
                            source={players} multiple={true} filterable={true} searchMode={"containsignorecase"}
                            className={"Player-list-box"}/>
                </div>
                <div className={"Player-button"}>
                    <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                    <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove
                    </button>
                    <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                </div>
                <div className={"User-list-box-div"}>
                    <JqxListBox ref='userListbox' width={250} height={300}
                                source={userPlayersList} multiple={true}
                                allowDrag={true} allowDrop={true} className={"User-list-box"}/>
                </div>
                <div className={"Draft-button-div"}>
                <button onClick={this.simulateDraft} style={{fontSize: 16}} className={"Draft-button"}>Draft</button>
                </div>
                <div className={"Draft-results-div"}>
                <JqxTabs width={400} height={450}>
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
                <div className={"Slider-div"}>
                    <p>Number of teams per draft:</p>
                    <JqxSlider ref='teamCountSlider'
                    height={55} width={400}
                    value={teamCount} min={6} max={14} showTickLabels={true}
                    ticksFrequency={2} tooltip={true} mode={'fixed'}/>
                </div>
                <div className={"Slider-div"}>
                    <p>Your pick in the draft:</p>
                    <JqxSlider ref='pickOrderSlider'
                        height={55} width={400}
                        value={sliderPick} min={1} max={sliderLength} showTickLabels={true}
                        ticksFrequency={1} tooltip={true} mode={'fixed'}/>
                    <form>
                      <label>
                        Randomize:
                        <input type="checkbox" value="checked" />
                      </label>
                    </form>
                </div>
                <div className={"Slider-div"}>
                    <p>Number of rounds per draft:</p>
                    <JqxSlider ref='roundCountSlider'
                    height={55} width={400}
                    value={roundCount} min={1} max={16} showTickLabels={true}
                    ticksFrequency={15} showMinorTicks={true}
                    minorTicksFrequency={1} tooltip={true} mode={'fixed'}/>
                </div>
            </div>
        )
    }
}

export default App;
