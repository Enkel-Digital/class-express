/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    // Default categories
    categories: ["tech", "language", "academics", "cooking", "music", "sports"]
  };
}

/**
 * Example/Reference on how a searchResult element would be
 * @todo Might not need this anymore as will be relying on service like algolia for search
 */
const searchResultObjReference = {
  name: "advance guitar",
  ratings: 3.8, // Ratings out of 5 stars
  length: "60", // Store classLength in minutes can show otherwise in hours as needed
  provider: {
    name: "Guitar Studio 2", // Name of the provider
    id: 123
  },
  location: "", // Location Coordinates so we can show on a Map insert
  pictureSrc:
    "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
};