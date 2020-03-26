/**
 * Export mock data from here for testing UI before backend is created
 */

const searchResults = [
  {
    name: "basic guitar",
    ratings: 4, // Ratings out of 5 stars
    classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
    provider: {
      name: "Guitar Studio 1", // Name of the provider
      id: 123
    },
    location: "", // Location Coordinates so we can show on a Map insert
    pictureSrc:
      "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
  },
  {
    name: "advance guitar",
    ratings: 3.8, // Ratings out of 5 stars
    classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
    provider: {
      name: "Guitar Studio 2", // Name of the provider
      id: 123
    },
    location: "", // Location Coordinates so we can show on a Map insert
    pictureSrc:
      "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
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
