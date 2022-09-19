<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <h1 class="title" style="color: #e81050">Talk to Us!</h1>
    <p class="subtitle mb-6" style="font-size: 1em; color: grey">
      Let us help you reach your greatest potential.
    </p>

    <div class="columns is-centered">
      <!-- @todo Embed the teletif iframe here instead -->
      <!-- Margin bottom to ensure a space between this and the other card when in mobile view -->
      <div class="column card is-8 px-5 mx-4 mb-4">
        <!-- Load google's recaptcha script -->
        <script
          type="application/javascript"
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        />

        <p class="title mt-2">Contact Form</p>
        <p class="subtitle is-6">We will be in contact as soon as possible.</p>

        <div class="field">
          <label class="label">Name</label>
          <div class="control has-icons-left">
            <input
              class="input"
              v-model="name"
              type="text"
              placeholder="How do we address you?"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left">
            <input
              class="input"
              v-model="email"
              type="email"
              placeholder="Email"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
          <!-- @todo Add email input validation -->
          <!-- <p class="help is-danger">Invalid email</p> -->
        </div>

        <div class="field">
          <label class="label">Phone number (optional)</label>
          <div class="control has-icons-left">
            <input
              class="input"
              v-model="phoneNumber"
              type="tel"
              placeholder="Please include country/area code"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Subject</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              v-model="subject"
              type="text"
              placeholder="How can we help you?"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Message</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Any additional details"
              v-model="message"
            />
          </div>
        </div>

        <!-- Div for the recaptcha input, will be populated automatically be the recaptcha external script below -->
        <!-- Note that "gCaptchaError" has to be a function in the global namespace attached to the window object -->
        <div
          style="margin-top: 1em; margin-bottom: 1em"
          class="g-recaptcha"
          data-sitekey="6LdCM9sUAAAAABDfnyDJqwlECqaRbuCDldwkcvvP"
          data-error-callback="gCaptchaError"
        />

        <div class="field control">
          <button
            class="button"
            style="background: lightcoral; color: white"
            @click="submitForm"
          >
            Contact Me!
          </button>
        </div>
      </div>

      <div class="column card is-4 px-5 mx-4 mb-4">
        <p class="title mt-2 mb-6">Contact us directly</p>

        <p class="subtitle">
          Let us help you accelerate your growth and achieve success!
        </p>
        <br />

        <!-- @todo Update the contact details once they have been set -->
        <!-- @todo add links to social accounts where they can DM us -->
        <ul>
          <li>
            <i class="fas fa-envelope icon" />
            <a href="mailto://contact@enkeldigital.com">
              contact@enkeldigital.com
            </a>
          </li>
          <li>
            <i class="fab fa-telegram icon" />
            <!-- @todo Update to telegram bot or group -->
            <a href="https://t.me/Jaimeloeuf" target="_blank">
              Telegram support
            </a>
          </li>
          <li><i class="fas fa-address-card icon" /> +65 94263687</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
window.gCaptchaError = function (error) {
  console.error("Captcha error: ", error);
  alert("Captcha error! Form submission disabled. Try again or contact us.");
};

export default {
  name: "ContactUs",

  data() {
    return {
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    };
  },

  methods: {
    async submitForm(e) {
      // Prevent default behavior of reloading page if any
      e.preventDefault();

      // Create form object with all the data
      const form = {
        name: this.name,
        email: this.email,
        phoneNumber: this.phoneNumber,
        subject: this.subject,
        message: this.message,
        // Get the website that the user is on
        website: window.location.href,
        // Get the response token from the captcha UI
        // Uses null coalescing to prevent erroring out if grecaptcha method not loaded
        "g-recaptcha-response": window.grecaptcha?.getResponse(),
      };

      // If google captcha script is not loaded properly, or if the response is undefined or cant be read, end function
      if (!window.grecaptcha || !form["g-recaptcha-response"])
        return alert("Recaptcha failed, contact us directly instead.");

      // If name or email is not given, alert user and end the function
      if (!form.name || !form.email)
        return alert("Missing name or email in form!");

      try {
        // Send form data to API
        // Default options are marked with *
        const response = await fetch(
          // "https://us-central1-ekd-landing-page.cloudfunctions.net/contactForm",
          "http://localhost:3000/ping2",
          {
            method: "POST",
            // mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
            cache: "no-cache",
            referrerPolicy: "no-referrer", // no-referrer, *client
          }
        );

        console.log(response);

        // @todo Fix this, since no matter whether response worked or not, regardless of code, it will still alert
        alert("Contact request submitted, we will reply asap. Thank you!");
      } catch (error) {
        console.error(error);
        /** @todo Show user and tell user to contact us directly */
      }
    },
  },
};
</script>
