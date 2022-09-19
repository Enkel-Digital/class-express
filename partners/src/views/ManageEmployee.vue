<template>
  <v-main id="ManageEmployee">
    <masonry
      :cols="{ default: 6, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '0.5em', 700: '0.25em' }"
    >
      <v-card
        v-for="employee in employees"
        class="employee-card"
        :key="employee.id"
        outlined
        width="15em"
      >
        <div @click="moreInfo(employee.id)">
          <v-list-item two-line>
            <v-list-item-content>
              <div>{{ employee.name }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item-avatar size="80">
            <!-- @todo Add a default generic avatar image -->
            <v-img :src="employee.picture" alt="Logo" />
          </v-list-item-avatar>
        </div>
      </v-card>
    </masonry>

    <v-dialog v-model="employeeDetailDialog" width="20em">
      <v-card>
        <!-- @todo Add a createdAt time with moments -->
        <!-- @todo Fix the UI, use higher contrasts -->
        <v-list-item class="text-left">
          <v-list-item-content>
            <v-list-item-title>
              Name: {{ employeeInfo.name }}
            </v-list-item-title>
            <v-list-item-title>
              Admin: {{ employeeInfo.admin }}
            </v-list-item-title>
            <v-list-item-title>
              Email: {{ employeeInfo.email }}
            </v-list-item-title>
            <v-list-item-title>
              Phone Number: {{ employeeInfo.phoneNumber }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="red" @click="deleteEmployee(employeeInfo.id)">
            Delete
          </v-btn>

          <!-- <v-btn text @click="moreInfo(employeeInfo.id)">more info</v-btn> -->
          <!-- <v-spacer /> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addEmployeeDialog" width="50%">
      <v-form ref="form">
        <v-card>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" icon @click="addEmployeeDialog = false">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </v-card-actions>

          <h2 style="color: #455a64" class="font-weight-light">
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
  </v-main>
</template>

<script>
import { mapState } from "vuex";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

export default {
  name: "ManageEmployees",

  created() {
    // Always reload employee data from API on load
    // @todo Can optimize by checking with the API, instead of getting directly, e.g. GET /employees/:partnerID?lastQueryTime=...&hash-...
    // @todo Check for new updates using either the last query time or a hash of the current items.
    this.$store.dispatch("employees/getEmployees");
  },

  data() {
    return {
      employeeDetailDialog: false,

      addEmployeeDialog: false,

      formRule: [(v) => !!v || "Field is required!"],

      // Used to store the currently selected employee details
      employeeInfo: {},

      // Object for inserting values for creating new employees
      newEmployee: {
        name: "",
        email: "",
        admin: false,
      },
    };
  },

  // Only employees values are needed to be binded in from vuex
  computed: mapState("employees", ["employees"]),

  methods: {
    moreInfo(id) {
      this.employeeInfo = this.employees.find((employee) => id === employee.id);
      this.employeeDetailDialog = true;
    },

    async createNewEmployee() {
      // @todo Call validate? Does this return?
      this.validate();

      const response = await apiWithLoader.post("/employees/new", {
        accountCreationRequest: {
          ...this.newEmployee,
          partnerID: this.$store.state.user.partnerID,
        },
        // Set the redirectUrl according to the build environment to allow for local testing
        // @todo Update the domain once it is confirmed
        redirectUrl:
          process.env.NODE_ENV.toLowerCase() === "production"
            ? "https://partners.enkeldigital.com/#/signup"
            : "http://localhost:8081/#/signup",
      });

      if (!response.success) return apiError(response, this.createNewEmployee);

      // Close the new employee dialog
      this.addEmployeeDialog = false;

      // Reset the data after submit to allow another request
      this.newEmployee = {
        name: "",
        email: "",
        admin: false,
      };
    },

    async deleteEmployee(employeeID) {
      // @todo Add a confirmation check, either using alert or a in app dialog

      const response = await apiWithLoader.delete(`/user/${employeeID}`);
      if (!response.success) return apiError(response, this.deleteEmployee);

      // Close the employee details dialog once delete completes
      this.employeeDetailDialog = false;
    },

    validate() {
      if (this.$refs.form.validate()) {
        this.addEmployeeDialog = false;
      }
    },
  },
};
</script>

<style scoped>
#ManageEmployee {
  margin: 2em;
  margin-top: 2em;
}
.employee-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
