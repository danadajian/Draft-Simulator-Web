import { Optimizer } from '../main/optimizer/Optimizer'

describe('Lineup Ingestion', () => {
    it('can ingest dfs lineup', () => {
        let lineupJson = [[{'lineup1': 'fd'}, {'lineup2': 'fd'}], [{'lineup1': 'dk'}, {'lineup2': 'dk'}]];
        let sport = 'testSport';
        let prevSport = 'testPrevSport';
        let remove = false;
        expect(Optimizer.props.ingestDfsLineup(lineupJson, sport, prevSport, remove)).to.equal(
            {'fdLineup': [{'lineup1': 'fd'}, {'lineup2': 'fd'}], 'dkLineup': [{'lineup1': 'dk'}, {'lineup2': 'dk'}]}
        )
    });
});

