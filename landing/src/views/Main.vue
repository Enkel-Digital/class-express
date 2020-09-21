<template>
  <div>
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
  name: "Main",
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

<style>
/* "Global" styles for hero-image class as it is reused for all the hero sections */
.hero-image {
  overflow: hidden;
  position: absolute;
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
</style>
