import React, { Component } from 'react';
import './App.css';
import { Homepage } from "./Homepage";
import { Optimizer } from './Optimizer'
import { Simulator } from "./Simulator";

class App extends Component {

    render() {
        if (window.location.pathname === '/home') {
            return <Homepage/>
        } else if (['/espn', '/yahoo'].includes(window.location.pathname)) {
            return <Simulator/>
        } else if (window.location.pathname === '/dfs-optimizer') {
            return <Optimizer/>
        }
    }
}

export default App;
