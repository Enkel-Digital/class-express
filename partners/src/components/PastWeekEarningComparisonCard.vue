<template>
  <div class="col-md-4 col-12" align="left">
    <v-card class="mx-auto">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline"
            >Earning Comparison with Past Week</v-list-item-title
          >
          <!-- <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <v-list class="transparent">
        <v-list-item v-for="item in earnings" :key="item.day">
          <v-list-item-title>{{ item.week }}</v-list-item-title>

          <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>-->

          <v-list-item-action-text class="text-right">
            {{ item.earning }} points
          </v-list-item-action-text>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text>Full Report</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Past-Week-Earning-Comparison",
  data() {
    return {
      earnings: [
        {
          week: "Last Week",
          earning: "266"
        },
        {
          week: "This Week",
          earning: "135"
        }
      ]
    };
  }
};
</script>
