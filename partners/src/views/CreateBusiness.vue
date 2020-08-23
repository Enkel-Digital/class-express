<template>
  <div>
    <!-- Dialog to inform user to verify email before redirecting them to the login page -->
    <v-dialog v-model="verifyEmailDialog" max-width="40%">
      <v-card>
        <v-card-title class="headline">
          Please verify your email before logging in!
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="$router.replace({ name: 'login' })"
          >
            login now!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="10" sm="5">
        <img
          alt="Login image"
          src="../assets/logo.png"
          width="360"
          height="360"
        />
        <h2 class="font-weight-light">Let's Get Started!</h2>

        <br />

        <h4 class="font-weight-light">
          Already have an account?
          <router-link :to="{ name: 'login' }">
            Login here!
          </router-link>
        </h4>
      </v-col>

      <!-- stepper componentr -->
      <v-col cols="10" sm="5">
        <v-stepper v-model="step" vertical>
          <v-stepper-step color="#60696c" :complete="step > 1" step="1">
            Business Owner Details
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="ownerLoginDetails">
              <v-text-field
                v-model="name"
                label="Name"
                :rules="nameRules"
                prepend-icon="mdi-account"
              />

              <!-- @todo Show a tip or something to let user know that this should be a "company" email and this email will be the one used for registration -->
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                prepend-icon="mdi-email"
                required
              />

              <v-text-field
                v-model="phoneNumber"
                :rules="phoneRules"
                label="Mobile Number"
                hint="For verification and emergency purposes"
                prepend-icon="mdi-cellphone"
                required
              />
            </v-form>

            <v-btn
              width="20em"
              color="#60696c"
              outlined
              @click="validateOwnerLoginDetails"
            >
              Continue
            </v-btn>
          </v-stepper-content>

          <v-stepper-step color="#60696c" :complete="step > 2" step="2">
            Company Information
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form ref="ownerCompanyDetails">
              <v-text-field
                v-model="companyName"
                :rules="nameRules"
                label="Company Name"
                required
                prepend-icon="mdi-card-account-details"
              />

              <!-- @todo Use the user's email as the default email here, but do not share the v-model -->
              <v-text-field
                v-model="companyEmail"
                :rules="emailRules"
                label="Email"
                prepend-icon="mdi-email"
                required
              />

              <v-text-field
                v-model="companyPhoneNumber"
                :rules="phoneRules"
                label="Telephone Number"
                prepend-icon="mdi-phone"
                required
              />

              <v-text-field
                v-model="companyWebsite"
                label="Website (Optional, Must be https)"
                prepend-icon="mdi-web"
              />

              <v-text-field
                v-model="addressLine1"
                label="Address Line 1"
                :rules="nameRules"
                prepend-icon="mdi-map-marker"
                required
              />

              <v-text-field
                v-model="addressLine2"
                label="Address Line 2 (optional)"
                prepend-icon="mdi-map-marker"
              />

              <v-text-field
                v-model="unitNumber"
                :rules="nameRules"
                label="Unit No."
                hint="e.g. 01-02"
                prepend-icon="mdi-map-marker"
                required
              />

              <v-text-field
                v-model="postalCode"
                label="Postal Code"
                :rules="postalRules"
                prepend-icon="mdi-map-marker"
                required
              />

              <br />

              <v-textarea
                v-autofocus
                type="text"
                v-model="companyDescription"
                rows="4"
                :rules="nameRules"
                outlined
                placeholder="Describe your business"
                no-resize
                color="#60696c"
                required
              />

              <v-combobox
                v-model="partnerTags"
                :items="partnerTagsList"
                :rules="[(v) => !!v || 'Selection is required']"
                chips
                color="#60696c"
                clearable
                label="Select tags/categories that describe your business"
                multiple
                single-line
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    small
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </v-form>

            <v-btn
              color="#60696c"
              outlined
              width="20em"
              text
              @click="step -= 1"
            >
              Back
            </v-btn>
            <v-btn
              outlined
              color="#60696c"
              width="20em"
              @click="validateOwnerCompanyDetails"
            >
              Continue
            </v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 3" step="3">Finish</v-stepper-step>
          <v-stepper-content step="3">
            <h2>You are Set to Go!</h2>
            <v-btn width="20em" color="green" outlined @click="createPartner">
              register business now!
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </div>
</template>

