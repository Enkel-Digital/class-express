<template>
  <v-content id="currency">
    <v-card class="ma-4">
      <v-row>
        <v-col class="my-0 py-0">
          <v-card-title>Balance</v-card-title>
        </v-col>
        <v-col cols="3" class="my-0 py-0">
          <v-select
            :items="currency"
            label="Currency"
            item-text="text"
            return-object="true"
            v-model="selectedCurrency"
          ></v-select>
        </v-col>
      </v-row>
      <div class="display-2 font-weight-light text-start mx-4">
        {{ points }}<v-icon x-large>mdi-arm-flex </v-icon>
        <v-icon large>mdi-arrow-left-right-bold</v-icon>
        {{ selectedCurrency.symbol }}{{ convertedCurrency }}<br />
        <v-btn rounded color="primary" dark>Withdraw</v-btn>
      </div>

      Available
    </v-card>
    <v-card class="ma-4">
      <v-row>
        <v-col class="my-0 py-0">
          <v-card-title>Recent History</v-card-title>
        </v-col>
      </v-row>

      <v-list-item-group v-model="item" color="primary">
        <v-list-item v-for="clas in classes" :key="clas.id" class="class-card">
        </v-list-item>
      </v-list-item-group>
    </v-card>
  </v-content>
</template>

<script>
export default {
  data() {
    const currency = {
      SGD: { text: "SGD", symbol: "$", rate: "1" },
      EUR: { text: "EUR", symbol: "€", rate: "0.64" },
      GBP: { text: "GBP", symbol: "£", rate: "0.64" },
      USD: { text: "USD", symbol: "$", rate: "0.71" },
      RMB: { text: "RMB", symbol: "元", rate: "5.08" },
      TWD: { text: "TWD", symbol: "NT$", rate: "21.34" },
      THB: { text: "THB", symbol: "฿", rate: "22.54" },
      MYR: { text: "MYR", symbol: "RM", rate: "3.05" },
      KRW: { text: "KRW", symbol: "₩", rate: "869.7" },
      IDR: { text: "IDR", symbol: "Rp", rate: "10120.96" },
      JPY: { text: "JPY", symbol: "¥", rate: "130.07" },
    };

    return {
      currency: Object.values(currency),
      selectedCurrency: { text: "SGD", symbol: "$", rate: "1" },
      points: 70,
    };
  },
  computed: {
    convertedCurrency() {
      return (this.points * this.selectedCurrency.rate).toFixed(2);
    },
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
