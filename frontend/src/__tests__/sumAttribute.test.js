import { sumAttribute } from '../main/optimizer/sumAttribute'

describe('sums attributes correctly', () => {
    test('attributes included', () => {
        let lineup = [{'Projected': 6.1}, {'Projected': 7.2}, {'Projected': 8.3}];
        expect(sumAttribute(lineup, 'Projected')).toEqual(6.1 + 7.2 + 8.3);
    });

    test('attribute omitted', () => {
        let lineup = [{'Projected': 6.1}, {'Projected': ''}, {'Projected': 8.3}];
        expect(sumAttribute(lineup, 'Projected')).toEqual(6.1 + 8.3);
    });
});