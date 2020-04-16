<template>
  <v-content class="ClassDetails">
    <!-- <v-responsive class="mx-auto" style="max-width:1024px;"> -->
    <v-container>
      <v-toolbar>
        <img src="@/assets/logo.png" style="height: inherit;" />

        <v-toolbar-title>Your Dashboard</v-toolbar-title>
      </v-toolbar>

      <div class="row">
        <BookingsCard />
        <PointsEarnedCard />
        <ProfileVisitsCard />
      </div>

      <br />
      <div class="row">
        <DashboardEarningsSparkline />
        <PastWeekEarningComparison />
      </div>
    </v-container>
    <!-- </v-responsive> -->
  </v-content>
</template>

<script>
import BookingsCard from "@/components/BookingsCard.vue";
import PointsEarnedCard from "@/components/PointsEarnedCard.vue";
import ProfileVisitsCard from "@/components/ProfileVisitsCard.vue";
import DashboardEarningsSparkline from "@/components/DashboardEarningsSparkline.vue";
import PastWeekEarningComparison from "@/components/PastWeekEarningComparisonCard.vue";

export default {
  name: "home",
  components: {
    BookingsCard,
    PointsEarnedCard,
    ProfileVisitsCard,
    DashboardEarningsSparkline,
    PastWeekEarningComparison
  }
};
</script>
