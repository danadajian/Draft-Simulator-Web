import { getRemoveFromLineupState } from '../main/optimizer/getRemoveFromLineupState'

describe('removes player to lineup', () => {
    test('can remove player', () => {
        let lineup = [
            {Position: 'QB', Team: '', Name: 'Player0', Id: 0, Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
            {Position: 'RB', Team: '', Name: 'Player1', Id: 1, Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
            {Position: 'RB', Team: '', Name: '', Id: '', Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
            {Position: 'FLEX', Team: '', Name: '', Id: '', Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
        ];
        let whiteList = [{Position: 'RB', Team: '', Name: 'Player1', Id: 1, Status: '', Projected: '', Price: '', Opp: '', Weather: ''}];
        let state = {lineup, whiteList};
        expect(getRemoveFromLineupState(1, state)).toMatchObject({
            lineup: [
                {Position: 'QB', Team: '', Name: 'Player0', Id: 0, Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
                {Position: 'RB', Team: '', Name: '', Id: '', Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
                {Position: 'RB', Team: '', Name: '', Id: '', Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
                {Position: 'FLEX', Team: '', Name: '', Id: '',Status: '', Projected: '', Price: '', Opp: '', Weather: ''},
            ],
            whiteList: []
        });
    });
});