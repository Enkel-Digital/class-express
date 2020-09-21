<template>
  <!-- Sticky navbar always at the top of the site -->
  <!-- is fixed top will keep it sticky at the top of the page -->
  <nav id="nav" class="navbar is-fixed-top is-white" role="navigation">
    <!-- Container to force nav bar into center with wider side margins -->
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <img src="../assets/logo_transparent_background.png" alt="Logo" />
        </a>

        <!-- Using <a> instead of button as it does not need an icon and dont have the inverted colors on click behaviour -->
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': showMobileMenu }"
          aria-label="menu"
          data-target="navbar-menu"
          @click="showMobileMenu = !showMobileMenu"
        >
          <!-- 3 empty span tags to show the burger menu icon -->
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>

      <div
        class="navbar-menu has-text-right"
        :class="{ 'is-active': showMobileMenu }"
      >
        <!-- Show the menu at the other end -->
        <div class="navbar-end">
          <!-- <a class="navbar-item is-active"> </a> -->

          <!-- Using v-html instead of string interpolation to support html link names like using icons -->
          <a
            v-for="(menuItem, i) in menuItems"
            :key="i"
            class="navbar-item"
            v-html="menuItem.name"
            :href="menuItem.link"
            :target="menuItem.target"
            @click="showMobileMenu = false"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "HeroHead",
  data() {
    return {
      showMobileMenu: false,

      menuItems: [
        { name: "Home", link: "#" },
        { name: "About", link: "#About" },
        { name: "Features", link: "#Features" },
        // { name: "Join Us", link: "#Join" },
        { name: "Join Us", link: "#Workouts" },
        { name: "Download", link: "#Download" },
        { name: "Partner", link: "#Partner" },
        { name: "Contact", link: "#ContactUs" },
      ],
    };
  },
};
</script>

<style scoped>
/* Gives the nav bar a white fill background and a super thin and light bottom underline to give visual seperation from the content */
#nav {
  /* background: black; */
  background: white;
  border-bottom: 1px solid rgb(231, 231, 231);
  opacity: 0.8;
}
</style>
