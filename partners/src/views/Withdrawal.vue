<template>
  <v-main id="currency">
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
          />
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

      <v-list-item-group color="primary">
        <v-list-item
          v-for="clas in classes.slice().reverse()"
          :key="clas.id"
          class="class-card"
        >
          <v-list-item-content>
            <v-list-item-title class="title" align="left">
              {{ clas.date }}
            </v-list-item-title>
            <br />
            <v-list-item-subtitle align="left">
              <v-row>
                <v-col>
                  {{ clas.amount }}<v-icon>mdi-arm-flex </v-icon
                  ><v-icon large>mdi-arrow-left-right-bold</v-icon>
                  {{ selectedCurrency.symbol }}{{ convertedAmount[clas.id] }}
                </v-col>
                <v-col align="end"> Paid out via {{ clas.payment }} </v-col>
              </v-row>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-card>
  </v-main>
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
    convertedAmount() {
      var amount = [];
      for (var i = 0; i < this.classes.length; i++) {
        amount.push(
          (this.classes[i].amount * this.selectedCurrency.rate).toFixed(2)
        );
      }
      return amount;
    },
    classes() {
      return [
        {
          id: 0,
          date: "17 January 2020",
          amount: 20,
          payment: "paypal",
        },
        {
          id: 1,
          date: "18 January 2020",
          amount: 100,
          payment: "mastercard ending with 8542",
        },
        {
          id: 2,
          date: "19 January 2020",
          amount: 60,
          payment: "visa ending with 6184",
        },
        {
          id: 3,
          date: "20 January 2020",
          amount: 50,
          payment: "mastercard ending with 3258",
        },
        {
          id: 4,
          date: "21 January 2020",
          amount: 2000,
          payment: "mastercard ending with 3258",
        },
      ];
    },
  },
};
</script>
