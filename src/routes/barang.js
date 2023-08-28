const express = require('express');

const barangController = require ('../controller/barang');

const router = express.Router();

//Get All Lead
router.get('/', barangController.getAllBarang);
//Register Lead
router.post('/',barangController.insertBarang);

module.exports = router;