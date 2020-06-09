const moment = require("moment");

const schedule = {
  0: {
    classID: 0,
  },
  1: {
    classID: 1,
  },
  2: {
    classID: 2,
  },
};

const upcomingClassesID = {
  1: true,
};

const pastClassesID = {
  2: true,
};

module.exports = {
  schedule,
  upcomingClassesID,
  pastClassesID,
};
