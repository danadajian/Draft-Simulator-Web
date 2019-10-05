function sumAttribute(lineup, attribute) {
    let attributeArray = lineup.map((player) => ((player[attribute]) ? parseFloat(player[attribute]) : 0));
    return attributeArray.reduce((a,b) => a + b, 0);
}

export { sumAttribute }