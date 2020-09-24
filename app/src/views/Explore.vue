<template>
  <v-main id="explore">
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold">Explore</v-toolbar-title>
    </v-app-bar>

    <ais-instant-search :index-name="indexName" :search-client="searchClient">
      <ais-search-box class="ais-search-box" placeholder="Search here…" />
      <!-- @todo Add refinement ability -->
      <!-- <ais-refinement-list attribute="location" searchable /> -->

      <FilterMenu />

      <!-- @todo: Mix Partner and Class card together -->

      <ais-state-results>
        <template slot-scope="{ query, hits }">
          <app-infinite-hits v-if="query.length > 0 && hits.length > 0">
            <template slot="item" slot-scope="{ item }">
              <SearchResultCard :item="item" />
            </template>
          </app-infinite-hits>

          <span v-if="hits.length == 0">No results found</span>
          <Categories v-if="query.length == 0 || hits.length == 0" />
        </template>
      </ais-state-results>
    </ais-instant-search>
  </v-main>
</template>

<script>
import {
  AisInstantSearch,
  AisSearchBox,
  AisStateResults,
  // AisRefinementList,
  // AisSortBy,
  // AisPanel,
} from "vue-instantsearch";

import algoliasearch from "algoliasearch/lite";

// CSS for the algolia search components (bar)
// @todo Refactor this away to use our own custom CSS to reduce resources needed to be loaded
import "instantsearch.css/themes/algolia-min.css";

import AppInfiniteHits from "../components/InfiniteHits";
import SearchResultCard from "../components/SearchResultCard";
import FilterMenu from "../components/FilterMenu";
import Categories from "./Categories";

export default {
  name: "explore",
  components: {
    AisInstantSearch,
    AisSearchBox,
    AisStateResults,
    // AisRefinementList,
    AppInfiniteHits,
    Categories,
    FilterMenu,
    SearchResultCard,
  },
  data() {
    return {
      indexName: "classes",
      searchClient: algoliasearch(
        process.env.VUE_APP_Algoliasearch_ID,
        process.env.VUE_APP_Algoliasearch_Key_SearchOnly
      ),
    };
  },
};
</script>
