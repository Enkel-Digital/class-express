/**
 * Validator function to check if the html is safe
 */

const sanitizer = require("sanitize-html");

/**
 * Checks if the HTML string input is safe or if it was not editted by the sanitizer function
 * Thus might return false if the string is transformed but not "sanitized" per se
 * @param {string} htmlString HTML string
 * @returns {Boolean}
 */
module.exports = (
  htmlString,
  options = {
    allowedTags: [
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "nl",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "strike",
      "hr",
      "br",
      "div",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "pre",
    ],
    allowedAttributes: {
      a: ["href"], // Should this be allowed?
    },
  }
) => htmlString === sanitizer(htmlString, options);
