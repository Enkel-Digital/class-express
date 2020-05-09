<template>
  <div>
    <v-content class="Home">
      <v-container>
        <v-card class="mx-auto" max-width="900" style="margin-top: -64px;">
          <v-toolbar flat>
            <v-icon>mdi-magnify</v-icon>
            <!-- TODO: Non functional autocomplete -->
            <!-- Search bar to look for topic issue -->
            <v-autocomplete
              :loading="loading"
              :items="items"
              :search-input.sync="searchText"
              cache-items
              class="mx-4"
              hide-no-data
              hide-details
              label="Describe your issue"
              full-width
              single-line
              light
              flat
              open-on-clear
              @keypress.enter="search"
              @collapse="collapseSuggestions"
              clearable
            />
          </v-toolbar>
          <v-divider></v-divider>
          <!-- TODO: Integrate FAQ Provider with autocomplete -->
          <!-- Displays FAQ using tabs and expansion panels, through a component -->
          <FAQProvider />
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>

<script>
// @ is an alias to /src
import FAQProvider from "@/components/FAQProvider.vue";
import ContactUs from "@/components/ContactUs.vue";

export default {
  name: "Home",
  components: {
    FAQProvider,
    ContactUs
  },
  data() {
    return {
      // @todo Move searchText to watch or computed, so when this is not empty, show search results
      searchText: "",
      collapseSuggestions: false,
      loading: false,
      items: [],
      select: null,
      faqTopics: [
        "Application",
        "Account",
        "General",
        "Misc",
        "Partner",
        "Provider",
        "Billing"
      ]
    };
  },
  watch: {
    searchText(searchText) {
      // Allow suggestions again
      this.collapseSuggestions = false;

      this.loading = true;
      setTimeout(() => {
        this.items = this.faqTopics.filter(
          e =>
            (e || "").toLowerCase().indexOf((searchText || "").toLowerCase()) >
            -1
        );
        this.loading = false;
      }, 500);
    }
  },
  methods: {
    //Search method for autocomplete
    search() {
      console.log("searching ...");

      // Collapse suggestions dropdown
      this.collapseSuggestions = true;

      // Call the store to get search results into store for explore page to display
      this.$store.dispatch("search/searchClass");
    }
  }
};
</script>
