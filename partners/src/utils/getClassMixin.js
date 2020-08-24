/**
 * Mixin to call getClass action in store whenever classID is updated.
 * @mixin getClass
 */
const getClass = {
  // Watcher to load partner details of upcoming classes whenever upcomingClasses is loaded or updated
  watch: {
    classID: {
      immediate: true,
      handler() {
        this.$store.dispatch("classes/getClass", this.classID);
      },
    },
  },
};

export default getClass;
