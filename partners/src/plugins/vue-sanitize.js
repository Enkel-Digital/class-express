import Vue from "vue";
import VueSanitize from "vue-sanitize";

// script, style, iframe, inner style
let defaults = VueSanitize.defaults;
defaults = {
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
    "abbr",
    "code",
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
    a: ["href"],
  },
};
Vue.use(VueSanitize, defaults);
