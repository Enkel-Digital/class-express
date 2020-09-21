<template>
  <section class="hero is-fullheight">
    <img
      class="hero-image"
      alt="Workout section hero image"
      loading="eager"
      src="../assets/workout hero/4.jpg"
    />

    <div class="hero-body">
      <div class="container columns has-text-left">
        <div class="column is-offset-2 is-4">
          <p class="title has-text-white" width="10%">Grow your Business</p>
          <p class="subtitle has-text-white">
            Reach your Customers through our partner programme!
          </p>
          <br />

          <!-- @todo Instead of horizontal columns, force to be a vertical tile list -->
          <!-- @todo remove hard coded this negative margin -->
          <div class="content has-text-white" style="margin-left: -1em">
            <ul>
              <li>Zero downsides</li>
              <li>Class management Suite</li>
              <li>Free Advertising platform</li>
            </ul>
          </div>

          <a class="button" href="/partner" style="color: coral">
            Learn more
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Partner",
};
</script>
