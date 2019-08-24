import React, { Component } from 'react';
import './App.css';

export class Homepage extends Component {

    render() {
        return (
                <div className={'Home'}>
                    <h1 className={'Home-header'}>Welcome to Draft Simulator!</h1>
                    <h3 className={'Dfs-header'}>To start, click the link below:</h3>
                    <div className={"Home-buttons"}>
                    <button onClick={() => {window.location.href = window.location.origin + '/simulate'}}
                            className={'Site-button'}>Simulator</button>
                    </div>
                    <h3 className={'Dfs-header'}>Or, check out our DFS Optimizer:</h3>
                    <button onClick={() => {window.location.href = window.location.origin + '/optimize'}}
                            className={'Dfs-button'}>DFS Optimizer</button>
                    <button onClick={() => {window.location.href = window.location.origin + '/logout'}}
                            className={'Logout-button'}>Log Out</button>
                </div>
        )
    }

}