<template>
  <div class="col-md-8 col-12">
    <v-card class="mx-auto text-center" light>
      <v-sheet class="mx-auto" color="blue">
        <v-sparkline
          :labels="labels"
          :value="value"
          color="white"
          line-width="2"
          padding="16"
        />
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2">
          POINTS EARNINGS (WEEKLY)
        </div>

        <!-- <div class="subheading font-weight-light grey--text"></div> -->

        <v-icon small>mdi-clock</v-icon>
        <span class="caption grey--text font-weight-light">
          last updated now
        </span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "dashboard-earnings-sparkline",
  data: () => ({
    labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    value: [200, 675, 410, 390, 310, 460, 250]
  })
};
</script>
