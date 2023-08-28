const express = require('express');

const salesController = require ('../controller/salesperson');

const router = express.Router();

//Get All Sales
router.get('/', salesController.getAllSales);
//Register Sales
router.post('/',salesController.registerSales);

module.exports = router;