import React, { Component } from 'react';
import './App.css';
import { Homepage } from "./Homepage";
import { Optimizer } from './optimizer/Optimizer'
import { Simulator } from "./simulator/Simulator";

class App extends Component {

    render() {
        if (window.location.pathname === '/home') {
            return <Homepage/>
        } else if (window.location.pathname === '/simulate') {
            return <Simulator/>
        } else if (window.location.pathname === '/optimize') {
            return <Optimizer/>
        }
    }
}

export default App;
