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
        await barangModel.insertBarang(body);
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