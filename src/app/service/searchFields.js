function generateSearchFields(properties) {
    const types = []
    const cities = {}
    properties.forEach((item) => {
        if (!types.includes(item.type)) {
            types.push(item.type);
        }

        const { city = '', neighborhood = '' } = item.fullAddress || {};
        if (city && neighborhood) {
            if (!cities[city]) {
                cities[city] = new Set();
            }
            cities[city].add(neighborhood);
        }

    });

    Object.keys(cities).forEach((city) => {
        cities[city] = Array.from(cities[city])
    })
    return { types, cities }
}

module.exports = generateSearchFields;