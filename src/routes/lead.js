const express = require('express');

const LeadController = require ('../controller/lead.js');

const router = express.Router();

router.get('/', LeadController.getAllLead);
router.post('/',LeadController.insertLead);

module.exports = router;