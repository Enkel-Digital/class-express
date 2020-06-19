<template>
  <v-content id="AllClasses">
    <masonry
      :cols="{ default: 4, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '30px', 700: '20px' }"
    >
      <div v-for="(item, index) in 10" :key="index" class="item">
        <v-card class="mx-auto" max-width="344" outlined>
          <div v-resize-text>Hello Vue</div>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">OVERLINE</div>
              <v-list-item-title class="headline mb-1"
                >Headline 5</v-list-item-title
              >
              <v-list-item-subtitle
                >Greyhound divisely hello coldly
                fonwderfully</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </masonry>
  </v-content>
</template>

<script>
import { mapState } from "vuex";
import ResizeText from "vue-resize-text";

export default {
  directives: {
    ResizeText,
  },
};
</script>

<style scoped>
#AllClasses {
  margin: 2em;
  margin-top: 2em;
}

.class-card {
  display: inline-block;
  margin-right: 2em;
  margin-bottom: 2em;
}

.class-image {
  max-width: 17em;
}
</style>
