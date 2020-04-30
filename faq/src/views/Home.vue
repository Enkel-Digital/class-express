<template>
  <div>
    <v-content class="Home">
      <v-container>
        <v-card class="mx-auto" max-width="900" style="margin-top: -64px;">
          <v-toolbar flat>
            <v-icon>mdi-magnify</v-icon>
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

          <v-content>
            <FAQProvider />
          </v-content>
        </v-card>
      </v-container>
    </v-content>
    <ContactUs />
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
