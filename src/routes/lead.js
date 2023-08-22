const express = require('express');

const LeadController = require ('../controller/lead.js');

const router = express.Router();

//Get All Lead
router.get('/', LeadController.getAllLead);
//Register Lead
router.post('/',LeadController.registerLead);

module.exports = router;