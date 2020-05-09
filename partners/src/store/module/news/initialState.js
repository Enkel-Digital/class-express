/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    // Include a default news banner
    newsBanners: [
      {
        src: "https://enkeldigital.com/images/hero.jpg",
        text: "Checkout our company", // Optional text
        link: "http://enkeldigital.com/",
      },
    ],
  };
}
