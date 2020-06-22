/**
 * Base seed file to populate the DB with.
 * @author JJ
 */

exports.seed = async function (knex) {
  const yesno = require("yesno");
  if (
    !(await yesno({
      question:
        "Are you sure you want to continue and seed DB with random test data?",
    }))
  )
    return;

  // Inserts seed entries
  await knex("subscriptionPlans").insert([
    {
      available: true,
      name: "Starter Pack",
      copywriting: "Hate being tied down?<br />Start simple and topup anytime!",
      currency: "SGD",
      price: "49",
      totalPoints: "30",
      countryCode: "SG",
    },
    {
      available: true,
      name: "Premium Dealz",
      copywriting: "A Better deal, A Better you!",
      currency: "SGD",
      price: "89",
      totalPoints: "60",
      countryCode: "SG",
    },
    {
      available: true,
      name: "Srs Baller",
      copywriting:
        "Go big or Go home 🤙🏻<br />Join this plan for exclusive deals!",
      currency: "SGD",
      price: "120",
      totalPoints: "100",
      countryCode: "SG",
    },
  ]);

  await knex("topupOptions").insert([
    {
      available: true,
      name: "Missing a few points 😫",
      copywriting:
        "For you when you are just missing a few points for a class before the month ends",
      currency: "SGD",
      price: "10",
      totalPoints: "5",
    },
    {
      available: true,
      name: "Cheap cheap 😁",
      copywriting: "A Cheap cheap deal to give you more!",
      currency: "SGD",
      price: "27",
      totalPoints: "15",
    },
    {
      available: true,
      name: "Huat ah 🤙🏻",
      copywriting:
        "Seems like your plan wasn't enough, remember to upgrade your plan next month for a better deal! 😁",
      currency: "SGD",
      price: "50",
      totalPoints: "30",
    },
  ]);

  await knex("partners").insert([
    {
      name: "Tampines CC",
      description:
        "Located in the Heartlands of Tampines, we offer a wide variety of classes for our residents.",
      email: "tampinesCC@gmail.com",
      phoneNumber: "+65 98765432",
      location_address: "5 Tampines Ave 3",
      location_coordinates: "1.348979, 103.935787",
      website:
        "https://www.onepa.sg/cc/tampines-central-cc?AspxAutoDetectCookieSupport=1",
      pictureSources:
        "https://www.pa.gov.sg/images/default-source/module/community-clubs/tampines-west-community-club",
      verified_email: true,
      verified_phone: true,
      verified: true,
    },
    {
      name: "Advance Guitar Studio",
      description:
        "We offer world class guitar lessons for you!<br />Guitar Studio 2 is one of the leading Guitar Studios in Singapore and South East Asia boasting a whole list of celebrity instructors for you to learn more. We believe that the best instructors are what you need to get from amatuer  to pro just like the instructors themselves!",
      email: "AdvanceGuitarStudio@gmail.com",
      phoneNumber: "+65 98765432",
      location_address: "Orchard road, Plaza Singapura",
      location_coordinates: "1.3006954, 103.84475",
      website: "https://alternatetone.com/",
      pictureSources:
        "https://media.timeout.com/images/105537588/630/472/image.jpg",
      verified_email: true,
      verified_phone: true,
      verified: true,
    },
    {
      name: "Music Classes by Jen",
      description: "Get started on your Guitar journey with us!",
      email: "JenMusicClasses@gmail.com",
      phoneNumber: "+65 98765432",
      location_address: "249B Victoria St, Bugis Village",
      location_coordinates: "1.300649, 103.855453",
      website: "https://www.musictogetherbymissjen.com/",
      pictureSources:
        "https://rezaglobalpro.com/wp-content/uploads/Reza-Global-Productions-Music-Studio-3.2-1.jpg",
      verified_email: true,
      verified_phone: true,
      verified: true,
    },
  ]);

  await knex("classes").insert([
    {
      partnerID: "3",
      name: "Basic Guitar",
      description:
        "Basic guitar lessons to help you get started with this wonderful musical instrument! This class covers all the basics from score reading to strumming techniques.",
      length: "45",
      points: "5",
      maxParticipants: "20",
      pictureSources:
        "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg",
      location_address: "Orchard road, Plaza Singapura",
      location_coordinates: "1.3006954, 103.84475",
    },
    {
      partnerID: "2",
      name: "Advanced Guitar",
      description:
        "Advance guitar lessons taught be the legendary Ichika Mo.<br />Will be going through advanced music scores and includes 1 on 1 trainings for the students, alongside a chance to practice in front of a live audience",
      length: "80",
      points: "8",
      maxParticipants: "20",
      pictureSources:
        "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg",
    },
    {
      partnerID: "1",
      name: "Basic Cooking",
      description:
        "Want to get started in the magical world of cooking? Well join our class to learn more and get ready to be amazed.",
      length: "150",
      points: "3",
      maxParticipants: "6",
      pictureSources:
        "https://d2ga8dje9bus38.cloudfront.net/0QTxUDcDSYaU0951YubV_verlocal_cooking_basics_class_workshop_in_oakland_900_600.jpg",
    },
    {
      partnerID: "1",
      name: "Advanced Cooking",
      description:
        "Like cooking but always feel like you are missing a magical ingredient? Well join our class to learn more and get ready to be amazed.",
      length: "180",
      points: "6",
      maxParticipants: "20",
      pictureSources:
        "https://www.fetimes.co.kr/news/photo/201709/60017_41960_2138.jpg",
    },
  ]);

  // @todo Add mock data for reviews
};
