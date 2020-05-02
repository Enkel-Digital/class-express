<template>
  <v-content id="explore">
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold;">
        Explore
      </v-toolbar-title>
    </v-app-bar>
    <ais-instant-search index-name="classes" :search-client="searchClient">
      <div class="container">
        <ais-instant-search :search-client="searchClient" index-name="classes">
          <div class="search-panel">
            <div class="search-panel__results">
              <ais-search-box placeholder="Search here…" class="searchbox" />

              <app-infinite-hits>
                <template slot="item" slot-scope="{ item }">
                  <v-responsive>
                    <v-card
                      :key="item.objectID"
                      class="mx-auto mb-4"
                      max-width="calc(100% - 1.6em)"
                      outlined
                      :ripple="false"
                    >
                      <v-responsive
                        @click="
                          $router.push({
                            name: 'ClassDetails',
                            params: { classID: item.objectID },
                          })
                        "
                      >
                        <!-- @todo Change to a image carousel -->
                        <v-img id="class-image" :src="item.pictureSources[0]" />

                        <v-list-item>
                          <div style="text-align: left;">
                            <v-card-title class="headline pl-0">
                              <ais-highlight
                                :hit="item"
                                attribute="name"
                                style="font-weight: bold;"
                                class="headline pl-0"
                              />
                            </v-card-title>

                            <v-list-item-subtitle :set="item.provider.name">
                              <div style="font-weight: bold;">
                                <!-- {{ item.provider.name }} -->
                                <ais-highlight
                                  :hit="item"
                                  attribute="provider.name"
                                />
                              </div>

                              <div>
                                <!-- {{
                                  item.location
                                    ? item.location.address
                                    : provider.location.address
                                }} -->
                                <ais-highlight
                                  :hit="item"
                                  attribute="location.address"
                                />
                              </div>
                            </v-list-item-subtitle>
                          </div>
                        </v-list-item>
                      </v-responsive>

                      <v-card-actions>
                        <v-spacer />

                        <!-- Change this to a remove icon only. Cos dont need to toggle, here means confirm favourites already -->
                        <v-btn icon @click="toggleFavourite(item.id)">
                          <v-icon color="red">mdi-heart</v-icon>
                        </v-btn>

                        <!-- @todo Extract out all share buttons to a common component -->
                        <!-- @todo Implement PWA sharing and web share target code  -->
                        <v-btn icon>
                          <v-icon>mdi-share-variant</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-responsive>
                  <!-- <h1><ais-highlight :hit="item" attribute="name" /></h1> -->
                  <!-- <p><ais-highlight :hit="item" attribute="description" /></p> -->
                </template>
              </app-infinite-hits>
            </div>
          </div>
        </ais-instant-search>
      </div>
    </ais-instant-search>
  </v-content>
</template>

<script>
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/algolia-min.css";
import AppInfiniteHits from "../components/InfiniteHits";

export default {
  name: "explore",
  components: { AppInfiniteHits },
  data() {
    return {
      searchClient: algoliasearch(
        "MIG150ZYJX",
        "d18e0d7563d406863fb469d00796266e"
      ),
    };
  },
};
</script>

<style scoped>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.ais-Highlight-highlighted {
  background: cyan;
  font-style: normal;
}

.header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #4dba87, #2f9088);
  color: #fff;
  margin-bottom: 1rem;
}

.header a {
  color: #fff;
  text-decoration: none;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
}

.header-title::after {
  content: " ▸ ";
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-panel {
  display: flex;
}

.search-panel__filters {
  flex: 1;
  margin-right: 1em;
}

.search-panel__results {
  flex: 3;
}

.searchbox {
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
