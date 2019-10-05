import { getToggleBlackListState } from '../main/optimizer/getToggleBlackListState'

describe('can toggle blacklist', () => {
    test('adds player to blacklist', () => {
        let playerPool = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player1', Id: 1, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'},
        {Name: 'Player5', Id: 5, Position: 'RB'}
        ];
        let whiteList = [{Name: 'Player5', Id: 5, Position: 'RB'}];
        let blackList = [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'}
            ];
        let lineup = [
            {Name: '', Id: '', Position: 'QB'},
            {Name: 'Player5', Id: 5, Position: 'RB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'FLEX'}
        ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getToggleBlackListState(5, state)).toMatchObject({
            lineup: [
                {Name: '', Id: '', Position: 'QB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'FLEX'}
            ],
            whiteList: [],
            blackList: [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB'}
            ],
            filteredPool: null,
            searchText: ''
        });
    });
    test('removes player from blacklist', () => {
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
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB'}
            ];
        let lineup = [
            {Name: '', Id: '', Position: 'QB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'RB'},
            {Name: '', Id: '', Position: 'FLEX'}
        ];
        let state = {playerPool, lineup, whiteList, blackList};
        expect(getToggleBlackListState(5, state)).toMatchObject({
            lineup: [
                {Name: '', Id: '', Position: 'QB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'RB'},
                {Name: '', Id: '', Position: 'FLEX'}
            ],
            whiteList: [],
            blackList: [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'}
            ],
            filteredPool: null,
            searchText: ''
        });
    });
});