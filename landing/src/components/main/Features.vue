<template>
  <section class="section hero is-fullheight">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- is-desktop class makes the features item column go under the image in tablet or smaller sizes -->
    <div class="columns is-desktop">
      <div class="column">
        <img
          src="../../assets/app_screen_mockup.png"
          alt="App screen UI mockups"
        />
      </div>

      <div class="column has-text-left ml-6">
        <div class="container">
          <h1 class="title">Features to help you succeed</h1>
          <h2 class="subtitle">
            Maximise your experience through our user friendly interface and
            features, all in one App.
          </h2>
        </div>

        <br />

        <div class="columns is-multiline">
          <div class="column card features-card is-5">
            <p class="title">Multiple Workouts</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Fair Pricing</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Flexible Schedule</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Enrichment Classes</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Progress Tracking</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Personalised Recommendations</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Features",
};
</script>

<style scoped>
.features-card {
  border-radius: 1em;
  border: 1px solid rgb(220, 220, 220);
  margin: 1em;
}
</style>
