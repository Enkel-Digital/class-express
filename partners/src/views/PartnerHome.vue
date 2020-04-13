<template>
  <div class="v-responsive mx-auto overflow-visible" style="max-width:1024px;">
    <div class="v-responsive__content">
      <div class="container">
        <v-toolbar>
          <img src="@/assets/logo.png" style="height: inherit;" />
          <v-toolbar-title>Your Dashboard</v-toolbar-title>
        </v-toolbar>
        <div class="row">
          <template v-for="item in dashboardItems">
            <div class="col-md-4 col-12" v-bind:key="item.index">
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
                      <span>{{item.valuation}}</span>
                    </div>
                    <div class="v-list-item__subtitle">
                      <span>{{item.measure}}</span>
                    </div>
                  </div>
                  <!---->
                </a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "partnerHome",
  data() {
    return {
      dashboardItems: [
        { index: "1", measure: "Bookings Confirmed", valuation: "18" },
        { index: "2", measure: "Credits Earned This Week", valuation: "2069" },
        { index: "3", measure: "Profile Visits", valuation: "1470" }
      ]
    };
  }
};
</script>