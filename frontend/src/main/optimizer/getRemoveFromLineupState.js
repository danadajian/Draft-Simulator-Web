function getRemoveFromLineupState(lineupIndex, state) {
    let {lineup, whiteList} = state;
    let playerToRemove = lineup[lineupIndex];
    let playerInWhiteList = whiteList.find((player) => player.Id === playerToRemove.Id, null);
    if (playerInWhiteList) {
        whiteList.splice(whiteList.indexOf(playerInWhiteList), 1);
    }
    lineup[lineupIndex] = {
        Position: playerToRemove.Position,
        Team: '',
        Name: '',
        Id: '',
        Status: '',
        Projected: '',
        Price: '',
        Opp: '',
        Weather: ''
    };
    return {
        lineup: lineup,
        whiteList: whiteList
    }
}

export { getRemoveFromLineupState }