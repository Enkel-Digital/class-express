<template>
  <div>
    <Navbar />

    <Hero />
    <Features id="Features" />
    <Workouts id="Workouts" />
    <Download id="Download" />
    <PartnerSection id="Partner" />
    <ContactUs id="ContactUs" />

    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/main/Navbar";
import Hero from "@/components/main/Hero";
import Features from "@/components/main/Features";
import Workouts from "@/components/main/Workouts";
import Download from "@/components/main/Download";
import PartnerSection from "@/components/main/PartnerSection";
import ContactUs from "@/components/shared/ContactUs";
import Footer from "@/components/shared/Footer";

export default {
  name: "Main",
  components: {
    Navbar,
    Hero,
    Features,
    Workouts,
    Download,
    PartnerSection,
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
