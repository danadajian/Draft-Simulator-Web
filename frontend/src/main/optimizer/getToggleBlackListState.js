function getToggleBlackListState(playerIndex, state) {
    let {playerPool, lineup, whiteList, blackList} = state;
    let blackListedPlayer = playerPool[playerIndex];
    let playerInBlackList = blackList.find((player) => player.Id === blackListedPlayer.Id, null);
    if (playerInBlackList) {
        blackList.splice(blackList.indexOf(playerInBlackList), 1);
    } else {
        blackList.push(blackListedPlayer);
        let playerInWhiteList = whiteList.find((player) => player.Id === blackListedPlayer.Id, null);
        if (playerInWhiteList) {
            whiteList.splice(whiteList.indexOf(playerInWhiteList), 1);
        }
        let playerInLineup = lineup.find((player) => player.Id === blackListedPlayer.Id, null);
        if (playerInLineup) {
            lineup[lineup.indexOf(playerInLineup)] = {
                Position: playerInLineup.Position,
                Team: '',
                Name: '',
                Id: '',
                Status: '',
                Projected: '',
                Price: '',
                Opp: '',
                Weather: ''
            };
        }
    }
    return {
        lineup: lineup,
        whiteList: whiteList,
        blackList: blackList,
        filteredPool: null,
        searchText: ''
    }
}

export { getToggleBlackListState }