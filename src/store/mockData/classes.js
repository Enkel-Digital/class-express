const classes = {
  0: {
    id: 0,
    className: "Basic Guitar",
    favouritedClass: true,
    time: Date.now(),
    classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
    classProvider: {
      name: "Guitar Studio 1", // Name of the provider
      id: 123
    },
    location: {
      coordinates: "1.300649, 103.855453",
      address: "249B Victoria St, Bugis Village"
    }
  },
  1: {
    id: 1,
    className: "Advanced Cooking",
    favouritedClass: false,
    time: Date.now() + 1000000,
    classLength: "150", // Store classLength in minutes can show otherwise in hours as needed
    classProvider: {
      name: "Tampines CC", // Name of the providerx
      id: 456
    },
    location: {
      coordinates: "1.302481, 103.855448",
      address: "117 Fidelio St"
    }
  }
};

const upcomingClassesID = [0, 1];

module.exports = { classes, upcomingClassesID };
