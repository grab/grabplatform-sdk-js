const destinations = [{
    imageUri: '/images/valentines-special.jpg',
    title: 'Riverwalk Inn',
    description: '#1 Best Value of 8 B&Bs in Grabban',
    id: 0, 
}, {
    imageUri: '/images/amsterdam-architectural-design-architecture.jpg',
    title: 'Lake View Hotel',
    description: '#2 Best Value of 8 B&Bs in Grabban',
    id: 1, 
}, {
    imageUri: '/images/apartment-bed-bedroom.jpg',
    title: 'Run of the Rideshare',
    description: '34.9 miles from Grabban',
    id: 2, 
}, {
    imageUri: '/images/architectural-design-architecture-beach.jpg',
    title: 'Lake\'s Edge Grabban Lodge',
    description: '#1 of 3 B&Bs in Grabbonia',
    id: 3, 
}, {
    imageUri: '/images/architecture-beach-building.jpg',
    title: 'The Inn at Grabbster Sands',
    description: '#1 of 1 B&B in Grabbster',
    id: 4, 
}, {
    imageUri: '/images/architecture-blue-water-buildings.jpg',
    title: 'Blue Waters Inn',
    description: '#1 of 3 B&Bs in Grabbatchee',
    id: 5, 
}, {
    imageUri: '/images/architecture-buildings-business.jpg',
    title: 'Business Time Hotel',
    description: '#11 of 22 Hotels in Grabbenworth',
    id: 6, 
}, {
    imageUri: '/images/architecture-bungalow-dug-out-pool.jpg',
    title: 'Grabbenworth Inn',
    description: '#15 of 22 B&Bs in Grabbenworth',
    id: 7, 
}, {
    imageUri: '/images/architecture-chair-contemporary.jpg',
    title: 'Grabbenworth Village Inn',
    description: '#9 of 22 B&Bs in Grabbenworth',
    id: 8, 
}, {
    imageUri: '/images/bed-bedroom-blue.jpg',
    title: 'Grabbendblume',
    description: '#5 of 22 B&Bs in Grabbenworth',
    id: 9, 
}, {
    imageUri: '/images/bed-bedroom-clean.jpg',
    title: 'Grabbenworth Yoga Hotel',
    description: '#1 of 22 B&Bs in Grabbenworth',
    id: 10, 
}, {
    imageUri: '/images/bed-bedroom-cozy.jpg',
    title: 'Grab Hills Inn',
    description: '#2 of 22 B&Bs in Grabbenworth',
    id: 11, 
}, {
    imageUri: '/images/blue-exotic-hotel.jpg',
    title: 'Grabban Luxury Hotel',
    description: '#1 of 5 Hotels in Grabban',
    id: 12, 
}, {
    imageUri: '/images/building-high-rise-hotel.jpg',
    title: 'Highrise Hotel',
    description: '#1 of 20 Hotels in Grabbonia',
    id: 13, 
}, {
    imageUri: '/images/bulbs-cafe-chairs.jpg',
    title: 'Grabbata Inn Motel',
    description: '#1 of 1 B&B in Grabbata',
    id: 14, 
}, {
    imageUri: '/images/dug-out-pool-hotel-pool.jpg',
    title: 'Grabbonia Inn',
    description: '#2 of 10 B&Bs in Grabbonia',
    id: 15, 
}];

// function returns a promise with an array of destinations
export function filterDestinations(selectedDate) {
    console.log(`Filtering destinations for ${selectedDate}`);
    // We transform the string into an arraybuffer.
    var buffer = new TextEncoder("utf-8").encode(selectedDate);
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
        if (!selectedDate) {
            return [];
        }
        const hashArray = Array.from(new Uint8Array(hash));
        const modulo1 = hashArray[0] % 5;
        const modulo2 = hashArray[1] % 7;
        const modulo3 = hashArray[2] % 9;
        let returnDestinations = [];
        for (let i = 0; i < destinations.length; i += 1) {
            if (i % 5 === modulo1 || i % 7 === modulo2 || i % 9 === modulo3) {
                returnDestinations.push(destinations[i]);
            }
        }
        console.log(`Generated ${returnDestinations.length} destinations.`)
        return returnDestinations;
    });          
}

export function getDestination(num) {
    return destinations[num];
}
