<template>
  <!-- Using an inline component as a container -->
  <span>
    <!--
      Using a higher z-index to overlay on top of v-bottom-navigation and v-app-bar components
      at z-index of 4 and 5 respectively
      Defaults to 5 if not set.

      Using v-if for conditional rendering instead of value's conditional display

      @todo
      right now top-level loader is masked behind the ErrorDialog
      ErrorDialog have a "202" z-index so we must use "203" for overlay
    -->
    <v-overlay v-if="showFullLoader" :value="true" :z-index="fullLoaderZIndex">
      <!-- Size 64 is in px ~ around 4em -->
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <!--
      Using system-bar with app attribute to ensure loader appears on top of v-app-bar components.
      Since v-app-bar will be placed at the top when used with app attributes.
      Using height attribute of "4" to match the default height of v-progress-linear
      Set height to be the same to prevent showing extra spaces beneath the progress bar.
    -->
    <v-system-bar app v-else-if="showTopLoader" :height="topLoaderHeight">
      <v-progress-linear indeterminate absolute top />
    </v-system-bar>
  </span>
</template>

<script>
/**
 * Global loader/loading component to show loading status.
 * Can be used by any component/module to indicate loading in progress.
 * Prevents duplicate implementation
 *
 *
 * There are 2 types of loaders,
 * There is the full screen overlay circular loader,
 * And there is the top level linear loader on top of app bars.
 * At any one point in time, only one loader can be shown and full screen overlay loader has precedence
 *
 * The full screen overlay loader have priority over the top level linear loader
 * But by default show loading requests shows the top level linear loader
 */
export default {
  name: "loader",
  props: {
    fullLoaderZIndex: {
      type: Number,
      default: 6,
    },
    topLoaderHeight: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    // Cant do this because, this is bounded to the computed object {}
    // showFullLoader: this.$loader.showFullLoader,
    // showTopLoader: this.$loader.showTopLoader,

    // Using controller attached to global Vue, Vue needs to be imported in this component
    // showFullLoader: Vue.$loader.showFullLoader,
    // showTopLoader: Vue.$loader.showTopLoader,

    // wrap it inside functions to access "this" vue instance injected in
    showFullLoader() {
      return this.$loader.showFullLoader();
    },
    showTopLoader() {
      return this.$loader.showTopLoader();
    },
  },
};
</script>
