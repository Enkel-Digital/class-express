<template>
  <div id="app">
    <section class="hero is-fullheight">
      <HeroHead />
      <img :src="heroImage" alt="Hero" class="image hero-image" />
      <HeroBody />
    </section>

    <!-- Next section after the hero banner -->

    <section id="next" class="hero is-fullheight">
      <img :src="heroImage2" alt="Hero" class="image hero-image" />

      <!-- @todo Empty hero body to force footer to the bottom of the hero page -->
      <div class="hero-body" />

      <Footer />
    </section>
  </div>
</template>

<script>
import HeroHead from "@/components/HeroHead";
import HeroBody from "@/components/HeroBody";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    HeroHead,
    HeroBody,
    Footer,
  },
  data() {
    return {
      heroImage:
        "https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20(1%20of%201)-5.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      heroImage2:
        "https://images.unsplash.com/photo-1525095182007-3874c4e2b38b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    };
  },
};
</script>

// Load the bulma styles in the top level component
<style lang="sass" src="bulma" />

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.hero-image {
  overflow: hidden;
  position: absolute;
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
</style>
