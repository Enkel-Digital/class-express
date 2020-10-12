<template>
  <div class="text-center">
    <!-- <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">
          <v-icon left>mdi-sort</v-icon>
          Sort By
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in sorts"
          :key="index"
          @click="say(item.title)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
    <ais-sort-by
      :items="[
        { value: 'class', label: 'Default' },
        { value: 'instant_search_point_asc', label: 'Points' },
      ]"
    >
      <v-menu offset-y slot-scope="{ items, refine }">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">
            <v-icon left>mdi-sort</v-icon>
            Sort By
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            @click.prevent="refine(item.value)"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </ais-sort-by>
  </div>
</template>

<script>
import { AisSortBy } from "vue-instantsearch";
export default {
  components: { AisSortBy },
  data: () => ({
    sorts: [
      { title: "Rate" },
      { title: "Points" },
      { title: "Distance" },
      { title: "Recommand" },
    ],
  }),
  methods: {
    say: function (message) {
      console.log(message);
    },
  },
};
</script>
