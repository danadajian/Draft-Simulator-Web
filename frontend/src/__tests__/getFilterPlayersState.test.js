import { getFilterPlayersState } from '../main/optimizer/getFilterPlayersState'

describe('filters by attribute', () => {
    test('filters by Name attribute', () => {
        let playerPool = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player1', Id: 1, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'},
        {Name: 'Player5', Id: 5, Position: 'RB'}
        ];
        let text = 'test';
        let state = {playerPool, text};
        expect(getFilterPlayersState('Name', '4', state)).toMatchObject({
            searchText: '4',
            filteredPool: [
            {Name: 'Player4', Id: 4, Position: 'RB'}
            ]
        });
    });
    test('filters by non-Name attribute', () => {
        let playerPool = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player1', Id: 1, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'},
        {Name: 'Player5', Id: 5, Position: 'RB'}
        ];
        let text = 'test';
        let state = {playerPool, text};
        expect(getFilterPlayersState('Position', 'RB', state)).toMatchObject({
            searchText: 'test',
            filteredPool: [
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB'}
            ]
        });
    });
    test('filters by all attributes', () => {
        let playerPool = [
        {Name: 'Player0', Id: 0, Position: 'QB'},
        {Name: 'Player1', Id: 1, Position: 'QB'},
        {Name: 'Player2', Id: 2, Position: 'RB'},
        {Name: 'Player3', Id: 3, Position: 'RB'},
        {Name: 'Player4', Id: 4, Position: 'RB'},
        {Name: 'Player5', Id: 5, Position: 'RB'}
        ];
        let text = 'test';
        let state = {playerPool, text};
        expect(getFilterPlayersState('Position', 'All', state)).toMatchObject({
            searchText: '',
            filteredPool: [
            {Name: 'Player0', Id: 0, Position: 'QB'},
            {Name: 'Player1', Id: 1, Position: 'QB'},
            {Name: 'Player2', Id: 2, Position: 'RB'},
            {Name: 'Player3', Id: 3, Position: 'RB'},
            {Name: 'Player4', Id: 4, Position: 'RB'},
            {Name: 'Player5', Id: 5, Position: 'RB'}
            ]
        });
    });
});