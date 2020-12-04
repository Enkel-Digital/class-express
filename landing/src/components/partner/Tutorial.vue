<template>
  <section class="section hero is-fullheight has-text-left">
    <!-- Empty span tag here and below to force the actual content to be in the middle of the hero section vertically -->
    <span />

    <div class="columns">
      <!-- Embed a youtube video here to show how to install the App on IOS or android or how to use it -->
      <!-- Only shown on desktop, and hidden for mobile/tablet sizes. -->
      <!-- On mobile/tablets, clicking it opens the youtube link in new tab or youtube app -->
      <div id="youtubeVideo" class="column">
        <p class="title">{{ videoName }}</p>

        <iframe
          :src="videoIFrameSrc + preferencesString"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          width="100%"
          height="100%"
        />
      </div>

      <div class="column">
        <div class="columns is-multiline">
          <div class="column is-12 mb-6">
            <div class="container mx-4">
              <h1 class="title">Class Express Partner Portal</h1>
              <h2 class="subtitle">Simple Tutorials to get you started</h2>
              <!-- @todo Add the end of this, have a button that says, see all tutorials -->
            </div>

            <br />

            <!-- Here are big tiles as buttons, that I can click to show how to download / use on IOS and or Android -->
            <div class="columns is-multiline">
              <div
                class="column card features-card is-5"
                @click="switchVideo(videoConfigs.gettingStarted)"
              >
                <p class="title">Getting Started</p>
                <p>
                  Learn how to create a new account, with a basic walk through
                  of the whole portal.
                </p>
              </div>
              <div
                class="column card features-card is-5"
                @click="switchVideo(videoConfigs.createNewClass)"
              >
                <p class="title">Create a new Class</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  ornare magna eros, eu pellentesque tortor vestibulum ut.
                  Maecenas non massa sem. Etiam finibus odio quis feugiat
                  facilisis.
                </p>
              </div>
              <div
                class="column card features-card is-5"
                @click="switchVideo(videoConfigs.billing)"
              >
                <p class="title">Manage billing / payments</p>
                <p>
                  Learn how to connect and change your billing account to get
                  paid from your classes!
                </p>
              </div>
              <div
                class="column card features-card is-5"
                @click="switchVideo(videoConfigs.employeeAccount)"
              >
                <p class="title">Employee accounts</p>
                <p>
                  A simple 3 step process to give your employees seperate
                  accounts with limited permissions and access instead of
                  sharing your own admin account!
                </p>
              </div>
              <div
                class="column card features-card is-5"
                @click="switchVideo(videoConfigs.analytics)"
              >
                <p class="title">Analytics</p>
                <p>
                  See your class and sales performance with our built in
                  analytics and funnel view dashboards to see your classes'
                  performance.
                </p>
              </div>
              <div
                class="column card features-card is-5"
                @click="switchVideo(videoConfigs.advertising)"
              >
                <p class="title">Advertising</p>
                <p>
                  Advertise and reach more customers with our platform. Learn
                  the basics of creating a New Marketing Campaign to drive
                  sales.
                </p>
              </div>
            </div>

            <br />
            <a
              class="button is-info is-pulled-right mr-6"
              href="/tutorials"
              target="_blank"
            >
              See more tutorials
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty span tag here and on top to force the actual content to be in the middle of the hero section vertically -->
    <span />
  </section>
</template>

<script>
export default {
  name: "Download",

  created() {
    // @todo Replace this makeshift solution with smth that Detect what device, and show the ios or android loading one
    if (!this.ifMobileOrTablet())
      this.switchVideo(this.videoConfigs.install_ios);
  },

  data() {
    //   @todo Explore the enableJsonAPI URL query parameter

    const preferences = {
      cc_lang_pref: "en",
      cc_load_policy: "1",

      // autoplay: "1", // To enable this, need to either set playlist value or set mute to true

      // loop: "1",
      // playlist: "86D7AGm5sHk", // To enable autoplay, the playlist must be set to the video ID
    };

    const preferencesString =
      "?" +
      Object.keys(preferences)
        .map((key) => `${key}=${preferences[key]}&`)
        .join("");

    console.log(preferencesString);

    return {
      videoName: "",
      videoIFrameSrc: "",
      preferencesString,

      videoConfigs: {
        gettingStarted: {
          videoIFrameSrc: "https://www.youtube-nocookie.com/embed/w0P0FQ770dE",
          videoName: "Getting Started",
        },
        createNewClass: {
          videoIFrameSrc: "https://www.youtube-nocookie.com/embed/86D7AGm5sHk",
          videoName: "Creating a new Class",
        },
        billing: {
          videoIFrameSrc: "https://www.youtube-nocookie.com/embed/egHjkeiqjrA",
          videoName: "Manage Billing and Payments",
        },
        employeeAccount: {
          videoIFrameSrc: "https://www.youtube-nocookie.com/embed/hs1HoLs4SD0",
          videoName: "Managing Employee Accounts",
        },
        analytics: {
          videoIFrameSrc: "https://www.youtube-nocookie.com/embed/egHjkeiqjrA",
          videoName: "Using Analytics",
        },
        advertising: {
          videoIFrameSrc: "https://www.youtube-nocookie.com/embed/hs1HoLs4SD0",
          videoName: "Advertising and Sales",
        },
      },
    };
  },

  methods: {
    ifMobileOrTablet() {
      return (
        Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        ) < 1024
      );
    },

    switchVideo(videoConfig) {
      // Just like a media query, where this is true if using tablet or mobile device
      if (this.ifMobileOrTablet())
        return window.open(
          `https://youtube.com/watch?v=${videoConfig.videoIFrameSrc.slice(39)}`,
          "_blank"
        );

      this.videoIFrameSrc = videoConfig.videoIFrameSrc;
      this.videoName = videoConfig.videoName;
    },
  },
};
</script>

<style scoped>
.features-card {
  border-radius: 1em;
  border: 1px solid rgb(220, 220, 220);
  margin: 1em;

  cursor: pointer;
}

/* Change background depending on screen size */
#youtubeVideo {
  display: run-in;
}
/* Might change table to show it */
@media (max-width: 1024px) {
  #youtubeVideo {
    display: none;
  }
}
@media (max-width: 768px) {
  #youtubeVideo {
    display: none;
  }
}
</style>
