const salesModel = require('../models/salesperson');
const getAllSales = async (req,res) => {
    try {
        const [data] = await salesModel.getAllSales();
        res.json({
            message : 'Get All Salesperson Sukses',
            data : data
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}

const registerSales = async (req,res) => {
    const {body} = req;
    try {
        await salesModel.registerSales(body);
        res.status(200).json({
            message: "Register Berhasil",
        })
    } catch (error) {
        res.status(500).json({
            message: "Register gagal",
            serverMessage: error
        })
    }
}
module.exports = {
    getAllSales,
    registerSales
}