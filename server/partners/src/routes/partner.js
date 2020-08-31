/**
 * Express Router for partner related routes.
 * Mounted on /partner
 * @author JJ
 * @module Partner routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const getPartnerTags = require("../db/getPartnerTags");
const sendMail = require("../utils/sendMail");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:partner");

/**
 * Get partner details with its tags
 * @name GET /partner/:partnerID
 * @returns {object} Partner object
 */
router.get("/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const partner = await SQLdb("partners")
      .where({ id: partnerID })
      .where("deleted", false)
      .first();

    if (!partner)
      return res.status(404).json({ success: false, error: "No such Partner" });

    // @todo Can we achieve this using a SQL JOIN?
    // Inject partnerTags in as an array
    partner.tags = await getPartnerTags(partnerID);

    res.json({ success: true, partner });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update partner details
 * @todo Only admins can do this
 * @name PATCH /partner/:partnerID
 * @function
 * @param {object} partner
 * @returns {object} Success indicator
 */
router.patch("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID } = req.params;
    const { partner } = req.body;

    await SQLdb("partners").where({ id: partnerID }).update(partner);

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * "Delete" partner / business organization profile, and with it, all partnerAccounts and classes belonging to this partner.
 * @todo Only admins can do this
 * @name DELETE /partner/:partnerID
 * @function
 * @param {object} partner
 * @returns {object} Success indicator
 */
router.delete("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID } = req.params;

    await SQLdb("partners").where({ id: partnerID }).update({ deleted: true });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create new partner / business organization
 * @todo DOES NOT have auth token requirement, but should be rate limited (with IP / through unique email and phone verification)
 * @name POST /partner/new/
 * @param {Object} partner
 * @param {Object} accountCreationRequest
 * @returns {object} success indicator
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const { accountCreationRequest, partner } = req.body;

    // @todo Better verification
    if (!partner) throw new Error("Missing 'partner' data");
    if (!accountCreationRequest)
      throw new Error("Missing 'owner account' data");

    const validateURL = require("../validations/isHTTPS");

    if (!validateURL(partner.website))
      throw new Error("Website URL should be HTTPS only");

    // Tags is stored together with new partner creation request because of the schema constraint
    // we cannot store in the partnerTags table before partner is created.
    // Join the tags with commas so that we can store it in a single column of new_partners table.
    partner.tags = partner.tags.join();

    // Insert partner details alongside data from accountCreationRequest into temporary DB, for CE admins to verify
    await SQLdb("new_partners").insert({
      // @todo Enfore a write schema to prevent extra values from breaking the insert process
      ...partner,
      createdByName: accountCreationRequest.name,
      createdByEmail: accountCreationRequest.email,
    });

    // Create a HTML list for the details to send to CE admins for us to verify
    const htmlDetails =
      "<ul>" +
      Object.entries(partner)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join("") +
      "</ul>";

    // Notify the CE admins
    // @todo Replace with teletif
    await sendMail({
      // @todo Replace domain once fixed
      to: "classexpress@enkeldigital.com",
      from: "Accounts@classexpress.com",
      subject: `New ClassExpress partner ${partner.name}`,
      // @todo Use a sendgrid template instead
      html:
        `A new ClassExpress partner has been registered and is now waiting for verification.<br />` +
        "Here are the details.<br />" +
        "<br />" +
        htmlDetails,
      // @todo Perhaps add link to allow us to verify directly or smth?
      // @todo This part should be replaced by an Admin panel
    });

    // Send email to the company email address to let them know that verification is in progress
    await sendMail({
      to: partner.email,
      from: "Accounts@classexpress.com",
      subject: `ClassExpress partner registration for ${partner.name}`,
      // @todo Use a sendgrid template instead
      html:
        `Hey there, this email has been registered as the main Company Email for ${partner.name}.<br />` +
        `Any important notifications will all be sent here.<br />` +
        `You will be notified via this email once this business has been verified.<br />`,
    });

    // Notify the business owner that their business is awaiting verification, and they will get another email for signup once verified
    await sendMail({
      to: accountCreationRequest.email,
      from: "Accounts@classexpress.com",
      subject: `Hi ${accountCreationRequest.name}, we received ${partner.name}'s ClassExpress partner registration`,
      // @todo Use a sendgrid template instead
      html:
        `This email is to inform you that the registration and verification process for your ClassExpress partner has began.<br />` +
        "Sit tight for now! We will be in contact with you shortly and inform you if there is any things else we need from you.<br />" +
        "Once your business is verified, we will send this email a link to create an admin account for the business.<br />" +
        "<br />" +
        // @todo Replace the domain once it has been set
        "Thank you so much for choosing us! If you need any further assistance, please contact us <a href='mailto:classexpress@enkeldigital.com'>here</a>.<br />",
    });

    // @todo Instead of 201 for created, maybe 200 as it is processing? or a better code?
    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * CE Admin approves a new partner
 * @todo Only allow CE admins to call this API, thus perhaps this should be moved to the admin API service
 * @name POST /partner/new/approve/
 * @param {Object} pendingPartnerID
 * @returns {object} success indicator
 */
router.post("/new/approve", express.json(), async (req, res) => {
  try {
    const { pendingPartnerID } = req.body;

    // Verify pendingPartnerID by getting the partner creation request. Will be undefined if invalid.
    const partner = await SQLdb("new_partners").where({ id: pendingPartnerID });
    if (!partner) throw new Error("Invalid pending partner ID");

    // Insert partner data from the partner creation request into partners table
    // Inserting values 1 by 1 instead of spreading in to ensure only values of, matching
    // columns are inserted, as new_partners have more columns then partners table
    // Get back partnerID of the newly inserted row
    const partnerID = await SQLdb("partners")
      .insert({
        createdBy: partner.createdBy,
        approvedBy: partner.approvedBy,
        name: partner.name,
        description: partner.description,
        email: partner.email,
        phoneNumber: partner.phoneNumber,
        location_address: partner.location_address,
        location_coordinates: partner.location_coordinates,
        location_postalCode: partner.location_postalCode,
        website: partner.website,
        pictureSources: partner.pictureSources,
      })
      .returning("id");

    // Generate array of partner tag objects like this --> [{ partnerID: 1, tag: "tag_name" },] before inserting as seperate rows
    await SQLdb("partnerTags").insert(
      partner.tags.split(",").map((tag) => ({ tag, partnerID }))
    );

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
      to: partner.createdByEmail,
      from: "Accounts@classexpress.com",
      subject: `Hi ${partner.createdByName}, ${partner.name}'s ClassExpress partner has just been verified and approved`,
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
        email: partner.createdByEmail,
        name: partner.createdByName,
      },
      // redirectUrl,
      // ""
    );

    // @todo Update search service to push partner into algolia
    // This is done right after business is verified even if first admin partner account is not created yet

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @todo create 1 more API for admin to unapprove partner creation

module.exports = router;
