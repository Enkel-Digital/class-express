<template>
  <div id="app">
    <section class="hero is-fullheight">
      <HeroHead />
      <img
        class="image hero-image"
        alt="Hero"
        :src="require(`./assets/hero/${heroImage}.jpg`)"
      />
      <HeroBody />
    </section>

    <!-- Next section after the hero banner -->

    <section id="next" class="hero is-fullheight">
      <img src="" alt="Hero" class="image hero-image" />

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
      heroImage: 1,
    };
  },
  /* mounted() {
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true)
        for (let i = 1; i < 6; i++) {
          // @todo Make the transition smooth
          this.heroImage = i;
          console.log(`showing hero ${i}`);
          await new Promise((resolve) => setTimeout(resolve, 4000));
        }
    })();
  }, */
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
