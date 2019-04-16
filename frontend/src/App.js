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
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], userPlayers: [],
            isDrafting: false, isRandom: false, allFreqs: '', userFreqs: '', expectedTeam: '', resized: 0};
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
            startingList = ['Currently not available.'];
            this.setState({isLoading: false, players: startingList});
        }
    }

    componentDidUpdate() {
        if (this.refs.navBar) {
            this.refs.navBar.on('change', () => {
                let index = this.refs.navBar.getSelectedIndex();
                if (index === 0) {
                    window.location.pathname = '/';
                } else if (index === 3) {
                    window.location.pathname = '/dfs-optimizer';
                }
            })
        }

        if (document.getElementById("swapButton")) {
            document.getElementById("swapButton").innerHTML =
                (window.location.pathname === '/espn') ? 'Switch to Yahoo' : 'Switch to ESPN';
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

    enter = () => {
        window.location.href += 'espn';
    };

    hitEsc = () => {
        const esc = window.$.Event("keydown", {keyCode: 27});
        window.$("body").trigger(esc);
        this.refs.navBar.close();
    };

    swapRankings = () => {
        if (window.location.href.endsWith('yahoo')) {
            window.location.href = window.location.href.replace('yahoo', 'espn');
        } else if (window.location.href.endsWith('espn')) {
            window.location.href = window.location.href.replace('espn', 'yahoo');
        }
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
                if (!playerList.includes(sortedItems[i].label)) {
                    let playerIndex = startingList.indexOf(sortedItems[i].label);
                    this.refs.playerListbox.insertAt(sortedItems[i].label, playerIndex);
                    playerList.splice(playerIndex, 0, sortedItems[i].label);
                }
            }

            this.setState({players: playerList});
            this.setState({userPlayers: []});
            this.refs.playerListbox.clearFilter();
            this.refs.playerListbox.clearSelection();
            this.refs.userListbox.clearSelection();
        }
    };

    simulateDraft = () => {
        this.refs.navBar.close();
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
                await postToEndpoint();
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
        if (window.location.pathname === '/') {
            return (
                <div>
                    <div><p className={'Loading-text'}>Welcome to Draft Simulator!</p></div>
                    <div className={'Home'}><button onClick={this.enter} className={'Home-button'}>Enter</button></div>
                </div>
            )
        } else if (window.location.pathname === '/dfs-optimizer') {
            return (
                <div>
                    <div><p className={'Loading-text'}>DFS Optimizer</p></div>
                    <div className={'Home'}><button className={'Home-button'}>Optimize</button></div>
                </div>
            )
        }

        const {isLoading, players, userPlayers,
            isDrafting, isRandom, allFreqs, userFreqs, expectedTeam} = this.state;
        const userPlayersList = (typeof userPlayers === 'string') ? userPlayers.split(','): userPlayers;

        if (isLoading) {
            return <p className={"Loading-text"}>Loading . . .</p>;
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
                       height={70} selectedItem={null} minimizeButtonPosition={"right"} width={"100%"}>
                    <ul>
                        <li>Home</li>
                        <li id={'aboutButton'}>About</li>
                        <li id={'instructionsButton'}>Instructions</li>
                        <li>DFS Optimizer</li>
                    </ul>
                </JqxNavBar>
                <div className={"Info-buttons"}>
                    <JqxPopover ref='about' isModal={true} showCloseButton={true} width={310}
                        position={'bottom'} title={'About Draft Simulator'} selector={"[id^='aboutButton']:last"}>
                        <p>Draft Simulator is a fantasy football draft preparation tool.</p>
                        <p>More often than not, others in your league will only draft among the "top available players"
                            in each round, which are determined by ESPN's preseason rankings.</p>
                        <p>However, Draft Simulator allows you to create and refine your own personal rankings that you
                            can bring to your draft to get the team you've always dreamed of.</p>
                        <button onClick={this.hitEsc}
                        style={{ float: 'right', marginTop: '10px', padding: '8px 12px', borderRadius: '6px' }}>
                            Got it!</button>
                    </JqxPopover>
                    <JqxPopover ref='instructions' isModal={true} showCloseButton={true} width={310}
                        position={'bottom'} title={'Instructions'} selector={"[id^='instructionsButton']:last"}>
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
                </div>
                <h1 className={"App-header"}>Draft Simulator</h1>
                <div className={"Player-list-box-div"}>
                <JqxListBox ref='playerListbox'
                            width={250} height={300}
                            source={players} filterable={true} searchMode={"containsignorecase"}
                            multiple={true} className={"Player-list-box"}/>
                </div>
                <div className={"Player-button"}>
                    <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                    <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove
                    </button>
                    <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                    <button id='swapButton' onClick={this.swapRankings} className={"Swap-button"}>Swap Button</button>
                </div>
                <div className={"User-list-box-div"}>
                    <JqxListBox ref='userListbox' width={250} height={300}
                                source={userPlayersList} allowDrag={true}
                                allowDrop={true} multiple={true} className={"User-list-box"}/>
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
