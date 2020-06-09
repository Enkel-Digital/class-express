/**
 * Mixin to call getClass on created
 * @mixin getClass
 */
const getClass = {
  created() {
    if (this.classID) this.$getClass(this.classID);
    if (this.classIDs) this.$getClass(this.classIDs);

    if (this.partnerID) this.$getPartner(this.partnerID);
    if (this.partnerIDs) this.$getPartner(this.partnerIDs);
  },
};

export default getClass;
