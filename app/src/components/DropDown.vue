<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">
          <v-icon left>mdi-sort</v-icon>
          Sort By
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="say(item.title)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: "Rate" },
      { title: "Points" },
      { title: "Distance" },
      { title: "Recommand" }
    ]
  }),
  methods: {
    say: function(message) {
      console.log(message);
    }
  }
};
</script>
