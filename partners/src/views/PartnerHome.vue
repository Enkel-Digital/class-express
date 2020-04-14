<template>
  <v-content class="ClassDetails">
    <div
      class="v-responsive mx-auto overflow-visible"
      style="max-width:1024px;"
    >
      <div class="container">
        <v-toolbar>
          <img src="@/assets/logo.png" style="height: inherit;" />
          <v-toolbar-title>Your Dashboard</v-toolbar-title>
        </v-toolbar>

        <div class="row">
          <BookingsCard />

          <div class="col-md-4 col-12">
            <div class="v-card v-card--outlined v-sheet theme--light">
              <a
                href="/en/components/buttons/"
                tabindex="0"
                class="v-list-item--doc v-list-item v-list-item--link theme--light primary--text"
              >
                <div
                  class="v-avatar v-list-item__avatar indigo darken-1"
                  style="height:40px;min-width:40px;width:40px;"
                >
                  <i
                    aria-hidden="true"
                    class="v-icon notranslate mdi mdi-view-dashboard theme--dark"
                  ></i>
                </div>
                <div class="v-list-item__content">
                  <div class="v-list-item__title">
                    <span>{{ "2069" }}</span>
                  </div>
                  <div class="v-list-item__subtitle">
                    <span>{{ "Points Earned This Week" }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div class="col-md-4 col-12">
            <div class="v-card v-card--outlined v-sheet theme--light">
              <a
                href="/en/components/buttons/"
                tabindex="0"
                class="v-list-item--doc v-list-item v-list-item--link theme--light primary--text"
              >
                <div
                  class="v-avatar v-list-item__avatar indigo darken-1"
                  style="height:40px;min-width:40px;width:40px;"
                >
                  <i
                    aria-hidden="true"
                    class="v-icon notranslate mdi mdi-view-dashboard theme--dark"
                  ></i>
                </div>
                <div class="v-list-item__content">
                  <div class="v-list-item__title">
                    <span>{{ "1470" }}</span>
                  </div>
                  <div class="v-list-item__subtitle">
                    <span>{{ "Profile Visits" }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-content>
</template>

<script>
import BookingsCard from "@/components/BookingsCard.vue";

export default {
  name: "partnerHome",
  components: {
    BookingsCard
  },
  data() {
    return {};
  }
};
</script>
