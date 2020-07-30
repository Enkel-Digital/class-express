<template>
  <v-main class="explore">
    <!-- @todo Only show if user did not search for anything -->
    <v-responsive class="ma-4" v-if="categories.length">
      <h4>Show a Category</h4>

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
  </v-main>
</template>

<script>
export default {
  beforeMount() {
    // Either mounted or before mount or created or smth
    // Basically check if the store have state.category. if not, load it, else it is just a simple screen switch then just ignore and do nothing and continue component loading.
    // if (!this.$store.state.search.categories)
    //   this.$store.dispatch("getCategories");
  },
  data() {
    return {
      // Default categories
      // @todo Get this from API
      categories: [
        "tech",
        "language",
        "academics",
        "cooking",
        "music",
        "sports",
      ],
    };
  },
  methods: {
    searchByCategory(category) {
      console.log("category:", category);
      // Call vuex method to fill the state with search result. Then the computed here will re-load
    },
  },
};
</script>
