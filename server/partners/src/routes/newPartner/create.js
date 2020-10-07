/**
 * Express Router for create new partner API
 * Mounted on /partner/new
 * @author JJ
 * @module Create partner API
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const sendMail = require("../../utils/sendMail");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:newPartner:create");

/**
 * Create new partner / business organization
 * @todo DOES NOT have auth token requirement, but should be rate limited (with IP / through unique email and phone verification)
 * @name POST /partner/new/
 * @param {Object} partner
 * @param {Object} accountCreationRequest
 * @returns {object} success indicator
 */
router.post("/", express.json(), async (req, res) => {
  try {
    const { accountCreationRequest, partner } = req.body;

    // @todo Better verification
    if (!partner) throw new Error("Missing 'partner' data");
    if (!accountCreationRequest)
      throw new Error("Missing 'owner account' data");

    const validateURL = require("../../validations/isHTTPS");

    if (!validateURL(partner.website))
      throw new Error("Website URL should be HTTPS only");

    // Tags is stored together with new partner creation request because of the schema constraint
    // we cannot store in the partnerTags table before partner is created.
    // Join the tags with commas so that we can store it in a single column of new_partners table.
    // @todo Might need to ensure that the user does not use any tags with commas in them.
    partner.tags = partner.tags.join();

    // Insert partner details with accountCreationRequest details into temporary DB and get back the ID for CE admins to verify
    // Destructure out the first value from the returned array
    const [pendingPartnerID] = await SQLdb("new_partners")
      .insert({
        // @todo Enfore a write schema to prevent extra values from breaking the insert process
        ...partner,
        // These values saved into the DB, are used for creating first new partner account once Partner approved by CE admins
        createdByName: accountCreationRequest.name,
        createdByEmail: accountCreationRequest.email,
      })
      .returning("id");

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
        htmlDetails +
        // @todo This part should be replaced by an Admin panel
        `https://ce-partner.api.enkeldigital.com/partner/new/approve/${pendingPartnerID}`,
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

    // 201 indicates that a pending request is created
    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
