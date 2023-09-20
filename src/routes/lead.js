const express = require('express');

const LeadController = require ('../controller/lead.js');

const router = express.Router();

//Get All Lead
router.get('/', LeadController.getAllLead);
//Register Lead
router.post('/',LeadController.registerLead);

router.get('/:lead_id', LeadController.getLeadByID);

router.put('/:lead_id', LeadController.updateLead);

router.put('/',LeadController.updateLead);
module.exports = router;