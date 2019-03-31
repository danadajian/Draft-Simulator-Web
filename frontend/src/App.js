import React from 'react';
import './App.css';
import JqxListBox from './react_jqxlistbox';
import JqxGrid from './react_jqxgrid'
import JqxTabs from './react_jqxtabs'
import $ from 'jquery';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true, players: [], userPlayers: [], allFreqs: '', userFreqs: ''};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        $.get((window.location.href.endsWith('draft-results'))
            ? window.location.href.slice(0, -13) + 'players': window.location.href + 'players', (data) => {
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
        }

        let totalPlayers = (currentPlayers.length > 0) ? currentPlayers + ',' + playersToAdd: currentPlayers + playersToAdd;
        this.setState({userPlayers: totalPlayers});

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
        let reorderedPlayers = [];
        let userItems = this.refs.userListbox.getItems();

        if (!userItems || userItems.length === 0) {
            alert('Please select at least one player to draft.');
            return;
        }
        for (let i = 0; i < userItems.length; i++) {
            reorderedPlayers.push(userItems[i].label);
        }

        const postToEndpoint = async () => {
            return await $.post(window.location.href + 'draft-results', this.state.userPlayers);
        };

        const postPlayers = async () => {
            const postFinished = await postToEndpoint();
        };

        const getFromEndpoint = async () => {
            return await $.get(window.location.href + 'draft-results', (data) => {
                if (data === '[]') {
                    alert('No players were drafted. :(');
                } else {
                    const output = data.split('|');
                    this.setState({allFreqs: output[0].toString(), userFreqs: output[1].toString()});
                }
            });
        };

        const getResults = async () => {
            const draftFinished = await getFromEndpoint();
        };

        this.setState({userPlayers: reorderedPlayers.toString()}, function () {
            // Drafting...
            const playersArePosted = async () => {
                return await postPlayers();
            };
            const draftPlayers = async () => {
                const ready = await playersArePosted();
                getResults();
            };
            draftPlayers();
        });

        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    render() {
        const {isLoading, players, userPlayers, allFreqs, userFreqs} = this.state;

        if (isLoading) {
            return <p>Loading players from ESPN . . .</p>;
        }

        let source1 =
            {
                datatype: 'json',
                datafields: [
                    { name: 'Player', type: 'string' },
                    { name: 'Position', type: 'string' },
                    { name: 'DraftFreq', type: 'string' }
                ],
                localdata: allFreqs
            };

        let dataAdapter1 = new window.$.jqx.dataAdapter(source1);

        let source2 =
            {
                datatype: 'json',
                datafields: [
                    { name: 'Player', type: 'string' },
                    { name: 'Position', type: 'string' },
                    { name: 'DraftFreq', type: 'string' }
                ],
                localdata: userFreqs
            };

        let dataAdapter2 = new window.$.jqx.dataAdapter(source2);

        let tabSpecs =
            [
                { text: 'Player', datafield: 'Player', width: 250 },
                { text: 'Position', datafield: 'Position', width: 150 },
                { text: 'Draft Frequency', datafield: 'DraftFreq', width: 180 }
            ];

        if (allFreqs + userFreqs !== '') {
            window.$("[id^='jqxGridjqx']:first").jqxGrid(
                {
                    source: dataAdapter1
                });
            window.$("[id^='jqxGridjqx']:last").jqxGrid(
                {
                    source: dataAdapter2
                });
        }

        return (
            <div>
                <div>
                <JqxListBox ref='playerListbox' width={250} height={300}
                               source={players} multiple={true} className={"Player-list-box"}
                />
                <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove</button>
                <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                <JqxListBox ref='userListbox' width={250} height={300}
                             source={userPlayers} multiple={true}
                             allowDrag={true} allowDrop={true} className={"User-list-box"}
                />
                <button onClick={this.simulateDraft} style={{fontSize: 16}} className={"Draft-button"}>Draft</button>
                </div>
                <div>
                <JqxTabs ref='draftGrid' width={600} height={560}>
                <ul>
                    <li style={{ marginLeft: 30 }}>All Players</li>
                    <li>Your Players</li>
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
                </JqxTabs>
                </div>
            </div>
        )
    }
}

export default App;

// <img src={logo} className="App-logo" alt="logo"/>