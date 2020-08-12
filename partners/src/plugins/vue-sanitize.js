import Vue from "vue";
import VueSanitize from "vue-sanitize";

// script, style, iframe, inner style
Vue.use(VueSanitize, {
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
    a: ["href"],
  },
});
