<template>
  <section class="hero is-fullheight">
    <img
      class="image hero-image"
      alt="Workout section hero image"
      loading="eager"
      src="../assets/workout hero/3.jpg"
    />

    <!-- @todo Use media query to resize and change the words -->
    <div class="hero-body">
      <div class="container columns has-text-left">
        <div class="column is-offset-2 is-4">
          <p class="title has-text-white" width="10%">
            Push Yourself At Boutique Fitness Studios
          </p>
          <p class="subtitle has-text-white">
            Join hundreds of Boutique Fitness Studios instantly!
          </p>
          <br />
          <a class="button" href="#Download">
            <!-- App -->
            Download now
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Workouts",
};
</script>
