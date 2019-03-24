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

        $.get(window.location.href + 'players', (data) => {
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

        let totalPlayers = currentPlayers + playersToAdd;
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

    render() {
        const {players, userPlayers, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading players from ESPN . . .</p>;
        }

        return (
            <div>
                <PlayerListBox ref='playerListbox'
                               width={250} height={300}
                               source={players} multiple={true}
                               multipleextended={true}
                               className={"Player-list-box"}
                />
                <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove</button>
                <button onClick={this.clearPlayers} style={{fontSize: 16}} className={"Clear-button"}>Clear</button>
                <PlayerListBox ref='userListbox'
                             width={250} height={300}
                             source={userPlayers} multiple={true} multipleextended={true}
                             allowDrag={true} allowDrop={true}
                             className={"User-list-box"}
                />
            </div>
        )
    }
}

export default App;

// <img src={logo} className="App-logo" alt="logo"/>