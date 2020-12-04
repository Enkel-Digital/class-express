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
            <p class="title">Simple Scheduling tool</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Simple Pricing</p>
            <p>
              As a platform, we earn by taking a cut from each transaction. And
              we only charge you for transactions and as you make more
              transactions when you scale, our percentage fee will also
              decrease.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Zero Downside Pricing</p>
            <p>
              We do not charge you for anything if no one book a class, unlike
              competitors like ClassPass where they charge a recurring monthly
              fee regardless of whether you use it or not.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Simple platform</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Analytics</p>
            <p>
              Built in analytics and marketing funnel dashboard for you to
              understand your customers better to scale your business further.
            </p>
          </div>
          <div class="column card features-card is-5">
            <p class="title">Attendance tracking</p>
            <p>
              Track your students attendances, which can help in your
              marketing/analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @todo Make this so that, when I click a tile, a different image shows on the side

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
