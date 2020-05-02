<template>
  <v-content id="AllClasses">
    <h1 style="font-size:200px" class="display-1 text-md-center">Earnings</h1>

    <br />

    <v-card class="mx-auto" color="#455A64" dark max-width="900">
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-sparkline
            :value="value"
            color="rgba(255, 255, 255, .7)"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
          >
            <template v-slot:label="item">${{ item.value }}</template>
          </v-sparkline>
        </v-sheet>
      </v-card-text>

      <v-card-text>
        <div class="display-1 font-weight-thin text-md-center">
          Sales Last 24h
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center">
        <v-btn block text>Go to Report</v-btn>
      </v-card-actions>
    </v-card>

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
export default {
  data: () => ({
    value: [423, 446, 675, 510, 590, 610, 760]
  }),
  name: "AllClasses",
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
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
          ]
        },
        {
          id: 1,
          name: "Intermediate guitar",
          pictureSources: [
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
          ]
        },
        {
          id: 2,
          name: "Advance guitar",
          pictureSources: [
            "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
          ]
        }
      ];
    }
  }
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
