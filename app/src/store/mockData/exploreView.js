/**
 * Export mock data from here for testing UI before backend is created
 */

const searchResults = [
  {
    id: 0,
    name: "Basic Guitar",
    points: 5,
    time: Date.now(),
    length: 60, // Store classLength in minutes can show otherwise in hours as needed
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
  {
    id: 2,
    name: "Advanced Guitar",
    points: 8,
    time: Date.now() + 1000000,
    length: 60, // Store classLength in minutes can show otherwise in hours as needed
    description:
      "Advance guitar lessons taught be the legendary Ichika Mo. Will be going through advanced music scores and includes 1 on 1 trainings for the students, alongside a chance to practice in front of a live audience",
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
];

const categories = [
  "tech",
  "language",
  "academics",
  "cooking",
  "music",
  "sports"
];

module.exports = { searchResults, categories };
