import React from 'react';
import './App.css';
import JqxListBox from './jqxwidgets/react_jqxlistbox';
import JqxGrid from './jqxwidgets/react_jqxgrid'
import JqxTabs from './jqxwidgets/react_jqxtabs'
import JqxSlider from './jqxwidgets/react_jqxslider'
import $ from 'jquery';
import football from './football.ico'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], userPlayers: [],
            isDrafting: false, allFreqs: '', userFreqs: '', undrafted: ''};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        $.get((window.location.href.endsWith('draft-results'))
            ? window.location.href.slice(0, -13) + 'players' : window.location.href + 'players', (data) => {
            const playerList = data.substring(2, data.length - 2).split(/', '|", '|', "/);
            this.setState({isLoading: false, players: playerList});
        });
    }

    addPlayers = () => {
        let currentPlayers = this.state.userPlayers;
        let selectedItems = this.refs.playerListbox.getSelectedItems();
        let playersToAdd = [];

        for (let i = 0; i < selectedItems.length; i++) {
            if (!currentPlayers.includes(selectedItems[i].label)) {
                playersToAdd.push(selectedItems[i].label);
            }
        }

        for (let i = 0; i < playersToAdd.length; i++) {
            this.refs.userListbox.addItem(playersToAdd[i]);
            currentPlayers.push(playersToAdd[i]);
        }

        this.setState({userPlayers: currentPlayers});

        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    removePlayers = () => {
        let currentPlayers = this.state.userPlayers;
        let selectedUserItems = this.refs.userListbox.getSelectedItems();
        let removedPlayers = [];

        if (selectedUserItems.length > 0) {
            for (let i = 0; i < selectedUserItems.length; i++) {
                this.refs.userListbox.removeItem(selectedUserItems[i].label);
                removedPlayers.push(selectedUserItems[i].label);
            }
        }

        let remainingPlayers = [];
        for (let i = 0; i < currentPlayers.length; i++) {
            if (!removedPlayers.includes(currentPlayers[i])) {
                remainingPlayers.push(currentPlayers[i]);
            }
        }

        this.setState({userPlayers: remainingPlayers});

        this.refs.userListbox.clearSelection();
    };

    clearPlayers = () => {
        this.refs.userListbox.clear();
        this.setState({userPlayers: []});
        this.refs.userListbox.clearSelection();
    };

    simulateDraft = () => {
        this.setState({allFreqs: '', userFreqs: '', undrafted: ''});
        let teamCount = this.refs.teamCountSlider.getValue();
        let pickOrder = this.refs.pickOrderSlider.getValue();
        let roundCount = this.refs.roundCountSlider.getValue();
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
                            this.setState({allFreqs: output[0].toString(), userFreqs: output[1].toString(),
                                undrafted: output[2].toString()});
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
        console.log('Rendered');
        const {isLoading, players, userPlayers, isDrafting, allFreqs, userFreqs, undrafted} = this.state;
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

        if (this.refs.teamCountSlider) {
            this.refs.teamCountSlider.on('change', (event) => {
                console.log(event);
            });
        }

        const structure = [
                    { name: 'Player', type: 'string' },
                    { name: 'Position', type: 'string' },
                    { name: 'DraftFreq', type: 'string' }
                ];

        let source1 = {datatype: 'json', datafields: structure, localdata: allFreqs};
        let dataAdapter1 = new window.$.jqx.dataAdapter(source1);

        let source2 = {datatype: 'json', datafields: structure, localdata: userFreqs};
        let dataAdapter2 = new window.$.jqx.dataAdapter(source2);

        let source3 = {datatype: 'json', datafields: structure, localdata: undrafted};
        let dataAdapter3 = new window.$.jqx.dataAdapter(source3);

        let tabSpecs =
            [
                { text: 'Player', datafield: 'Player', width: 210 },
                { text: 'Position', datafield: 'Position', width: 150 },
                { text: 'Draft Frequency', datafield: 'DraftFreq', width: 180 }
            ];

        if (allFreqs + userFreqs + undrafted !== '') {
            window.$("[id^='jqxGridjqx']:eq(0)").jqxGrid({source: dataAdapter1});
            window.$("[id^='jqxGridjqx']:eq(1)").jqxGrid({source: dataAdapter2});
            window.$("[id^='jqxGridjqx']:eq(2)").jqxGrid({source: dataAdapter3});
        }

        return (
            <div className={"App"}>
                <h1 className={"App-header"}>Draft Simulator</h1>
                <div className={"Player-list-box-div"}>
                <JqxListBox ref='playerListbox'
                            width={250} height={300}
                            source={players} multiple={true} filterable={true} className={"Player-list-box"}/>
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
                <JqxTabs width={540} height={450} className={"Draft-results"}>
                    <ul>
                        <li style={{ marginLeft: 30 }}>All Players</li>
                        <li>Drafted Players</li>
                        <li>Undrafted Players</li>
                    </ul>
                    <div style={{ overflow: 'hidden' }}>
                        <JqxGrid style={{ border: 'none' }}
                            width={'100%'} height={'100%'} source={dataAdapter1} columns={tabSpecs}
                        />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <JqxGrid style={{ border: 'none' }}
                            width={'100%'} height={'100%'} source={dataAdapter2} columns={tabSpecs}
                        />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <JqxGrid style={{ border: 'none' }}
                            width={'100%'} height={'100%'} source={dataAdapter3} columns={tabSpecs}
                        />
                    </div>
                    </JqxTabs>
                </div>
                <div className={"Slider-labels"}>
                    <p>Number of teams per draft:</p>
                    <p>Your pick in the draft:</p>
                    <p>Number of rounds per draft:</p>
                </div>
                <div className={"Slider-div"}>
                    <JqxSlider ref='teamCountSlider'
                    height={55} width={400}
                    value={10} min={6} max={14} showTickLabels={true}
                    ticksFrequency={2} tooltip={true} mode={'fixed'} className={"Slider"}/>
                    <JqxSlider ref='pickOrderSlider'
                    height={55} width={400}
                    value={5} min={1} max={10} showTickLabels={true}
                    ticksFrequency={1} tooltip={true} mode={'fixed'} className={"Slider"}/>
                    <JqxSlider ref='roundCountSlider'
                    height={55} width={400}
                    value={16} min={1} max={16} showTickLabels={true}
                    ticksFrequency={15} showMinorTicks={true}
                    minorTicksFrequency={1} tooltip={true} mode={'fixed'} className={"Slider"}/>
                </div>
            </div>
        )
    }
}

export default App;
