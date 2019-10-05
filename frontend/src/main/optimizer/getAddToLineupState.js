function getAddToLineupState(playerIndex, state) {
    let {playerPool, lineup, whiteList, blackList} = state;
    let playerToAdd = playerPool[playerIndex];
    let playerInLineup = lineup.find((player) => player.Id === playerToAdd.Id, null);
    if (playerInLineup) {
        return 'Player already added to lineup.'
    }
    let spotsToReplace = lineup.filter(
        (player) =>
            (playerToAdd.Position === player.Position && !player.Name)
            || (['RB', 'WR', 'TE'].includes(playerToAdd.Position) && player.Position === 'FLEX' && !player.Name)
    );
    if (spotsToReplace.length === 0) {
        return 'Not enough positions available to add player.'
    } else {
        whiteList.push(playerToAdd);
        let playerInBlackList = blackList.find((player) => player.Id === playerToAdd.Id, null);
        if (playerInBlackList) {
            blackList.splice(blackList.indexOf(playerInBlackList), 1);
        }
        let spotToReplace = spotsToReplace[0];
        let lineupIndex = lineup.indexOf(spotToReplace);
        let playerToAddCopy = JSON.parse(JSON.stringify(playerToAdd));
        playerToAddCopy.Position = spotToReplace.Position;
        lineup[lineupIndex] = playerToAddCopy;
        return {
            lineup: lineup,
            whiteList: whiteList,
            blackList: blackList,
            filteredPool: null,
            searchText: ''
        }
    }
}

export { getAddToLineupState }
