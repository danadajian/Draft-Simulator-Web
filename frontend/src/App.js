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
        // this.refs.playerListbox.selectIndex(2);
        // this.refs.playerListbox.selectIndex(5);
        // this.refs.playerListbox.selectIndex(7);
        // this.displaySelectedItems();
        // this.refs.playerListbox.on('change', () => {
        //     this.displaySelectedItems();
        // });

    addPlayers = () => {
        let selectedItems = this.refs.playerListbox.getSelectedItems();
        let userItems = this.refs.userListbox.getItems();
        let userNames = [];
        for (let i = 0; i < userItems.length; i++) {
            userNames.push(userItems[i].label)
        }

        for (let i = 0; i < selectedItems.length; i++) {
            if (!userItems.includes(selectedItems[i].label)) {
                this.refs.userListbox.addItem(selectedItems[i].label);
            }
        }

        this.refs.playerListbox.clearSelection();
        this.refs.userListbox.clearSelection();
    };

    removePlayers = () => {
        let selectedUserItems = this.refs.userListbox.getSelectedItems();
        if (selectedUserItems[0].label) {
            for (let i = 0; i < selectedUserItems.length; i++) {
                this.refs.userListbox.removeItem(selectedUserItems[i].label);
            }
        }
    };

    // <img src={logo} className="App-logo" alt="logo"/>

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
                               className={"Player-list-box"}
                />
                <button onClick={this.addPlayers} style={{fontSize: 16}} className={"Add-button"}>Add</button>
                <button onClick={this.removePlayers} style={{fontSize: 16}} className={"Remove-button"}>Remove</button>
                <PlayerListBox ref='userListbox'
                             width={250} height={300}
                             source={userPlayers} multiple={true}
                             allowDrag={true} allowDrop={true}
                             className={"User-list-box"}
                />
            </div>
        )
    }
}

export default App;
