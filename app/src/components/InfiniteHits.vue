<template>
  <div v-if="state">
    <div v-for="hit in state.hits" :key="hit.objectID">
      <slot name="item" :item="hit" />
    </div>

    <div
      v-observe-visibility="visibilityChanged"
      style="list-style-type: none"
    />
  </div>
</template>

<script>
import { createWidgetMixin } from "vue-instantsearch";
import { connectInfiniteHits } from "instantsearch.js/es/connectors";
import { ObserveVisibility } from "vue-observe-visibility";

export default {
  mixins: [createWidgetMixin({ connector: connectInfiniteHits })],
  directives: {
    "observe-visibility": ObserveVisibility,
  },

  methods: {
    visibilityChanged(isVisible) {
      if (isVisible && !this.state.isLastPage) this.state.showMore();
    },
  },
};
</script>
