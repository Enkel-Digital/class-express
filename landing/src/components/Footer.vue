<template>
  <footer class="footer">
    <div class="container is-centered">
      <!-- A row of our Social media platforms -->
      <div>
        <p class="subtitle bold">Follow us</p>
        <a
          v-for="(iconClass, i) in iconClasses"
          :key="i"
          :href="iconClass.link"
          target="_blank"
          class="fa-2x mr-3"
        >
          <i :class="iconClass.class" />
        </a>
      </div>

      <br />
      <br />
      <br />

      <div>
        <p class="subtitle bold">Subscribe for our Newsletter</p>
        <!-- @todo Do the input form -->
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      // @todo Set the links
      iconClasses: [
        { class: "fab fa-instagram", link: "" },
        // Pick 1 for face book
        { class: "fab fa-facebook-square", link: "" },
        { class: "fab fa-facebook", link: "" },
        { class: "fab fa-facebook-f", link: "" },
        { class: "fab fa-twitter", link: "" },
        { class: "fab fa-linkedin-in", link: "" },
        { class: "fab fa-telegram-plane", link: "" },
      ],
    };
  },
};
</script>

<style scoped>
footer {
  background-color: black;
}

p,
a,
/* Prevents link from changing color when pressed */
a:visited {
  color: white;
}

.bold {
  font-weight: bold;
}
</style>
