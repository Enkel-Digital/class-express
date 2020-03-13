<template>
  <v-content class="search">
    <v-card>
      <input
        type="text"
        v-model="searchText"
        placeholder="Search"
        @click="clicked"
        @keypress="suggest"
        @keypress.enter="search"
      />
    </v-card>

    <!-- Add a drop down menu to show suggested items -->
  </v-content>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    suggest() {
      console.log("suggestion engine:", this.searchText);
    },
    search() {
      console.log("search engine:", this.searchText);

      // Get the search result's as a promise
      // Redirect to the search page and pass the promise there to await and populate the page.
      // Search page is just the explore page.

      this.$router.push({ name: "explore" });
    },
    clicked() {
      console.log("clicked");
      // Perhaps redirect to explore and use the actual search box in explore.
    }
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
