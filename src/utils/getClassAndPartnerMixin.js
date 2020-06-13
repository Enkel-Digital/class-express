/**
 * Mixin to call getClass and getPartner actions in store whenever classID and partnerID is updated.
 * @mixin getClassAndPartner
 */
const getClassAndPartner = {
  // Watcher to load partner details of upcoming classes whenever upcomingClasses is loaded or updated
  watch: {
    classID: {
      immediate: true,
      handler() {
        this.$store.dispatch("classes/getClass", this.classID);
      },
    },
    partnerID: {
      immediate: true,
      handler() {
        this.$store.dispatch("classes/getPartner", this.partnerID);
      },
    },
  },
};

export default getClassAndPartner;
