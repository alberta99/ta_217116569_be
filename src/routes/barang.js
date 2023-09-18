const express = require('express');
const multer = require('multer');
const path = require ('path');


const barangController = require ('../controller/barang');
const router = express.Router();

const storage = multer.diskStorage({
    destination:'./public/images',
    filename:(req, file, cb) => {
        return cb(null,`${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer ({
    storage:storage
}).fields([{
        name: 'gambar_1',
        maxCount:1
    },{
        name: 'gambar_2',
        maxCount:1
    },{
        name:'gambar_3',
        maxCount:1
    }
])

//Get All Barang
router.get('/', barangController.getAllBarang);
//Register barang
router.post('/', upload, barangController.insertBarang);
router.get('/:product_id', barangController.getBarangByID);
router.put('/:product_id',upload,barangController.updateBarang);

module.exports = router;