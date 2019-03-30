import React from 'react';
import './App.css';
import PlayerListBox from './PlayerListBox';
import $ from 'jquery';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {players: [], userPlayers: [], isLoading: true};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        $.get((window.location.href.endsWith('draft-results'))
            ? window.location.href.slice(0, -13) + 'players': window.location.href + 'players', (data) => {
            const playerList = data.substring(2, data.length - 2).split(/', '|", '|', "/);
            this.setState({players: playerList, isLoading: false});
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
        this.refs.draftListbox.clear();

        let reorderedPlayers = [];
        let userItems = this.refs.userListbox.getItems();

        if (!userItems || userItems.length === 0) {
            this.refs.draftListbox.addItem('Please select at least one player to draft.');
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
                this.refs.draftListbox.clear();
                if (data === '[]') {
                    this.refs.draftListbox.addItem('No players were drafted. :(');
                } else {
                    const drafted_players = data.substring(3, data.length - 3).split(/', '|", '|', "/);
                    for (let i = 0; i < drafted_players.length; i++) {
                        this.refs.draftListbox.addItem(drafted_players[i]);
                    }
                }
            });
        };

        const getResults = async () => {
            const draftFinished = await getFromEndpoint();
        };

        this.refs.draftListbox.clear();
        this.setState({userPlayers: reorderedPlayers.toString()}, function () {
            this.refs.draftListbox.addItem('Drafting...');
            postPlayers();
            getResults();
        });

        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    render() {
        const {players, userPlayers, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading players from ESPN . . .</p>;
        }

        return (
            <div>
                <PlayerListBox ref='playerListbox' width={250} height={300}
                               source={players} multiple={true} className={"Player-list-box"}
                />
                <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove</button>
                <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                <PlayerListBox ref='userListbox' width={250} height={300}
                             source={userPlayers} multiple={true}
                             allowDrag={true} allowDrop={true} className={"User-list-box"}
                />
                <button onClick={this.simulateDraft} style={{fontSize: 16}} className={"Draft-button"}>Draft</button>
                <PlayerListBox ref='draftListbox' width={300} height={300}
                             source={['Draft Results appear here!']} className={"Draft-list-box"}
                />
            </div>
        )
    }
}

export default App;

// <img src={logo} className="App-logo" alt="logo"/>