import React from 'react';
import logo from './logo.svg';
import './App.css';
import PlayerListBox from './PlayerListBox';
import $ from 'jquery';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {players: [], isLoading: true};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        $.get(window.location.href + 'players', (data) => {
            const player_list = data.substring(2, data.length - 2).split(/', '|", '|', "/);
            this.setState({players: player_list, isLoading: false});
        });

        // this.refs.playerListbox.selectIndex(2);
        // this.refs.playerListbox.selectIndex(5);
        // this.refs.playerListbox.selectIndex(7);
        // this.displaySelectedItems();
        // this.refs.playerListbox.on('change', () => {
        //     this.displaySelectedItems();
        // });
    }

    displaySelectedItems() {
        let items = this.refs.playerListbox.getSelectedItems();
        let selection = 'Selected Items: ';
        for (let i = 0; i < items.length; i++) {
            selection += items[i].label + (i < items.length - 1 ? ', ' : '');
        }
        document.getElementById('selectionLog').innerHTML = selection;

        // let items2 = this.refs.userListbox.getSelectedItems();
        // let selection2 = 'Selected Items: ';
        // for (let i = 0; i < items2.length; i++) {
        //     selection2 += items2[i].label + (i < items2.length - 1 ? ', ' : '');
        // }
        // document.getElementById('selectionLog2').innerHTML = selection2;
    }

    // <img src={logo} className="App-logo" alt="logo"/>

    render() {
        const {players, isLoading} = this.state;

        console.log(players);

        if (isLoading) {
            return <p>Loading players from ESPN . . .</p>;
        }

        return (
            <div>
                <PlayerListBox ref='playerListbox'
                               width={250} height={250}
                               source={players} multiple={true}
                               className={"Player-list-box"}
                />
                <div style={{marginTop: 30, fontSize: 13, fontFamily: 'Verdana'}} id='selectionLog'/>
                <PlayerListBox ref='userListbox'
                             width={250} height={250}
                             multiple={true}
                             className={"User-list-box"}
                />
                <div style={{marginTop: 30, fontSize: 13, fontFamily: 'Verdana'}} id='selectionLog2'/>
            </div>
        )
    }
}

export default App;
