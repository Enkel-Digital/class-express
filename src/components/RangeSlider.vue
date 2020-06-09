<template>
  <v-card flat color="transparent">
    <v-subheader>Point Range</v-subheader>
    <v-card-text>
      <v-range-slider v-model="value" max="20" thumb-label="always">
        <template v-slot:thumb-label="{ value }">
          {{ value }}
        </template>
      </v-range-slider>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      value: [1, 6],
    };
  },
};
</script>
