const express = require('express');
const multer = require('multer');
const path = require ('path');

const barangController = require ('../controller/barang');

const router = express.Router();


//Get All Barang
router.get('/', barangController.getAllBarang);
//Register barang
router.post('/', barangController.insertBarang);

module.exports = router;