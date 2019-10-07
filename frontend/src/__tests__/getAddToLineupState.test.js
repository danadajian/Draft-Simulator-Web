import { getAddToLineupState } from '../main/optimizer/getAddToLineupState'

describe('adds player to lineup', () => {
    let playerPool = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player1', Id: 1, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'},
        {Name: 'Player5', Id: 5, Position: 'RB'}
        ];
    let whiteList = [];
    let blackList = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'}
        ];
    test('player already added', () => {
        let lineup = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'FLEX'}
        ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(0, state)).toEqual('Player already added to lineup.');
    });
    test('not enough non-flex positions available', () => {
        let lineup = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'FLEX'}
        ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(1, state)).toEqual('Not enough positions available to add player.');
    });
    test('not enough flex positions available', () => {
        let lineup = [
            {Name: '', Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'}
        ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(5, state)).toEqual('Not enough positions available to add player.');
    });
    test('can add non-flex position', () => {
        let playerPool = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player1', Id: 1, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'},
        {Name: 'Player5', Id: 5, Position: 'RB'}
        ];
        let whiteList = [];
        let blackList = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'}
            ];
        let lineup = [
            {Name: '', Id: '', Position: 'QB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'FLEX'}
        ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(0, state)).toMatchObject({
            lineup: [
                {Name: 'Player0', Position: 'QB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'FLEX'}
            ],
            whiteList: [{Name: 'Player0', Position: 'QB'}],
            blackList: [
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player3', Id: 3, Position: 'RB'},
                {Name: 'Player4', Id: 4, Position: 'RB'}
                ],
            filteredPool: null,
            searchText: ''
        });
    });
    test('can add flex position to non-flex spot', () => {
        let lineup = [
                {Name: '', Id: '', Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'FLEX'}
                ];
        let playerPool = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player1', Id: 1, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB'}
            ];
        let whiteList = [];
        let blackList = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'}
            ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(3, state)).toMatchObject({
            lineup: [
                {Name: '', Id: '', Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player3', Id: 3, Position: 'RB'},
                {Name: '', Id: '', Position: 'FLEX'}
            ],
            whiteList: [{Name: 'Player3', Position: 'RB'}],
            blackList: [
                {Name: 'Player0', Id: 0, Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player4', Id: 4, Position: 'RB'}
                ],
            filteredPool: null,
            searchText: ''
        });
    });
    test('can add flex position to flex spot', () => {
        let lineup = [
            {Name: '', Id: '', Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: '', Id: '', Position: 'FLEX'}
        ];
        let playerPool = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player1', Id: 1, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB'}
            ];
        let whiteList = [];
        let blackList = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'}
            ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(playerPool[4]).toMatchObject({Name: 'Player4', Position: 'RB'});
        expect(getAddToLineupState(4, state)).toMatchObject({
            lineup: [
                {Name: '', Id: '', Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player3', Id: 3, Position: 'RB'},
                {Name: 'Player4', Id: 4, Position: 'FLEX'}
            ],
            whiteList: [{Name: 'Player4', Id: 4, Position: 'RB'}],
            blackList: [
                {Name: 'Player0', Id: 0, Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player3', Id: 3, Position: 'RB'}
            ],
            filteredPool: null,
            searchText: ''
        });
    });
    test('can add player to multi-position spot', () => {
        let lineup = [
            {Name: '', Id: '', Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: '', Id: '', Position: 'RB/WR'}
        ];
        let playerPool = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player1', Id: 1, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'WR'}
            ];
        let whiteList = [];
        let blackList = [];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(5, state)).toMatchObject({
            lineup: [
                {Name: '', Id: '', Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player3', Id: 3, Position: 'RB'},
                {Name: 'Player5', Id: 5, Position: 'RB/WR'}
            ],
            whiteList: [{Name: 'Player5', Id: 5, Position: 'WR'}],
            blackList: [],
            filteredPool: null,
            searchText: ''
        });
    });
    test('can add multi-position player', () => {
        let lineup = [
            {Name: '', Id: '', Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: '', Id: '', Position: 'WR'}
        ];
        let playerPool = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player1', Id: 1, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB/WR'}
            ];
        let whiteList = [];
        let blackList = [];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getAddToLineupState(5, state)).toMatchObject({
            lineup: [
                {Name: '', Id: '', Position: 'QB'},
                {Name: 'Player2', Id: 2, Position: 'RB'},
                {Name: 'Player3', Id: 3, Position: 'RB'},
                {Name: 'Player5', Id: 5, Position: 'WR'}
            ],
            whiteList: [{Name: 'Player5', Id: 5, Position: 'RB/WR'}],
            blackList: [],
            filteredPool: null,
            searchText: ''
        });
    });
});
