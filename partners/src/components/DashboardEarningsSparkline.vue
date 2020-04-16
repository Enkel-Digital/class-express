<template>
  <div class="col-md-8 col-12">
    <v-card class="mx-auto text-center" light>
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="blue"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline :labels="labels" :value="value" color="white" line-width="2" padding="16"></v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2">Credit Earnings this week</div>
        <!-- <div class="subheading font-weight-light grey--text"></div> -->
        <v-divider class="my-2"></v-divider>
        <v-icon class="mr-2" small>mdi-clock</v-icon>
        <span class="caption grey--text font-weight-light">last updated now</span>
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



