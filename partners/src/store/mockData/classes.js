// import moment from "moment";

const classes = {
  0: {
    id: 0,
    name: "Basic Guitar",
    points: 5,
    time: Date.now(),
    length: 60, // Store classLength in minutes can show otherwise in hours as needed
    description:
      "Basic guitar lessons to help you get started with this wonderful musical instrument! This class covers all the basics from score reading to strumming techniques.",
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
    points: 6,
    time: Date.now() + 1000000,
    length: 150, // Store classLength in minutes can show otherwise in hours as needed
    description:
      "Like cooking but always feel like you are missing a magical ingredient? Well join our class to learn more and get ready to be amazed.",
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
  },
  2: {
    id: 2,
    name: "Advanced Guitar",
    points: 8,
    time: Date.now() + 1000000,
    length: 60, // Store classLength in minutes can show otherwise in hours as needed
    description:
      "Advance guitar lessons taught be the legendary Ichika Mo.<br />Will be going through advanced music scores and includes 1 on 1 trainings for the students, alongside a chance to practice in front of a live audience",
    provider: {
      name: "Guitar Studio 2", // Name of the provider
      id: 123,
      description: "We offer world class guitar lessons for you!"
    },
    location: {
      coordinates: "1.3006954, 103.84475",
      address: "Orchard road, Plaza Singapura"
    },
    pictureSources: [
      "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
    ]
  }
};

const reviews = {
  0: {
    classID: 0,
    ratings: 4, // Ratings out of 5 stars
    numberOfReviews: 2, // The reason why this is seperate instead of doing a userReviews.length is because userReviews may be too long and we do not want to load the whole thing at once and only the latest until the user scrolls for more.
    userReviews: [
      {
        points: 4,
        description: "Was really fun!",
        timestamp: 1584702021
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702019
      }
    ]
  },
  1: {
    classID: 1,
    ratings: 4.3, // Ratings out of 5 stars
    numberOfReviews: 2,
    userReviews: [
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702021
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702019
      }
    ]
  },
  2: {
    classID: 2,
    ratings: 4.8, // Ratings out of 5 stars
    numberOfReviews: 7,
    userReviews: [
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702021
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702019
      },
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702018
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702016
      },
      {
        points: 5,
        description: "Was really fun!",
        timestamp: 1584702015
      },
      {
        points: 5,
        description: "Ichika is a great teacher!",
        timestamp: 1584702014
      },
      {
        points: 4,
        description: "Love the open classroom environment",
        timestamp: 1584702013
      }
    ]
  }
};

// const schedule = {
//   0: {
//     classID: 0,
//     [Math.trunc(Date.now() / 1000)]: [
//       {
//         time: {
//           start: 1586345838,
//           end: 1586350000
//         }
//       }
//     ],
//     [Math.trunc(Date.now() / 1000 + 86400)]: [],
//     [Math.trunc(Date.now() / 1000 + 86400 + 86400)]: []
//   },
//   1: {
//     classID: 1
//   },
//   2: {
//     classID: 2
//   }
// };

const upcomingClassesID = {
  0: true
};

const favouriteClassesID = {
  1: true,
  2: true
};

const pastClassesID = {
  2: true
};

module.exports = {
  classes,
  reviews,
  // schedule,
  upcomingClassesID,
  favouriteClassesID,
  pastClassesID
};
