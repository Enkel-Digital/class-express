/**
 * Express Router for Approve new partner API
 * Mounted on /partner/new
 * @author JJ
 * @module Approve new Partner API
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const search = require("@enkeldigital/ce-search-lib");
const dbTags = require("../../db/tags");
const sendMail = require("../../utils/sendMail");
const newPartnerAccount = require("../../controllers/newPartnerAccount");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:newPartner:approve");

/**
 * CE Admin approves a new partner
 * @todo Only allow CE admins to call this API, thus perhaps this should be moved to the admin API service
 * @name POST /partner/new/approve/
 * @param {Number} pendingPartnerID
 * @returns {object} success indicator
 */
router.post("/approve/:pendingPartnerID", async (req, res) => {
  try {
    const { pendingPartnerID } = req.params;
    const { approvedBy } = req.query;

    // Verify pendingPartnerID by getting the partner creation request. Will be undefined if invalid.
    const pendingPartner = await SQLdb("new_partners").where({
      id: pendingPartnerID,
    });
    if (!pendingPartner) throw new Error("Invalid pending partner ID");

    // Insert partner data from the partner creation request into partners table
    // explicitly 1 by 1 instead of spreading in to ensure only values of matching
    // columns are inserted, as new_partners have more columns then partners table
    // Get back inserted partner object with the DB generated values for use later
    const partner = await SQLdb("partners")
      .insert({
        // This shouldnt be here
        // createdBy: pendingPartner.createdBy,
        approvedBy,
        name: pendingPartner.name,
        description: pendingPartner.description,
        email: pendingPartner.email,
        phoneNumber: pendingPartner.phoneNumber,
        location_address: pendingPartner.location_address,
        location_coordinates: pendingPartner.location_coordinates,
        location_postalCode: pendingPartner.location_postalCode,
        website: pendingPartner.website,
        pictureSources: pendingPartner.pictureSources,
      })
      .returning("*");

    // Split the joined array from the DB back into an array and insert back into the partnerTags table
    await dbTags.partner.insert(partner.id, pendingPartner.tags.split(","));

    // Send email to company email to let them know that verification has been complete
    await sendMail({
      to: partner.email,
      from: "Accounts@classexpress.com",
      subject: `${partner.name}'s ClassExpress partner registration`,
      // @todo Use a sendgrid template instead
      html:
        `Hey there, great news! ${partner.name} is now verified for Class Express!<br />` +
        `The business owner needs to check their email inbox for a link to complete their account creation process.<br />`,
    });

    // Notify the business owner that their business is now verified, and they will get another email right after this
    await sendMail({
      to: pendingPartner.createdByEmail,
      from: "Accounts@classexpress.com",
      subject: `Hi ${pendingPartner.createdByName}, ${partner.name}'s ClassExpress partner has just been verified and approved`,
      // @todo Use a sendgrid template instead
      html:
        `Hey there, great news! ${partner.name} is now verified for Class Express!<br />` +
        "You will receive another email right after this with a link to complete your account creation process.<br />",
    });

    // send first admin the signup link
    // @todo Might want to set this to no expiry date
    await newPartnerAccount(
      {
        admin: true,
        partnerID: partner.id,
        email: pendingPartner.createdByEmail,
        name: pendingPartner.createdByName,
        firstAdmin: true, // Indicate that this user is the creator of this business
      }
      // redirectUrl,
    );

    // Push partner into search index
    // This is done right after business is verified even if first admin partner account is not created yet
    await search.partner.add(partner, "partner");

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
