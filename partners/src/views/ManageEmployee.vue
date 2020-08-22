<template>
  <v-main id="ManageEmployee">
    <masonry
      :cols="{ default: 6, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '0.5em', 700: '0.25em' }"
    >
      <v-card
        v-for="employee in employee"
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

    <v-fab-transition>
      <v-btn
        @click="addEmployeeDialog = true"
        color="#60696c"
        fab
        dark
        large
        absolute
        bottom
        right
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-dialog v-model="dialog" width="20em">
      <v-card>
        <v-card-actions>
          <v-spacer />
          <v-btn color="rgb(65.9%, 65.9%, 65.9%)" icon @click="dialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-card-actions>

        <v-list-item class="text-left">
          <v-list-item-content>
            <v-list-item-subtitle>
              Name: {{ this.employeeInfo.name }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Email: {{ this.employeeInfo.email }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Mobile No: {{ this.employeeInfo.mobile }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Position: {{ this.employeeInfo.position }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Birthdate: {{ this.employeeInfo.birthdate }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addEmployeeDialog" width="50%">
      <v-form ref="form">
        <v-card>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="rgb(65.9%, 65.9%, 65.9%)"
              icon
              @click="addEmployeeDialog = false"
            >
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </v-card-actions>

          <h2 style="color: #455a64;" class="font-weight-light">
            ADD NEW EMPLOYEE
          </h2>

          <v-card-text>
            <v-text-field
              v-model="newEmployee.name"
              label="Employee Name"
              :rules="formRule"
              color="#60696c"
              required
            />
            <v-text-field
              v-model="newEmployee.email"
              label="Employee Email"
              :rules="formRule"
              color="#60696c"
              required
            />

            <v-switch
              v-model="newEmployee.admin"
              label="Grant employee admin access?"
              color="#60696c"
            />
            <v-btn
              color="#60696c"
              @click="createNewEmployee"
              rounded
              width="10em"
              outlined
              depressed
            >
              Submit
            </v-btn>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-main>
</template>

<script>
// import ResizeText from "vue-resize-text";
import { mapState } from "vuex";
import api from "../store/utils/fetch";

export default {
  data() {
    return {
      addEmployeeDialog: false,
      dialog: false,
      formRule: [
        (v) => !!v || "Field is required!",
        (v) => (v && v.length <= 20) || "Please fill is the required space",
      ],
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

      // Object for inserting values for creating new employees
      newEmployee: {
        name: "",
        email: "",
        admin: false,
      },
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
    this.$store.dispatch("employees/getEmployees", this.partnerID);
  },
  methods: {
    moreInfo(id) {
      console.log("id", this.employee[id - 1].name);
      this.dialog = true;
      this.employeeInfo.id = id - 1;
      this.employeeInfo.name = this.employee[id - 1].name;
      this.employeeInfo.email = this.employee[id - 1].email;
      this.employeeInfo.mobile = this.employee[id - 1].phoneNumber;
      // this.employeeInfo.position = this.employees[id-1].position;
      // this.employeeInfo.birthdate = this.employees[id].birthdate;
      // this.employeeInfo.picture = this.employees[id].picture;
    },

    createNewEmployee() {
      // @todo Call validate? Does this return?
      this.validate();

      console.log("newEmployee", this.newEmployee);

      // @todo Submit data to API

      // Reset the data after submit to allow another request
      this.newEmployee = {
        name: "",
        email: "",
        admin: false,
      };
    },

    validate() {
      if (this.$refs.form.validate()) {
        this.addEmployeeDialog = false;
      }
    },
  },
  computed: {
    ...mapState("employees", ["employee"]),
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
