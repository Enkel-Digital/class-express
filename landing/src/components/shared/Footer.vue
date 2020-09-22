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
        <input
          v-model="email"
          class="input"
          type="text"
          color="black"
          placeholder="Email"
          style="max-width: 12.4em; border-radius: 0.4em 0 0 0.4em"
          @keypress.enter="subscribe"
        />
        <button
          class="button is-info"
          style="
            border-radius: 0 0.4em 0.4em 0;
            color: black;
            font-weight: bold;
          "
          @click="subscribe"
        >
          Subscribe
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      email: "",

      // @todo Set the links
      iconClasses: [
        { class: "fab fa-instagram", link: "" },
        // Pick 1 for face book
        { class: "fab fa-facebook-square", link: "" },
        // { class: "fab fa-facebook", link: "" },
        // { class: "fab fa-facebook-f", link: "" },
        { class: "fab fa-twitter", link: "" },
        { class: "fab fa-linkedin-in", link: "" },
        { class: "fab fa-telegram-plane", link: "" },
      ],
    };
  },
  methods: {
    subscribe() {
      // @todo
      // Protect this method, prevent this from being spammed
      // disable this form?
      // and rate limit the API

      this.email;
      console.log(this.email);
    },
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

input::placeholder {
  color: black;
  font-weight: bold;
}
</style>
