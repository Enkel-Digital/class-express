<template>
  <v-main id="Dashboard">
    <v-toolbar dense class="overline font-weight-light elevation-0">
      <v-toolbar-title>Your Dashboard</v-toolbar-title>
    </v-toolbar>
    <!-- <br /> -->

    <masonry
      :cols="{ default: 8, 1920: 6, 700: 4, 400: 3 }"
      :gutter="{ default: '0.5em', 700: '0.25em' }"
    >
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

      <br />
    </masonry>
    <EarningsChart :chartdata="chartdata" :options="options" />
    <br />
    <PastWeekEarningComparison />
  </v-main>
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
  data() {
    return {
      chartdata: {
        labels: [],
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
    };
  },
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all classes of partner
    this.fetchDate();
  },
  methods: {
    fetchDate() {
      var now = new Date();
      var date = now.getDate();
      var weeklyChartData = [];
      var monday = this.getMonday(now).getDate();
      var a = 0;

      for (var j = monday; j < monday + 7; j++) {
        weeklyChartData[a] = j;
        a++;
      }
      this.chartdata.labels = weeklyChartData;
    },

    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },
  },
};
</script>

<style scoped>
#Dashboard {
  margin: 2em;
  margin-top: 1em;
}
.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
