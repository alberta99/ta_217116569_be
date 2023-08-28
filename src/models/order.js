const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');

const getAllOrder_sum = () => {
    const query = 'SELECT * FROM order_sum';
    return dbpool.execute(query);
}

const getAllOrder_detail = () => {
    const query = 'SELECT * FROM order_detail';
    return dbpool.execute(query);
}

//INPUT ORDER (PERLU DIGANTI)
const inputOrderDetail = (body) => {
    const {id_order,
        id_barang,
        harga_barang_order,
        qty_barang} = body;
    const id_order_detail = uuidv4();
    const sub_total = qty_barang*harga_barang_order;
    const query = "INSERT INTO `order_detail`(`id_order_detail`, `id_order`, `id_barang`, harga_barang_order, qty_barang, sub_total) VALUES (?,?,?,?,?,?)"
    const data = [
        id_order_detail,id_order,id_barang,harga_barang_order,qty_barang,sub_total
    ]
    return dbpool.execute(query,data);
}

function generateOrderNumber(callback) {
    dbpool.query('SELECT COUNT(*) AS orderCount FROM order_sum', (error, results) => {
        if (error) throw error;
        const orderCount = results[0].orderCount + 1;
        const paddedCount = orderCount.toString().padStart(4, '0');
        const orderNumber = `INV${paddedCount}`;
        callback(orderNumber);
    });
}

const inputOrderSummary = (body) => {
    generateOrderNumber(orderNumber);
    const id_order = orderNumber;
    const {id_barang,
        harga_barang_order,
        qty_barang} = body;
    const sub_total = qty_barang*harga_barang_order;
    const query = "INSERT INTO `order_sum`(`id_order`, `tanggal_order`, `id_sales`, `id_lead`, `total_order`, `ket_order`) VALUES (?,GETDATE(),?,?,?,?)"
    const data = [
        id_order,id_barang,harga_barang_order,qty_barang,sub_total
    ]
    return dbpool.execute(query,data);
}

module.exports = {
    getAllOrder_detail, getAllOrder_sum, inputOrderDetail, inputOrderSummary
}