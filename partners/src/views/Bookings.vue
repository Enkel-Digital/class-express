<template>
  <v-content>
    <v-card>
      <v-card-title>
        Booking List
        <v-spacer />

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="student"
        :search="search"
        class="elevation-1"
        :sort-desc="[false, true]"
      >
        <template #item.classID="{ item }">
          <router-link
            :to="{ name: 'ClassDetails', params: { classID: item.classID } }"
          >
            Click to view
          </router-link>
        </template></v-data-table
      >
    </v-card>
  </v-content>
</template>

<script>
export default {
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all classes of partner
    this.$store.dispatch("classes/getAllClasses");
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "User ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Class Name", value: "className" },
        { text: "Start Time", value: "startTime" },
        { text: "Class Detail", value: "classID" },
      ],
      student: [
        {
          id: 200,
          name: "Takenoko no sato",
          email: "take@gmail.com",
          className: "Advanced Guitar",
          startTime: "09:00",
          classID: 2,
        },
        {
          id: 122,
          name: "Honey Butter Chips",
          email: "hbc@gmail.com",
          className: "Advanced Guitar",
          startTime: "09:00",
          classID: 2,
        },
        {
          id: 434,
          name: "Yanyan",
          email: "yan@gmail.com",
          className: "Advanced Guitar",
          startTime: "09:00",
          classID: 2,
        },
        {
          id: 939,
          name: "Pocky",
          email: "pocky@gmail.com",
          className: "Advanced Guitar",
          startTime: "09:00",
          classID: 2,
        },
        {
          id: 102,
          name: "Genki Sushi",
          email: "genki@gmail.com",
          className: "Basic Guitar",
          startTime: "13:00",
          classID: 0,
        },
        {
          id: 149,
          name: "Koi",
          email: "koi@gmail.com",
          className: "Basic Guitar",
          startTime: "13:00",
          classID: 0,
        },
        {
          id: 687,
          name: "Haribo",
          email: "haribo@gmail.com",
          className: "Basic Guitar",
          startTime: "13:00",
          classID: 0,
        },
        {
          id: 157,
          name: "Hello Panda",
          email: "hp@gmail.com",
          className: "Basic Guitar",
          startTime: "13:00",
          classID: 0,
        },
        {
          id: 976,
          name: "Green Tea Latte",
          email: "green@gmail.com",
          className: "Basic Guitar",
          startTime: "13:00",
          classID: 0,
        },
      ],
    };
  },
};
</script>
