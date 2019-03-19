import React from 'react';
import logo from './logo.svg';
import './App.css';
import JqxListBox from './JqxListBox';
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
            // console.log(data);
        });

        // this.refs.myListBox.selectIndex(2);
        // this.refs.myListBox.selectIndex(5);
        // this.refs.myListBox.selectIndex(7);
        // this.displaySelectedItems();
        // this.refs.myListBox.on('change', () => {
        //     this.displaySelectedItems();
        // });
    }

    displaySelectedItems() {
        let items = this.refs.myListBox.getSelectedItems();
        let selection = 'Selected Items: ';
        for (let i = 0; i < items.length; i++) {
            selection += items[i].label + (i < items.length - 1 ? ', ' : '');
        }
        document.getElementById('selectionLog').innerHTML = selection;
    }

    render() {
        const {players, isLoading} = this.state;

        console.log(players);

        if (isLoading) {
            return <p>Loading players from ESPN . . .</p>;
        }

        return (
            <div>
                <JqxListBox ref='myListBox'
                    width={200} height={250}
                    source={players} multiple={true}
                />
                <div style={{ marginTop: 30, fontSize: 13, fontFamily: 'Verdana' }} id='selectionLog' />
                <img src={logo} className="App-logo" alt="logo" />
            </div>
        )
    }
}

export default App;
