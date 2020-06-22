CREATE TABLE "userAccounts" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "phoneNumber" varchar,
  "firstName" varchar NOT NULL,
  "lastName" varchar,
  "countryCode" varchar NOT NULL,
  "cityCode" varchar NOT NULL,
  "timezone" varchar NOT NULL,
  "profilePictureURL" varchar,
  "currency" varchar NOT NULL,
  "verified_email" boolean,
  "verified_phone" boolean,
  "deleted" boolean
);

CREATE TABLE "userSettings" (
  "id" int PRIMARY KEY NOT NULL,
  "notification_email" boolean,
  "notification_mobile" boolean
);

CREATE TABLE "businessOrganisation" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "email" varchar NOT NULL,
  "phoneNumber" varchar NOT NULL,
  "location_address" varchar NOT NULL,
  "location_coordinates" varchar NOT NULL,
  "website" varchar,
  "pictureSources" varchar,
  "verified_email" boolean,
  "verified_phone" boolean,
  "verified" boolean,
  "deleted" boolean
);

CREATE TABLE "partnerAccounts" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "businessOrganisation" int NOT NULL,
  "name" varchar NOT NULL,
  "admin" boolean,
  "permissions" varchar,
  "email" varchar NOT NULL,
  "phoneNumber" varchar,
  "verified_email" boolean,
  "verified_phone" boolean,
  "deleted" boolean
);

CREATE TABLE "partnerSettings" (
  "id" int PRIMARY KEY NOT NULL,
  "notification_email" boolean,
  "notification_mobile" boolean
);

CREATE TABLE "userPlans" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userID" int NOT NULL,
  "planID" int NOT NULL,
  "start" timestamp NOT NULL,
  "end" timestamp
);

CREATE TABLE "userBookingTransactions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userID" int NOT NULL,
  "classID" int NOT NULL,
  "actionTime" timestamp NOT NULL,
  "points" int NOT NULL,
  "booked" boolean,
  "cancelled" boolean
);

CREATE TABLE "billingAccounts" (
  "id" SERIAL PRIMARY KEY NOT NULL
);

CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "partnerID" int NOT NULL,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "length" int NOT NULL,
  "points" int NOT NULL,
  "maxParticipants" int NOT NULL,
  "pictureSources" varchar,
  "location_address" varchar,
  "location_coordinates" varchar,
  "deleted" boolean
);

CREATE TABLE "classSchedule" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "classID" int NOT NULL
);

CREATE TABLE "userFavourites" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userID" int NOT NULL,
  "class" boolean,
  "partner" boolean,
  "favouritedAt" timestamp NOT NULL
);

CREATE TABLE "userClasses" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userID" int NOT NULL,
  "classID" int NOT NULL,
  "startTime" timestamp NOT NULL
);

CREATE TABLE "subscriptionPlans" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "available" boolean,
  "name" varchar NOT NULL,
  "copywriting" varchar NOT NULL,
  "currency" varchar NOT NULL,
  "price" int NOT NULL,
  "totalPoints" int NOT NULL,
  "countryCode" varchar
);

CREATE TABLE "topupOptions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "available" boolean,
  "name" varchar NOT NULL,
  "copywriting" varchar NOT NULL,
  "currency" varchar NOT NULL,
  "price" int NOT NULL,
  "totalPoints" int NOT NULL
);

CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "classID" int NOT NULL,
  "points" int NOT NULL,
  "reviewedOn" timestamp NOT NULL,
  "description" varchar
);

ALTER TABLE "userSettings" ADD FOREIGN KEY ("id") REFERENCES "userAccounts" ("id");

ALTER TABLE "partnerAccounts" ADD FOREIGN KEY ("businessOrganisation") REFERENCES "businessOrganisation" ("id");

ALTER TABLE "partnerSettings" ADD FOREIGN KEY ("id") REFERENCES "partnerAccounts" ("id");

ALTER TABLE "userPlans" ADD FOREIGN KEY ("userID") REFERENCES "userAccounts" ("id");

ALTER TABLE "userPlans" ADD FOREIGN KEY ("planID") REFERENCES "subscriptionPlans" ("id");

ALTER TABLE "userBookingTransactions" ADD FOREIGN KEY ("userID") REFERENCES "userAccounts" ("id");

ALTER TABLE "userBookingTransactions" ADD FOREIGN KEY ("classID") REFERENCES "classes" ("id");

ALTER TABLE "classes" ADD FOREIGN KEY ("partnerID") REFERENCES "businessOrganisation" ("id");

ALTER TABLE "classSchedule" ADD FOREIGN KEY ("classID") REFERENCES "classes" ("id");

ALTER TABLE "userFavourites" ADD FOREIGN KEY ("userID") REFERENCES "userAccounts" ("id");

ALTER TABLE "userClasses" ADD FOREIGN KEY ("userID") REFERENCES "userAccounts" ("id");

ALTER TABLE "userClasses" ADD FOREIGN KEY ("classID") REFERENCES "classes" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("classID") REFERENCES "classes" ("id");
