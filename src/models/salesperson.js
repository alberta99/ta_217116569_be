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
    const query =   "INSERT INTO `salesperson`(`id_sales`, `nama_sales`, `alamat_sales`, `nohp_sales`, `email_sales`,`password_sales`) VALUES (?,?,?,?,?,?)"
    const data = [
        id_sales,nama_sales,alamat_sales,nohp_sales,email_sales,password_sales
    ]
    return dbpool.execute(query,data);
}

module.exports = {
    getAllSales, registerSales
}