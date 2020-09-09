<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn color="indigo" dark v-on="on">
          <v-icon left>mdi-filter</v-icon>
          Filter
        </v-btn>
      </template>
      <v-card class="mx-auto" max-width="400">
        <v-toolbar flat color="indigo" dark>
          <v-btn icon @click="menu = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Filter results</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <h2 class="title mb-2">Choose Categories</h2>

          <v-chip-group column multiple>
            <template v-for="item in categories">
              <v-chip filter outlined :key="item.text">{{ item.text }}</v-chip>
            </template>
          </v-chip-group>
        </v-card-text>

        <v-card-text>
          <h2 class="title mb-2">Choose Location</h2>

          <v-chip-group column multiple>
            <template v-for="item in locations">
              <v-chip filter outlined :key="item.text">{{ item.text }}</v-chip>
            </template>
          </v-chip-group>
        </v-card-text>
        <Slider />

        <v-card-text>
          <h2 class="title mb-2">Choose Points</h2>

          <v-chip-group vcolumn multiple>
            <template v-for="item in points">
              <v-chip filter outlined :key="item.text">{{ item.text }}</v-chip>
            </template>
          </v-chip-group>
        </v-card-text>
        <RangeSlider />

        <v-card-text>
          <h2 class="title mb-2">Choose</h2>
          <ais-menu attribute="_tags">
            <v-chip-group column multiple slot-scope="{ items, refine }">
              <template v-for="item in items">
                <v-chip
                  filter
                  outlined
                  :key="item.value"
                  @click.prevent="refine(item.value)"
                >
                  {{ item.label }}
                </v-chip>
              </template>
              <!-- <li>
                <button :disabled="!canToggleShowMore" @click="toggleShowMore">
                  {{ isShowingMore ? "Less" : "More" }}
                </button>
              </li> -->
            </v-chip-group>
          </ais-menu>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>

      <!-- <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="message" color="purple" />
          </v-list-item-action>
          <v-list-item-title>messages</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="hints" color="purple" />
          </v-list-item-action>
          <v-list-item-title>hints</v-list-item-title>
        </v-list-item>
      </v-list> -->
    </v-menu>
  </div>
</template>

<script>
import { AisMenu } from "vue-instantsearch";
import Slider from "../components/Slider";
import RangeSlider from "../components/RangeSlider";
export default {
  components: { AisMenu, Slider, RangeSlider },
  data: () => ({
    av: true,
    menu: false,
    message: false,
    hints: true,
    categories: [
      {
        text: "Business",
        icon: "mdi-handshake",
      },
      {
        text: "Arts & Media",
        icon: "mdi-music",
      },
      {
        text: "Healthcare",
        icon: "mdi-heart",
      },
      {
        text: "IT",
        icon: "mdi-book",
      },
      {
        text: "Sports",
        icon: "mdi-bike",
      },
    ],
    locations: [
      {
        text: "Bugis",
      },
      {
        text: "Orchard",
      },
      {
        text: "Tampines",
      },
      {
        text: "Expo",
      },
      {
        text: "Bedok",
      },
      {
        text: "Jurong East",
      },
      {
        text: "Woodlands",
      },
      {
        text: "City Hall",
      },
    ],
    points: [
      {
        text: "1 - 3",
      },
      {
        text: "3 - 5",
      },
      {
        text: "6 - 10",
      },
    ],
    loading: false,
    selected: [],
  }),
  computed: {
    allSelected() {
      return this.selected.length === this.categories.length;
    },

    selections() {
      const selections = [];
      for (const selection of this.selected) {
        selections.push(selection);
      }
      return selections;
    },
  },
};
</script>
