<template>
  <v-content class="explore">
    <SearchBar />

    <v-responsive v-if="searchResults.length">
      <span style="text-align: left;">Search Results:</span>

      <v-card outlined v-for="(searchResult, i) in searchResults" :key="i">
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

    <v-responsive class="ma-4" v-if="!searchResults.length">
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

export default {
  name: "explore",
  components: {
    SearchBar
  },
  data() {
    return {
      searchResults: [
        {
          name: "basic guitar",
          ratings: 4, // Ratings out of 5 stars
          classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
          provider: {
            name: "Guitar Studio 1", // Name of the provider
            id: 123
          },
          location: "", // Location Coordinates so we can show on a Map insert
          pictureSrc:
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
        },
        {
          name: "advance guitar",
          ratings: 3.8, // Ratings out of 5 stars
          classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
          provider: {
            name: "Guitar Studio 2", // Name of the provider
            id: 123
          },
          location: "", // Location Coordinates so we can show on a Map insert
          pictureSrc:
            "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
        }
      ],
      categories: [
        "tech",
        "language",
        "academics",
        "cooking",
        "music",
        "sports"
      ]
    };
  },
  methods: {
    searchByCategory(category) {
      console.log("category:", category);
    }
  }
};
</script>

<style scoped></style>
