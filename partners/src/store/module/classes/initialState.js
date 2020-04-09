/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    classes: {},
    upcomingClassesID: {},
    favouriteClassesID: {}
  };
}

/**
 * Example/Reference of a Full class object
 * Contains all the props, so other type of class objects like favClasses / upcomingClasses can pick and choose what they want with graphQL
 */
const classObject = {
  id: 12345,
  points: 8,
  isReserved: false, // Get this
  name: "advance guitar",
  length: "60", // Store classLength in minutes can show otherwise in hours as needed
  description:
    "Advance guitar lessons taught be the legendary Ichika Mo. Will be going through advanced music scores and includes 1 on 1 trainings for the students, alongside a chance to practice in front of a live audience",
  review: {
    ratings: 4.8, // Ratings out of 5 stars
    numberOfReviews: 100
  },
  provider: {
    name: "Guitar Studio 2", // Name of the provider
    id: 123,
    description: "We offer world class guitar lessons for you!"
  },
  location: "Orchard road", // Location Coordinates so we can show on a Map insert
  pictureSrc:
    "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
};
