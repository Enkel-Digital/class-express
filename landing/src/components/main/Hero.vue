<template>
  <!-- Hero component is the first component of the site to load -->

  <section class="hero is-fullheight">
    <img
      class="hero-image"
      alt="Hero"
      :src="require(`../../assets/hero/${heroImage}.jpg`)"
    />

    <div class="hero-body">
      <div class="container columns has-text-left">
        <div class="column is-offset-2 is-4">
          <!-- @todo Might wanna add "has-text-white" class when using darker hero images -->
          <p class="title" width="10%">Reach Higher with Class Express!</p>
          <!-- @todo For the region/country, either change it to say something broader like Asia, or make it dynamic based on the user's location -->
          <p class="subtitle">
            Use Class Express to search, book and experience classes from
            different disciplines across Singapore to help you grow.
          </p>
          <br />
          <!-- @todo Change to use an Icon instead? Or a picture? -->
          <a class="button" href="#Download">Download</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Hero",

  data() {
    return {
      heroImage: 1,
    };
  },
  /* mounted() {
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true)
        for (let i = 1; i < 6; i++) {
          // @todo Make the transition smooth
          this.heroImage = i;
          console.log(`showing hero ${i}`);
          await new Promise((resolve) => setTimeout(resolve, 4000));
        }
    })();
  }, */
};
</script>
