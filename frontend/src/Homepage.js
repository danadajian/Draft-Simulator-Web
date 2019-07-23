import React, { Component } from 'react';
import './App.css';

export class Homepage extends Component {

    render() {
        return (
                <div className={'Home'}>
                    <h1 className={'Home-header'}>Welcome to Draft Simulator!</h1>
                    <h3 className={'Dfs-header'}>To start, choose a draft site:</h3>
                    <div className={"Home-buttons"}>
                    <button onClick={() => {window.location.href = window.location.origin + '/espn'}}
                            className={'Site-button'}>ESPN</button>
                    <button onClick={() => {window.location.href = window.location.origin + '/yahoo'}}
                            className={'Site-button'}>Yahoo</button>
                    </div>
                    <h3 className={'Dfs-header'}>Or, check out our DFS Optimizer:</h3>
                    <button onClick={() => {window.location.href = window.location.origin + '/dfs-optimizer'}}
                            className={'Dfs-button'}>DFS Optimizer</button>
                    <button onClick={() => {window.location.href = window.location.origin + '/logout'}}
                            className={'Logout-button'}>Log Out</button>
                </div>
        )
    }

}