function formatDate(dateString) {
    const re = new RegExp('(\\d+)-(\\d+)-(\\d+)');

    if (!dateString || !re.test(dateString)) {
        return 'Unknown';
    }

    const g = dateString.match(re);
    return `${g[2]}/${g[3]}/${g[1]}`;
}

export default {
    formatDate,
};
