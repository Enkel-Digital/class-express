<template>
  <v-card
    outlined
    text
    width="15em"
    class="text-left"
    :to="{ name: 'analytics' }"
  >
    <v-list-item two-line>
      <!-- <v-icon color="#C62828"> mdi-folder-account </v-icon> -->
      <v-list-item-content>
        <div class="overline">{{ "Profile Visits (Month)" }}</div>

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
};
</script>
