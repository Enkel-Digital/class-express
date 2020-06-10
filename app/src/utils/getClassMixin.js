/**
 * Mixin to call getClass on created
 * @mixin getClass
 */
const getClass = {
  created() {
    if (this.classID) this.$store.dispatch("classes/getClass", this.classID);
    if (this.classIDs) this.$store.dispatch("classes/getClass", this.classIDs);

    if (this.partnerID)
      this.$store.dispatch("classes/getPartner", this.partnerID);
    if (this.partnerIDs)
      this.$store.dispatch("classes/getPartner", this.partnerIDs);
  },
};

export default getClass;
