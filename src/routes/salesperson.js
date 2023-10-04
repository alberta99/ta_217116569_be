const express = require('express');

const salesController = require ('../controller/salesperson');

const router = express.Router();

//Get All Sales
router.get('/', salesController.getAllSales);

router.get('/:sales_id', salesController.getSalesByID);

//Register Sales
router.post('/',salesController.registerSales);

router.put('/:sales_id', salesController.updateSales);

router.put('/del/:sales_id', salesController.deleteSales);

router.get('/login/:email/:password', salesController.loginSales);

module.exports = router;