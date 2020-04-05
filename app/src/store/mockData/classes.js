const classes = {
  0: {
    id: 0,
    name: "Basic Guitar",
    time: Date.now(),
    length: "60", // Store classLength in minutes can show otherwise in hours as needed
    provider: {
      name: "Guitar Studio 1", // Name of the provider
      id: 123
    },
    location: {
      coordinates: "1.300649, 103.855453",
      address: "249B Victoria St, Bugis Village"
    },
    pictureSources: [
      "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
    ]
  },
  1: {
    id: 1,
    name: "Advanced Cooking",
    time: Date.now() + 1000000,
    length: "150", // Store classLength in minutes can show otherwise in hours as needed
    provider: {
      name: "Tampines CC", // Name of the providerx
      id: 456
    },
    location: {
      coordinates: "1.302481, 103.855448",
      address: "117 Fidelio St"
    },
    pictureSources: [
      "https://www.fetimes.co.kr/news/photo/201709/60017_41960_2138.jpg"
    ]
  }
};

const upcomingClassesID = {
  0: true,
  1: true
};

const favouriteClassesID = {
  1: true
};

module.exports = { classes, upcomingClassesID, favouriteClassesID };
