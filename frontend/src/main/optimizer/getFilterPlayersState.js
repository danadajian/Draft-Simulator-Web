function getFilterPlayersState(attribute, value, state) {
    let {playerPool, text} = state;
    let filteredPool;
    if (value === 'All') {
        return {
            searchText: '',
            filteredPool: playerPool
        }
    } else if (attribute === 'Name') {
        text = value.toLowerCase();
        filteredPool = playerPool.filter(
            (player) => player.Name.toLowerCase().includes(text.toLowerCase())
        );
    } else {
        filteredPool = playerPool.filter(
            (player) => player[attribute].includes(value)
        );
    }
    return {
        searchText: text,
        filteredPool: filteredPool
    }
}

export { getFilterPlayersState }