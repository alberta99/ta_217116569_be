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


async function generateOrderNumber() {
    let query = `SELECT COUNT(*) as orderCount FROM order_sum`;
    return dbpool.execute(query);
}

const inputOrderSummary = (body) => {
    const id_order_temp = generateOrderNumber();
    console.log(id_order_temp);
    // let id_order = `INV+${id_order_temp[0].orderCount}`;
    const {id_sales,
        id_lead,
        total_order,
        ket_order} = body;
    const date = new Date();
    const temp_date = date.getFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + 
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2) + ':' + 
        ('00' + date.getSeconds()).slice(-2);
    const query = "INSERT INTO `order_sum`(`id_order`, `tanggal_order`, `id_sales`, `id_lead`, `total_order`, `ket_order`) VALUES (?,?,?,?,?,?)"
    console.log(id_order+" -|||||- "+date)
    const data = [
        id_order,temp_date,id_sales,id_lead,total_order,ket_order
    ]
    return dbpool.execute(query,data);
}

module.exports = {
    getAllOrder_detail, getAllOrder_sum, inputOrderDetail, inputOrderSummary
}