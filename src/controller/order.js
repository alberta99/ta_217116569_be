const orderModel = require('../models/order');

const getAllOrder_detail = async (req,res) => {
    try {
        const [data] = await orderModel.getAllOrder_detail();
        res.json({
            message : 'Get Order Detail success',
            data : data
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}

const getAllOrder_Sum = async (req,res) => {
    try {
        const [data] = await orderModel.getAllOrder_sum();
        res.json({
            message : 'Get Order Detail success',
            data : data
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            serverMessage: error
        })
    }
}

const inputOrderDetail = async (req,res) => {
    const {body} = req;
    try {
        await orderModel.inputOrderDetail(body);
        res.status(200).json({
            message: "Order Berhasil",
        })
    } catch (error) {
        res.status(500).json({
            message: "Register gagal",
            serverMessage: error
        })
    }
}

const inputOrderSummary = async (req,res) => {
    const {body} = req;
    try {
        await orderModel.inputOrderSummary(body);
        res.status(200).json({
            message: "Order Berhasil",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Input order gagal woyy",
            serverMessage: error
        })
    }
}
module.exports = {
    inputOrderDetail,
    inputOrderSummary,
    getAllOrder_Sum,
    getAllOrder_detail
}