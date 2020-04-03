<template>
  <v-content class="explore">
    <SearchBar />

    <!-- Add smth to v-if
          get text inside the search bar. If search is not empty then show the classes. 
    -->
    <!-- If users searched for something and there is valid results -->
    <v-responsive v-if="searchResults && searchResults.length">
      <span style="text-align: left;">Search Results:</span>

      <!-- Lazy load search results:
          - The harder way  https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/
          - The easier way (Use pagination, which is bad ux...)
      -->
      <v-card
        outlined
        :to="'/classdetails'"
        v-for="(searchResult, i) in searchResults"
        :key="i"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title
              class="headline"
              v-text="searchResult.name"
            ></v-card-title>

            <v-card-subtitle
              v-text="searchResult.provider.name"
            ></v-card-subtitle>
          </div>

          <v-avatar class="ma-3" size="125" tile>
            <v-img :src="searchResult.pictureSrc"></v-img>
          </v-avatar>
        </div>
      </v-card>
    </v-responsive>

    <!-- If the search result is an empty array-->
    <v-responsive class="ma-4" v-if="searchResults && !searchResults.length">
      <h4>No results for "{{ searchText }}"</h4>
    </v-responsive>

    <!-- If user did not search for anything and search results is of undefined -->
    <v-responsive class="ma-4" v-if="!searchResults">
      <h4>Sort by Category</h4>

      <!-- Show all icons for the categories -->
      <v-btn
        class="ma-4"
        v-for="(category, i) in categories"
        :key="i"
        @click="searchByCategory(category)"
      >
        {{ category }}
      </v-btn>
    </v-responsive>
  </v-content>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";
import { mapState } from "vuex";

export default {
  name: "explore",
  components: {
    SearchBar
  },
  beforeMount() {
    // Either mounted or before mount or created or smth
    // Basically check if the store have state.category. if not, load it, else it is just a simple screen switch then just ignore and do nothing and continue component loading.
    if (!this.$store.state.search.categories)
      this.$store.dispatch("getCategories");
  },
  computed: mapState("search", ["searchText", "searchResults", "categories"]),
  methods: {
    searchByCategory(category) {
      console.log("category:", category);
      // Call vuex method to fill the state with search result. Then the computed here will re-load
    }
  }
};
</script>

<style scoped></style>
