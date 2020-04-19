<template>
  <v-content id="AllClasses">
    <h2 style="color:#455A64;">Add New Class</h2>
    <br />
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="15" sm="6" md="6">
            <v-text-field label="Class Name"></v-text-field>
          </v-col>

          <v-col cols="15" sm="6" md="6">
            <v-text-field label="Location"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col style="width: 250px; flex: 0 1 auto;">
            <h3 style="color:#455A64;">Start</h3>
            <v-time-picker v-model="start" :max="end" full-width color="#455A64"></v-time-picker>
          </v-col>

          <v-col style="width: 250px; flex: 0 1 auto;">
            <h3 style="color:#455A64;">End</h3>
            <v-time-picker v-model="end" :min="start" full-width color="#455A64"></v-time-picker>
          </v-col>
        </v-row>

        <h3 style="color:#455A64;">Date</h3>
        <v-date-picker
          v-model="date"
          full-width
          :landscape="$vuetify.breakpoint.smAndUp"
          class="mt-4"
          color="#455A64"
        ></v-date-picker>

        <!-- add class image. method to choose image file and upload is in bookmark. -->
        <br />

        <v-textarea
          v-autofocus
          type="text"
          v-model="description"
          filled
          rows="4"
          placeholder="Enter class description"
          no-resize
          required
        />
      </v-container>
    </v-form>
  </v-content>
</template>

<script>
export default {
  data: () => ({
    time: "11:15",
    date: new Date().toISOString().substr(0, 10)
  })
};
</script>

<style scoped>
#AllClasses {
  margin: 4em;
  margin-top: 2em;

  text-align: left;
}

.class-card {
  display: inline-block;

  margin-right: 4em;
}

.class-image {
  max-width: 26em;
}
</style>
