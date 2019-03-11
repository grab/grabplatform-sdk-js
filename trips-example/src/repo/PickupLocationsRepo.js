const pickupLocations = [
  {
    id: 'ARI',
    name: 'Ari Airline Airport',
  },
  {
    id: 'HRD',
    name: 'Hardik Harbor Airport'
  },
  {
    id: 'JSP',
    name: 'Cala-Big Airport'
  },
  {
    id: 'PRS',
    name: 'Prasan/Grabbito Regional Airport'
  },
  {
    id: 'ANI',
    name: 'Anil County International Airport (Grab Field)'
  },
  {
    id: 'JNG',
    name: 'Python–Django International Airport'
  },
  {
    id: 'GOL',
    name: 'Golang International Airport (Func Field)'
  },
  {
    id: 'JSC',
    name: 'Ecmascript Regional Airport'
  },
  {
    id: 'COB',
    name: 'Cobol Memorial Airport'
  },
  {
    id: 'MEG',
    name: 'Gigabyte Air Terminal (RAM Field)',
  },
];

function filterPickupLocations(destinationId) {
    return pickupLocations;
}

function getPickupLocation(n) {
    return pickupLocations[n];
}

export default {
    filterPickupLocations,
    getPickupLocation,
};
