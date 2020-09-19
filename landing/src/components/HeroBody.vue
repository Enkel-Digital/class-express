<template>
  <!-- Hero content: will be in the middle -->
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
        <a class="button" href="https://class.enkeldigital.com" target="_blank">
          App
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroBody",
};
</script>