<script>
/**
 * @todo - Add in browser's "required" attribute checker for input.
 */
import api from "../store/utils/fetch";

export default {
  name: "CreateBusiness",
  data() {
    return {
      verifyEmailDialog: false,

      // @todo To replace with API call
      partnerTagsList: ["tech", "cooking", "lifestyle", "music", "art"],

      name: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      companyEmail: "",
      companyWebsite: "",
      companyPhoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      unitNumber: "",
      postalCode: "",
      companyDescription: "",
      partnerTags: "", // @todo Shouldnt this be an array?

      step: 1,

      nameRules: [(v) => !!v || "Required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      phoneRules: [
        (v) => !!v || "Number is required",
        (v) => (v && v.length <= 8) || "Number is invalid",
      ],
      postalRules: [(v) => (v && v.length <= 6) || "Postal code is invalid"],
      businessTypes: [
        { name: "Sports", abbr: "", id: 1 },
        { name: "Tuition", abbr: "", id: 2 },
        { name: "IT", abbr: "", id: 3 },
        { name: "Music", abbr: "", id: 4 },
        { name: "Lifestyle", abbr: "", id: 5 },
      ],
      hasSaved: false,
      isEditing: null,
      model: null,
      company: [
        { name: "Florida", abbr: "FL", id: 1 },
        { name: "Georgia", abbr: "GA", id: 2 },
        { name: "Nebraska", abbr: "NE", id: 3 },
        { name: "California", abbr: "CA", id: 4 },
        { name: "New York", abbr: "NY", id: 5 },
      ],
    };
  },
  methods: {
    validateOwnerLoginDetails() {
      if (this.$refs.ownerLoginDetails.validate()) this.step++;
    },
    validateOwnerCompanyDetails() {
      if (this.$refs.ownerCompanyDetails.validate()) this.step++;
    },

    // Signups for employee / admin share the same flow, thus signup abstracts the common logic out and wraps calls to the specific signup flows.
    async createPartner() {
      // Show loading screen before signUp logic executes
      const loaderRequestID = this.$loader.new();

      try {
        // Make lowercase, refer to notes & faq on why this is lowercase.
        // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
        this.email = this.email.toLowerCase();

        /*
          Execute the specific signup logic based on the type of user
          This needs to be done before signout as the API calls in these signup flows need the auth token
          await to prevent signout from executing before API completes which might delete JWT before the API call is made due to nature of async call
          
          when an admin register his/her account along with the business profile
          partner needs to be created first, since SQL schema depends on partner to exists before a new partnerAccount can be created
        */
        const resPartner = await api.post("/partner/new", {
          partner: {
            name: this.companyName,
            phoneNumber: this.companyPhoneNumber,
            email: this.companyEmail,
            location_address:
              this.addressLine1 +
              " " +
              this.addressLine2 +
              " " +
              this.unitNumber,
            location_postalCode: this.postalCode,
            location_coordinates: "123.1234454, 23.234512",
            description: this.companyDescription,
            website: this.companyWebsite,
          },
        });

        // Check for success with resPartner and throw for signup logic to catch
        if (!resPartner.success) throw new Error(resPartner.error);
        //
        //
        //

        // Show dialog to inform user to verify email and allow them to redirect to login view
        this.verifyEmailDialog = true;
      } catch (error) {
        this.$error.new(
          this.$error.createError(
            this.$error.ERROR.level.RETRY,
            this.$error.ERROR.custom("Business Registration failed")
          )
        );
      } finally {
        // Remove loader after login logic completes regardless of whether signup failed or succeeded
        // Inside finally to ensure execution even if catch block was ran
        this.$loader.clear(loaderRequestID);
      }
    },

    remove(item) {
      this.partnerTags.splice(this.partnerTags.indexOf(item), 1);
      this.partnerTags = [...this.partnerTags];
    },
  },
};
</script>
