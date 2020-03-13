<template>
  <v-content class="home">
    <SearchBar />

    <!-- Below will either be the explore page or the search result's page. -->
    <v-responsive>
      <v-list-item id="recently-searched-items">
        <v-list-item-content
          v-for="searchItem in searchItems"
          :key="searchItem"
        >
          <p>{{ searchItem }}</p>
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

    <v-divider></v-divider>

    <v-responsive class="ma-4">
      <h4>Sort by Category</h4>

      <v-btn class="ma-4">Academics</v-btn>
      <v-btn class="ma-4">Music</v-btn>
      <v-btn class="ma-4">Sports</v-btn>
      <v-btn class="ma-4">Cooking</v-btn>
      <v-btn class="ma-4">Tech</v-btn>
    </v-responsive>
  </v-content>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "home",
  components: {
    SearchBar
  },
  data() {
    return {
      searchItems: ["search1", "search2", "search3"]
    };
  }
};
</script>

<style scoped></style>
