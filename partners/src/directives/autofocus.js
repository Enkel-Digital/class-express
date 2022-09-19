// Custom directive to autofocus on a input element
export default {
  // When the bound element is inserted into the DOM...
  inserted(element) {
    element.focus(); // Focus the element
  },
};
