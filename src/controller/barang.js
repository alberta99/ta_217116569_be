const cloudinary = require("../config/cloudinaryconfig");
const barangModel = require('../models/barang');
const getAllBarang = async (req,res) => {
    try {
        const [data] = await barangModel.getAllBarang();
        
        res.json({
            message : 'Get All Barang Sukses',
            data : data
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}

const insertBarang = async (req,res) => {
    const {body} = req;
    try {
        const {url:gambar1temp} = await cloudinary.v2.uploader.upload(
            req.files["gambar_1"].tempFilePath,
            {
                public_id: new Date().getTime(),
            }
        );
        const {url:gambar2temp} = await cloudinary.v2.uploader.upload(
            req.files["gambar_2"].tempFilePath,
            {
                public_id: new Date().getTime(),
            }
        );
        const {url:gambar3temp} = await cloudinary.v2.uploader.upload(
            req.files["gambar_3"].tempFilePath,
            {
                public_id: new Date().getTime(),
            }
        );
        await barangModel.insertBarang({
            ...body,
            gambar1_barang : gambar1temp,
            gambar2_barang : gambar2temp,
            gambar3_barang : gambar3temp

        });
        res.status(200).json({
            message: "Insert Barang Berhasil",
        })
    } catch (error) {
        res.status(500).json({
            message: "Insert Barang gagal",
            serverMessage: error
        })
    }
}
module.exports = {
    getAllBarang,
    insertBarang
}
