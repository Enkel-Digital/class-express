<template>
  <!-- <v-card outlined :to="{name: 'bookings'}"> -->
  <v-card outlined text width="15em" class="text-left">
    <v-list-item two-line>
      <!-- <v-icon color="#C62828">
        mdi-folder-account
      </v-icon> -->
      <v-list-item-content>
        <div v-resize-text class="overline">{{ "Profile Visits (Month)" }}</div>

        <v-list-item-subtitle class="font-weight-black">
          {{ "100" }}
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
