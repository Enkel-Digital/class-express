<template>
  <v-content class="ClassDetails">
    <!-- <v-responsive class="mx-auto" style="max-width:1024px;"> -->
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Your Dashboard</v-toolbar-title>
      </v-toolbar>

      <div class="row">
        <BookingsCard />
        <PointsEarnedCard />
        <ProfileVisitsCard />
      </div>

      <br />

      <WeeklyEarningsChart
        width="1400"
        height="300"
        :chartdata="chartdata"
        :options="options"
      />

      <br />

      <PastWeekEarningComparison />
    </v-container>
    <!-- </v-responsive> -->
  </v-content>
</template>

<script>
import BookingsCard from "@/components/BookingsCard.vue";
import PointsEarnedCard from "@/components/PointsEarnedCard.vue";
import ProfileVisitsCard from "@/components/ProfileVisitsCard.vue";
import WeeklyEarningsChart from "@/components/WeeklyEarningsChart.vue";
import PastWeekEarningComparison from "@/components/PastWeekEarningComparisonCard.vue";

export default {
  name: "home",
  components: {
    BookingsCard,
    PointsEarnedCard,
    ProfileVisitsCard,
    WeeklyEarningsChart,
    PastWeekEarningComparison,
  },
  data: () => ({
    chartdata: {
      labels: [
        "May 1",
        "May 2",
        "May 3",
        "May 4",
        "May 5",
        "May 6",
        "May 7",
        "May 8",
      ],
      datasets: [
        {
          label: "Points Earned",
          backgroundColor: "#78909C",
          borderColor: "#455A64",
          borderWidth: "2",
          fill: false,
          data: [60, 50, 60, 90, 50, 43, 54, 70],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
};
</script>
