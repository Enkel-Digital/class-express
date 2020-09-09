<template>
  <v-dialog v-if="showDialog" v-model="showDialog" persistent>
    <v-card>
      <v-card-title class="headline">
        {{ dialog.name }}
      </v-card-title>
      <v-card-text>
        {{ dialog.description }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <!-- Update their on clicks -->
        <v-btn color="red darken-1" text @click="disagree"> Disagree </v-btn>
        <v-btn color="green darken-1" text @click="agree"> Agree </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "InternalNotificationDialog",
  data() {
    return {
      dialog: {
        name: "Location Policy",
        description:
          "Class Express will use your location to determine the closes class to you.",
      },
    };
  },
  computed: {
    showDialog() {
      return false;
    },
  },
};
</script>
