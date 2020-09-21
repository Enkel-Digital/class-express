<template>
  <div id="app">
    <Navbar />

    <Hero />
    <Features id="Features" />
    <Workouts id="Workouts" />
    <Download id="Download" />
    <Partner id="Partner" />
    <ContactUs id="ContactUs" />

    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workouts from "@/components/Workouts";
import Download from "@/components/Download";
import Partner from "@/components/Partner";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    Navbar,
    Hero,
    Features,
    Workouts,
    Download,
    Partner,
    ContactUs,
    Footer,
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
</style>
