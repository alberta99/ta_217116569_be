const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');

const getAllBarang = () => {
    const query = 'SELECT * FROM barang';
    return dbpool.execute(query);
}

const insertBarang = (body) => {
    const {nama_barang,
        detail_barang,
        jenis_barang,
        harga_barang} = body;
    const id_barang = uuidv4();
    const query =   "INSERT INTO `barang`(`id_barang`, `nama_barang`, `jenis_barang`, `detail_barang`, harga_barang) VALUES (?,?,?,?,?)"
    const data = [
        id_barang,nama_barang,jenis_barang,detail_barang,harga_barang
    ]
    return dbpool.execute(query,data);
}

module.exports = {
    insertBarang, getAllBarang
}