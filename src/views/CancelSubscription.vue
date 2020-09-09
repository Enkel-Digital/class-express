<template>
  <v-main id="cancel-subscription">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Cancel Subscription</v-toolbar-title>
    </v-app-bar>

    <h3 style="color: rgba(0, 0, 0, 0.65)" class="ma-5 mb-0">
      We are sad to see you go.
    </h3>

    <!-- Update below to show one of the cards what is your current plan -->
    <v-responsive>
      <v-list-item class="mb-0 pb-0 mt-0 pt-0">
        <v-list-item>
          <v-list-item-content style="color: rgba(0, 0, 0, 0.8)">
            Our Monthly subscription plans give you points for less!
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-responsive>

    <PointsCard />

    <br />
    <h3 style="color: rgba(0, 0, 0, 0.65)" class="ml-5">Subscription Plan</h3>
    <p style="color: rgba(0, 0, 0, 0.6)" class="ml-5 mb-0">
      Your current plan is ... and will end on
      <span style="font-weight: bold">
        will end on {{ moment.unix(periodEndDate).format("DD/MM/YYYY") }}
      </span>
    </p>

    <h3 style="color: rgba(0, 0, 0, 0.65)" class="ma-5 mb-0">
      May we know why you are leaving?
    </h3>
    <v-container fluid>
      <!-- Hard coded list of questions and IDs for now. -->
      <v-checkbox
        v-for="reason in reasons"
        :key="reason.id"
        :label="reason.reason"
        v-model="reason.selected"
        style="margin: 0; padding: 0"
      />

      Anything else to add?
      <v-textarea
        v-autofocus
        type="text"
        v-model="otherReasons"
        filled
        rows="2"
        placeholder="Other reasons ..."
        no-resize
        required
      />

      <v-checkbox
        v-model="noContact"
        label="If you do not want us to contact you"
        style="margin: 0; padding: 0"
      />
    </v-container>

    <v-btn
      @click="cancelPlan"
      max-width="calc(100% - 3em)"
      outlined
      block
      color="red"
    >
      submit & cancel plan
    </v-btn>
  </v-main>
</template>

<script>
import BackBtn from "@/components/BackBtn";
import PointsCard from "@/components/PointsCard";
import { mapState, mapGetters } from "vuex";

export default {
  name: "cancel-subscription",
  components: {
    BackBtn,
    PointsCard,
  },
  data() {
    return {
      // @todo Hardcoded for now, but to get from API
      // Or perhaps is fine to leave here too to reduce latency
      reasons: [
        {
          id: "0",
          reason: "Too expensive",
        },
        {
          id: "1",
          reason: "Not enought class choices",
        },
        {
          id: "2",
          reason: "App is hard to use",
        },
      ],
      otherReasons: "",
      noContact: false,
    };
  },
  computed: {
    periodEndDate() {
      return this.$store.state.points.points.period.end;
    },
    ...mapGetters("subscription", ["currentPlan"]),
  },
  methods: {
    async cancelPlan() {
      // @todo Change window.confirm to dialog box
      if (confirm("Are you sure you want to cancel?")) {
        // @todo Show "loading" UI

        // Parse out data values from component object to submit
        const { otherReasons, noContact } = this;
        const reasonsID = this.reasons
          .filter((reason) => reason.selected)
          .map((reason) => reason.id);

        // Pessimistic UI thus awaiting
        // Cancel plan and Submit cancellation reasons
        await this.$store.dispatch("subscription/cancelPlan", {
          reasonsID,
          otherReasons,
          noContact,
        });

        // @todo Stop "loading" UI

        // Redirect back to somewhere, either profile or subscription plan?
      }
    },
  },
};
</script>

<style scoped>
#cancel-subscription {
  text-align: left;
}
</style>
