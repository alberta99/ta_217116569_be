const express = require('express');

const OrderController = require ('../controller/order');

const router = express.Router();

router.get('/sum', OrderController.getAllOrder_Sum);
router.get('/det', OrderController.getAllOrder_detail);

router.post('/det',OrderController.inputOrderDetail);
router.post('/sum',OrderController.inputOrderSummary);


module.exports = router;