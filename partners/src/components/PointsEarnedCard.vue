<template>
  <!-- <v-card outlined :to="{name: 'bookings'}"> -->
  <v-card outlined text width="15em" class="class-card text-left">
    <v-list-item two-line>
      <!-- <v-icon color="#C62828">
        mdi-folder-account
      </v-icon> -->
      <v-list-item-content>
        <div v-resize-text class="overline">{{ label }}</div>

        <v-list-item-subtitle class="font-weight-black">
          {{ points }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "bookings-card",
  props: ["label", "points"],
  directives: {
    ResizeText: () => import("vue-resize-text"),
  },
};
</script>

<style scoped>
.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
