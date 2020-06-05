const moment = require("moment");

const partners = {
  3: {
    id: 3,
    name: "Guitar Studio 1",
    location: {
      coordinates: "1.300649, 103.855453",
      address: "249B Victoria St, Bugis Village",
    },
    description: "Get started on your Guitar journey with us!",
    pictureSources: [
      "https://rezaglobalpro.com/wp-content/uploads/Reza-Global-Productions-Music-Studio-3.2-1.jpg",
    ],
  },
  1: {
    id: 1,
    name: "Tampines CC",
    location: {
      coordinates: "1.348979, 103.935787",
      address: "5 Tampines Ave 3",
    },
    description:
      "Located in the Heartlands of Tampines, we offer a wide variety of classes for our residents.",
    pictureSources: [
      "https://www.pa.gov.sg/images/default-source/module/community-clubs/tampines-west-community-club",
    ],
  },
  2: {
    id: 2,
    name: "Guitar Studio 2",
    location: {
      coordinates: "1.3006954, 103.84475",
      address: "Orchard road, Plaza Singapura",
    },
    description:
      "We offer world class guitar lessons for you!<br />Guitar Studio 2 is one of the leading Guitar Studios in Singapore and South East Asia boasting a whole list of celebrity instructors for you to learn more. We believe that the best instructors are what you need to get from amatuer  to pro just like the instructors themselves!",
    pictureSources: [
      "https://media.timeout.com/images/105537588/630/472/image.jpg",
    ],
  },
};

const reviews = {
  3: {
    classID: 3,
    ratings: 4, // Ratings out of 5 stars
    numberOfReviews: 2, // The reason why this is seperate instead of doing a userReviews.length is because userReviews may be too long and we do not want to load the whole thing at once and only the latest until the user scrolls for more.
    userReviews: [
      {
        points: 4,
        description: "Was really fun!",
        timestamp: 1584702021,
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702019,
      },
    ],
  },
  1: {
    classID: 1,
    ratings: 4.3, // Ratings out of 5 stars
    numberOfReviews: 2,
    userReviews: [
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702021,
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702019,
      },
    ],
  },
  2: {
    classID: 2,
    ratings: 4.8, // Ratings out of 5 stars
    numberOfReviews: 7,
    userReviews: [
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702021,
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702019,
      },
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702018,
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702016,
      },
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702015,
      },
      {
        points: 5,
        description: "Ichika is a great teacher!",
        timestamp: 1584702014,
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702013,
      },
    ],
  },
};

const schedule = {
  0: {
    classID: 0,
  },
  1: {
    classID: 1,
  },
  2: {
    classID: 2,
  },
};

const upcomingClassesID = {
  0: true,
};

const favourites = {
  classes: {
    1: true,
    2: true,
  },
  partners: {
    0: true,
    1: true,
  },
};

const pastClassesID = {
  2: true,
};

module.exports = {
  partners,
  reviews,
  schedule,
  upcomingClassesID,
  favourites,
  pastClassesID,
};
