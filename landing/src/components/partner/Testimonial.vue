<template>
  <section class="hero is-fullheight">
    <img
      class="hero-image"
      alt="Workout section hero image"
      loading="eager"
      src="../../assets/workout hero/3.jpg"
    />

    <!-- @todo Use media query to resize and change the words -->
    <div class="hero-body">
      <div class="container columns has-text-left">
        <div class="column is-offset-2 is-4">
          <p class="title has-text-white" width="10%">
            Join us today for Free to step up your game
          </p>
          <p class="subtitle has-text-white">
            Hundreds of Boutique Fitness Studios and Enrichment centers have
            already succeeded with us. Dont miss out!
          </p>
          <br />
          <a class="button" href="#Portal">Get Started</a>
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
