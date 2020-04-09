<template>
  <v-content class="search">
    <v-autocomplete
      :loading="loading"
      :items="items"
      :search-input.sync="searchText"
      cache-items
      class="mx-4"
      hide-no-data
      hide-details
      label="Search"
      solo-inverted
      full-width
      single-line
      light
      flat
      open-on-clear
      @keypress.enter="search"
      @collapse="collapseSuggestions"
      clearable
      color="grey"
      background-color="grey"
    />
  </v-content>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      // @todo Move searchText to watch or computed, so when this is not empty, show search results
      searchText: "",
      collapseSuggestions: false,
      loading: false,
      items: [],
      select: null,
      classNames: [
        "cooking",
        "guitar",
        "piano",
        "math",
        "primary 6 science",
        "chinese",
        "english",
        "art"
      ]
    };
  },
  watch: {
    searchText(searchText) {
      // Allow suggestions again
      this.collapseSuggestions = false;

      this.loading = true;
      setTimeout(() => {
        this.items = this.classNames.filter(
          e =>
            (e || "").toLowerCase().indexOf((searchText || "").toLowerCase()) >
            -1
        );
        this.loading = false;
      }, 500);
    }
  },
  methods: {
    search() {
      console.log("searching ...");

      // Collapse suggestions dropdown
      this.collapseSuggestions = true;

      // Call the store to get search results into store for explore page to display
      this.$store.dispatch("search/searchClass");
    }
    /**
     * @function getSuggestions
     * To Simulate ajax query
     */
    // getSuggestions(search) {
    //   this.loading = true;
    //   setTimeout(() => {
    //     this.items = this.classNames.filter(
    //       e =>
    //         (e || "").toLowerCase().indexOf((search || "").toLowerCase()) > -1
    //     );
    //     this.loading = false;
    //   }, 500);
    // }
  }
};
</script>

<style scoped>
.search {
  margin: 1em;
}

input {
  min-width: 90%;
}

input:focus {
  outline: none;
}
</style>
