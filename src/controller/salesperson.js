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

const getSalesByID = async (req,res) => {
    const sales_id = req.params.sales_id;
    try {
        const data = await salesModel.getSalesByID(sales_id);
        const sales = data[0][0]
        if(!sales){
            return res.status(404).json({
                message: "Salesperson Not Found",
                data: null
            })
        }
        return res.json({
            message : 'Get Sales By ID Sukses',
            data : sales
        })
    } catch (error) {
        return res.status(500).json({
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

const updateSales = async (req,res) => {    
    try {
        const {body} = req;
        await salesModel.updateSales(
            req.params.sales_id,body
        );
        return res.status(200).json({
            message: "Update Sales Berhasil",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Update Sales gagal",
            serverMessage: error
        })
    }
}

const deleteSales = async (req,res) => {
    try {
        const sales_id = req.params.sales_id;
        await salesModel.deleteSales(sales_id);
        
        return res.json({
            message : 'Delete Sales Sukses',
            data : data
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}
module.exports = {
    getAllSales,
    registerSales,
    getSalesByID,
    deleteSales,
    updateSales
}