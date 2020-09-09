<template>
  <v-card flat color="transparent">
    <v-subheader>Distance</v-subheader>
    <v-card-text>
      <v-slider v-model="slider" thumb-label="always">
        <template v-slot:thumb-label="{ value }">
          {{ value + "km" }}
        </template>
      </v-slider>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      slider: 45,
    };
  },
};
</script>
