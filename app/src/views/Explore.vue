<template>
  <v-main id="explore">
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold">Explore</v-toolbar-title>
    </v-app-bar>

    <ais-instant-search index-name="classes" :search-client="searchClient">
      <div class="scontainer">
        <div class="search-panel">
          <div class="search-panel__results">
            <ais-search-box placeholder="Search here…" class="searchbox" />
            <FilterMenu />

            <!-- @todo: Mix Partner and Class card together -->

            <!-- Class -->

            <ais-state-results>
              <template slot-scope="{ query, hits }">
                <app-infinite-hits v-if="query.length > 0 && hits.length > 0">
                  <template slot="item" slot-scope="{ item }">
                    <v-responsive
                      @click="
                        $router.push({
                          name: 'ClassDetails',
                          params: { classID: item.objectID },
                        })
                      "
                    >
                      <v-card
                        :key="item.objectID"
                        class="class-card mx-auto"
                        max-width="calc(100% - 1.6em)"
                        outlined
                        :ripple="false"
                      >
                        <v-row>
                          <v-col>
                            <v-list-item-content>
                              <v-list-item-title>
                                <ais-highlight :hit="item" attribute="name" />
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{ item.provider.name }}
                              </v-list-item-subtitle>

                              <v-list-item-subtitle>
                                {{ item.location.address }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col>
                            <!-- <v-responsive id="class-image-container"> -->
                            <!-- @todo Update API to return an array from DB and Change to a image carousel -->
                            <!-- <v-img id="class-image" :src="clas.pictureSources[0]" /> -->
                            <v-img
                              max-height="15vh"
                              max-width="15vh"
                              id="class-image"
                              :src="item.pictureSources[0]"
                            />
                            <!-- </v-responsive> -->

                            <!-- @todo fav icon, the isFavourite thing not implemented yet -->
                            <v-btn icon small @click="toggleFavourite(item.id)">
                              <v-icon color="red">mdi-heart</v-icon>
                            </v-btn>

                            <!-- @todo Extract out all share buttons to a common component -->
                            <!-- @todo Implement PWA sharing and web share target code  -->
                            <v-btn small icon>
                              <v-icon>mdi-share-variant</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-responsive>
                    <!-- <h1><ais-highlight :hit="item" attribute="name" /></h1> -->
                    <!-- <p><ais-highlight :hit="item" attribute="description" /></p> -->
                  </template>
                </app-infinite-hits>
                <div v-if="query.length == 0">
                  <Categories />
                </div>
                <div v-if="hits.length == 0">
                  No results have been found
                  <Categories />
                </div>
                <!-- <div v-else>
                  No results have been found
                  <Categories />
                </div>-->
              </template>
            </ais-state-results>
          </div>
        </div>
      </div>
    </ais-instant-search>
  </v-main>
</template>

<script>
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  AisStateResults,
  AisHighlight,
  AisConfigure,
  AisSortBy,
  AisPanel,
} from "vue-instantsearch";

import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/algolia-min.css";
import "instantsearch.css/themes/algolia.css";
import AppInfiniteHits from "../components/InfiniteHits";
import Categories from "./Categories";
import FilterMenu from "../components/FilterMenu";

export default {
  name: "explore",
  components: {
    AppInfiniteHits,
    Categories,
    FilterMenu,
    AisInstantSearch,
    AisSearchBox,
    AisStateResults,
    AisHighlight,
    //AisHits,
    //AisConfigure,
  },
  data() {
    return {
      searchClient: algoliasearch(
        process.env.VUE_APP_Algoliasearch_ID,
        process.env.VUE_APP_Algoliasearch_Key_SearchOnly
      ),
    };
  },
};
</script>

<style scoped>
.ais-Highlight-highlighted {
  background: cyan;
  font-style: normal;
}

.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
