const moment = require("moment");

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
    2: true,
    1: true,
  },
};

const pastClassesID = {
  2: true,
};

module.exports = {
  reviews,
  schedule,
  upcomingClassesID,
  favourites,
  pastClassesID,
};
