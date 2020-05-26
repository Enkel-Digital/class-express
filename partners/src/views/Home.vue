<template>
  <v-content class="ClassDetails">
    <!-- <v-responsive class="mx-auto" style="max-width:1024px;"> -->
    <v-container>
      <v-toolbar dense class="elevation-1">
        <v-toolbar-title>Your Dashboard</v-toolbar-title>
      </v-toolbar>

      <div class="row">
        <BookingsCard />
        <ActiveClassCard />
        <ProfileVisitsCard />
        <PointsEarnedCard
          :label="pointCardLabels.weekly"
          :points="pointCardPoints.weekly"
        />
        <PointsEarnedCard
          :label="pointCardLabels.monthly"
          :points="pointCardPoints.monthly"
        />
        <PointsEarnedCard
          :label="pointCardLabels.total"
          :points="pointCardPoints.total"
        />
      </div>

      <br />

      <EarningsChart :chartdata="chartdata" :options="options" />

      <br />

      <PastWeekEarningComparison />
    </v-container>
  </v-content>
</template>

<script>
import BookingsCard from "@/components/BookingsCard.vue";
import PointsEarnedCard from "@/components/PointsEarnedCard.vue";
import ProfileVisitsCard from "@/components/ProfileVisitsCard.vue";
import EarningsChart from "@/components/EarningsChart.vue";
import PastWeekEarningComparison from "@/components/PastWeekEarningComparisonCard.vue";
import ActiveClassCard from "@/components/ActiveClassCard.vue";

export default {
  name: "home",
  components: {
    BookingsCard,
    PointsEarnedCard,
    ProfileVisitsCard,
    EarningsChart,
    PastWeekEarningComparison,
    ActiveClassCard,
  },
  data: () => ({
    chartdata: {
      labels: ["May 1", "May 2", "May 3", "May 4", "May 5", "May 6", "May 7"],
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
      // Make chart label unclickable
      legend: {
        onClick: (e) => e.stopPropagation(),
      },
    },
    pointCardLabels: {
      weekly: "Points Earned This Week",
      monthly: "Points Earned This Month",
      total: "Total Points Earned",
    },

    pointCardPoints: { weekly: "1234", monthly: "12345", total: "1234567" },
  }),
};
</script>
