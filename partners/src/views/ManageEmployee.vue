<template>
  <v-content id="ManageEmployee">
    <masonry
      :cols="{ default: 6, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '0.5em', 700: '0.25em' }"
    >
      <v-card
        v-for="employee in employees"
        class="class-card"
        :key="employee.id"
        outlined
        width="15em"
      >
        <v-list-item two-line>
          <v-list-item-content>
            <div v-resize-text>{{ employee.name }}</div>
            <v-list-item-subtitle>{{ employee.email }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ employee.position }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item-avatar size="80">
          <v-img :src="employee.picture" alt="Logo" />
        </v-list-item-avatar>

        <v-card-actions class="justify-center pa-0">
          <v-btn small text>Delete</v-btn>
          <v-btn small text @click="moreInfo(employee.id)">more info</v-btn>
        </v-card-actions>

        <!-- <v-card-actions class="justify-center pa-0">
          <v-btn text>more info</v-btn>
        </v-card-actions> -->
      </v-card>
    </masonry>

    <v-dialog v-model="dialog" width="20em">
      <v-card>
        <v-card-actions>
          <v-spacer />
          <v-btn color="rgb(65.9%, 65.9%, 65.9%)" icon @click="dialog = false"
            ><v-icon>mdi-window-close</v-icon></v-btn
          >
        </v-card-actions>

        <v-list-item class="text-left">
          <v-list-item-content>
            <v-list-item-subtitle
              >Name: {{ this.employeeInfo.name }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >Email: {{ this.employeeInfo.email }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >Mobile No: {{ this.employeeInfo.mobile }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >Position:{{ this.employeeInfo.position }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >Birthdate:
              {{ this.employeeInfo.birthdate }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
// import ResizeText from "vue-resize-text";
import { mapState } from "vuex";
import api from "../store/utils/fetch";

export default {
  data() {
    return {
      employees: [],
      dialog: false,
      employeeInfo: [
        {
          id: "",
          name: "",
          email: "",
          mobile: "",
          position: "",
          birthdate: "",
          picture: "",
        },
      ],
    };
  },
  name: "ManageEmployees",
  directives: {
    ResizeText: () => import("vue-resize-text"),
  },

  props: {
    partnerID: {
      default: 1,
      type: Number,
    },
  },
  created() {
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      this.employees = (
        await api.get(`/employees/all/${this.partnerID}`)
      ).employees;
      console.log("this", this.employees);
    },
    moreInfo(id) {
      console.log("id", this.employees[id - 1].name);
      this.dialog = true;
      this.employeeInfo.id = id - 1;
      this.employeeInfo.name = this.employees[id - 1].name;
      this.employeeInfo.email = this.employees[id - 1].email;
      this.employeeInfo.mobile = this.employees[id - 1].phoneNumber;
      // this.employeeInfo.position = this.employees[id-1].position;
      // this.employeeInfo.birthdate = this.employees[id].birthdate;
      // this.employeeInfo.picture = this.employees[id].picture;

      // console.log("id" + this.employees[id].name);
    },
  },
};
</script>

<style scoped>
#ManageEmployee {
  margin: 2em;
  margin-top: 2em;
}
.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
