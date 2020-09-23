<template>
  <v-main>
    <NewsBanners />
    <v-divider />

    <Recommended />
    <br />
    <Popular />
    <br />

    <!-- @todo Update this copywriting -->
    <p>Invite your friends to start learning new skills together!</p>
  </v-main>
</template>

<script>
import NewsBanners from "@/components/NewsBanners.vue";
import Recommended from "@/components/Recommended.vue";
import Popular from "@/components/Popular.vue";

export default {
  name: "home",
  components: {
    NewsBanners,
    Recommended,
    Popular,
  },
};
</script>
