const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');
const getAllSales = () => {
    const query = 'SELECT * FROM salesperson';
    return dbpool.execute(query);
}

const registerSales = (body) => {
    const {nama_sales,
        alamat_sales,
        nohp_sales,
        email_sales,
        password_sales} = body;
    const id_sales = uuidv4();
    const date = new Date();
    const temp_date = date.getFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2) + ':' + 
        ('00' + date.getSeconds()).slice(-2);
    const query =   "INSERT INTO `salesperson`(`id_sales`,`tgl_join_sales` ,`nama_sales`, `alamat_sales`, `nohp_sales`, `email_sales`,`password_sales`) VALUES (?,?,?,?,?,?,?)"
    const data = [
        id_sales,temp_date,nama_sales,alamat_sales,nohp_sales,email_sales,password_sales
    ]
    return dbpool.execute(query,data);
}

module.exports = {
    getAllSales, registerSales
}