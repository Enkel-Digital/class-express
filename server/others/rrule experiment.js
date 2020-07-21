/**
 * Module used to experiment around with the rrule.js library
 *
 *
 *
 * Now that we have a brief idea of how this works.
 * we need to handle date inputs. Because Date.UTC() obviously cant do
 *
 * also we need to test like time/hour with this. Like repeating by how many hours a day and stuff like that
 *
 * and based off of this, how do we create the value for selectedTime?
 * Is it like the start time of the class?
 * Yes, these times/dates are all the start time of the class.
 * 2 ways to use
 * - Given a date, return back all the classes in that day
 *    - extend the between function with a today method, that basically does between but the same day twice and inclusive == true
 * - then given a time return if that class is valid or not.
 *
 * We can either save the options to recreate the rruleSet object
 * or we can save the rrule.valueOf() then convert it from the string
 *
 *
 * How do we deal with the case of updating rules? Do we extend the original rule by mutating or creating a new rule?
 * something like how sub plan is dealt with now. We have a count then increment and store the options in a map with version of that class as the key
 *     Something like a simple version control where they can move back to the original rule?
 *     or just keep for analytics?
 *
 * Notes:
 * For whatever reason, Date.UTC()'s month value starts at 0. So januarary is 0
 * rruleSet.between() we should always pass in a inclusive == true value
 */

const { RRule, RRuleSet, rrulestr } = require("rrule");

// Create a rule:
// const rule = new RRule({
//   freq: RRule.WEEKLY,
//   interval: 5,
//   byweekday: [RRule.FR],
//   dtstart: new Date(Date.UTC(2020, 1, 1, 10, 30)),
//   until: new Date(Date.UTC(2020, 12, 31))
// });

// Get all occurrence dates (Date instances):
// console.log(rule.all());

// Get a slice:
// console.log(rule.between(new Date(Date.UTC(2020, 7, 1)), new Date(Date.UTC(2020, 8, 1))));

// Get a human-friendly text representation:
// The output can be used with RRule.fromText().
// console.log(rule.toText());

// ////////////////////////////

const rruleSet = new RRuleSet();

// Add a rrule to rruleSet
rruleSet.rrule(
  new RRule({
    freq: RRule.WEEKLY,
    dtstart: new Date(Date.UTC(2020, 0, 1)),
    count: 10,
  })
);

// Add a date to rruleSet that does not lie in the reccurence pattern
rruleSet.rdate(new Date(Date.UTC(2020, 0, 9)));

// Add a exclusion rrule to rruleSet
// For example, the first day of every month
rruleSet.exrule(
  new RRule({
    freq: RRule.MONTHLY,
    count: 10,
    dtstart: new Date(Date.UTC(2020, 0, 1)),
    bymonthday: 1,
  })
);

// Add a date to exclude from the rruleSet
rruleSet.exdate(new Date(Date.UTC(2020, 0, 9))); // exclude the added date
rruleSet.exdate(new Date(Date.UTC(2020, 0, 22)));

console.log("tp", rruleSet.all().length, rruleSet.all());

// Get a slice between inclusive:
console.log(
  rruleSet.between(
    new Date(Date.UTC(2020, 0, 9)),
    new Date(Date.UTC(2020, 1, 26)),
    true
  )
);

// Get all the timing of the selected class from today
const today = new Date(Date.UTC(2020, 1, 26));
console.log("today", rruleSet.between(today, today, true));

// To list of string with individual rules
console.log(rruleSet.valueOf());
console.log(rruleSet.toString());

// using this, we can technically save as a string, then convert back into the object
// although this is great and easy to deal with, it is hard to just read from the DB like that.
console.log(rrulestr(rruleSet.toString()).all());

// Alternatively, we can save the options
console.log(rruleSet.options); // this one just printed out today...

const rruleSet2 = new RRuleSet();
rruleSet2.rrule(new RRule(rruleSet.options));
console.log(rruleSet.valueOf(), rruleSet2.valueOf());
