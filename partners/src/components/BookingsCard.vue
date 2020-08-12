<template>
  <!-- <v-card outlined :to="{name: 'bookings'}"> -->
  <v-card outlined text max-width="15em" class="class-card text-left">
    <v-list-item two-line>
      <!-- <v-icon color="#C62828">
        mdi-folder-account
      </v-icon> -->
      <v-list-item-content>
        <div v-resize-text class="overline">{{ "Bookings Confirmed" }}</div>

        <v-list-item-subtitle class="font-weight-black">
          {{ "18" }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "bookings-card",
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
