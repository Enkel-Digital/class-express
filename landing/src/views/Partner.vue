<template>
  <div>
    <Navbar />

    <Hero />
    <Features id="Features" />
    <Testimonial id="Testimonial" />
    <Tutorial id="Portal" />
    <ContactUs id="ContactUs" />

    <Footer />
  </div>
</template>

<script>
// @todo To remove use of main components and use components from /partner
import Navbar from "@/components/partner/Navbar";
import Hero from "@/components/partner/Hero";
import Features from "@/components/partner/Features";
import Testimonial from "@/components/partner/Testimonial";
import Tutorial from "@/components/partner/Tutorial";
import ContactUs from "@/components/shared/ContactUs";
import Footer from "@/components/shared/Footer";

export default {
  name: "Partner",
  components: {
    Navbar,
    Hero,
    Features,
    Testimonial,
    Tutorial,
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
