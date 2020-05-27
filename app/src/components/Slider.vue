<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-subheader class="pl-0">Distance</v-subheader>
        <v-slider v-model="slider" thumb-label
          ><template v-slot:thumb-label="{ value }">
            {{ value + "km" }}
          </template></v-slider
        >
      </v-col>
    </v-row>
  </v-container>
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
