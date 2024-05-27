const express = require("express");

const LeadController = require("../controller/lead.js");

const router = express.Router();

//Get All Lead
router.get("/", LeadController.getAllLead);
//Register Lead
router.post("/", LeadController.registerLead);

router.get("/:lead_id", LeadController.getLeadByID);

router.get("/s/:sales_id", LeadController.getLeadByIDsales);

router.put("/:lead_id", LeadController.updateLead);

router.put("/del/:lead_id", LeadController.deleteLead);

router.put("/", LeadController.updateLead);

router.put("/changepassword/:id_lead", LeadController.changePassword);

router.post("/login", LeadController.loginLead);

router.get("/countlead/:id_sales", LeadController.countLeadByidSales);

module.exports = router;
