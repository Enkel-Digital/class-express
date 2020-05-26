<template>
  <v-content id="AllClasses">
    <v-btn class="ma-2" outlined color="#546E7A"> Weekly</v-btn>

    <EarningsChart :chartdata="weeklyChartData" :options="weeklyChartOptions" />

    <v-btn class="ma-2" outlined color="#546E7A"> Monthly</v-btn>
    <EarningsChart
      :chartdata="monthlyChartData"
      :options="monthlyChartOptions"
    />

    <br />

    <v-row justify="center">
      <v-col cols="15" sm="6" md="3" :align="center">
        <v-card outlined text>
          <v-list-item>
            <v-icon color="#FFD600" large
              >mdi-currency-usd-circle-outline</v-icon
            >

            <v-list-item-content>
              <v-list-item-title class="text-center headline mb-1">
                {{ "9999" }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-center">
                {{ "Total Points Earned" }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="15" sm="6" md="3" :align="center">
        <v-card outlined text>
          <v-list-item>
            <v-icon color="gray" large>mdi-teach</v-icon>

            <v-list-item-content>
              <v-list-item-title class="text-center headline mb-1">
                {{ "9999" }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-center">
                {{ "Total Class Conducted" }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <br />

    <v-container grid-list-md>
      <v-card v-for="clas in classes" :key="clas.id" outlined text>
        <v-list-item>
          <v-list-item-avatar size="50">
            <img alt="Avatar" :src="clas.pictureSources[0]" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="text-center headline mb-0">
              {{ clas.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-center">
              {{ "Total Points: 20" }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-spacer></v-spacer>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
import EarningsChart from "@/components/EarningsChart.vue";

export default {
  name: "AllClasses",
  data: () => ({
    weeklyChartData: {
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
    weeklyChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        onClick: (e) => e.stopPropagation(),
      },
    },

    monthlyChartData: {
      labels: [
        "May 1",
        "May 2",
        "May 3",
        "May 4",
        "May 5",
        "May 6",
        "May 7",
        "May 8",
        "May 9",
        "May 10",
        "May 11",
        "May 12",
        "May 13",
        "May 14",
        "May 15",
        "May 16",
        "May 17",
        "May 18",
        "May 19",
        "May 20",
        "May 21",
        "May 22",
      ],
      datasets: [
        {
          label: "Points Earned",
          backgroundColor: "#78909C",
          borderColor: "#455A64",
          borderWidth: "2",
          fill: false,
          data: [
            60,
            50,
            60,
            90,
            50,
            43,
            54,
            70,
            60,
            50,
            60,
            90,
            50,
            43,
            54,
            70,
            60,
            50,
            60,
            90,
            70,
            50,
          ],
        },
      ],
    },
    monthlyChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      // Make chart label unclickable
      legend: {
        onClick: (e) => e.stopPropagation(),
      },
    },
  }),
  components: {
    EarningsChart,
  },
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all classes of partner
    this.$store.dispatch("classes/getAllClasses");
  },
  computed: {
    classes() {
      return [
        {
          id: 0,
          name: "Basic guitar",
          pictureSources: [
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg",
          ],
        },
        {
          id: 1,
          name: "Intermediate guitar",
          pictureSources: [
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg",
          ],
        },
        {
          id: 2,
          name: "Advance guitar",
          pictureSources: [
            "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg",
          ],
        },
      ];
    },
  },
};
</script>

<style scoped>
#AllClasses {
  margin: 4em;
  margin-top: 2em;

  text-align: left;
}

.class-card {
  display: inline-block;

  margin-right: 4em;
}

.class-image {
  max-width: 26em;
}
</style>
