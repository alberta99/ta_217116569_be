const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');

const getAllBarang = () => {
    const query = 'SELECT * FROM barang';
    return dbpool.execute(query);
}

const getBarangByID = (id_barang) => {
    const query = `SELECT 'nama_barang', 'harga_barang' FROM barang WHERE deleted = 0 && id_barang = ${id_barang}`
    return dbpool.execute(query,data);
}

const insertBarang = (body) => {
    const {nama_barang,
        detail_barang,
        jenis_barang,
        harga_barang,
        gambar1_barang,
        gambar2_barang,
        gambar3_barang
       } = body;
    const id_barang = uuidv4();
    const query =   "INSERT INTO `barang`(`id_barang`, `nama_barang`, `jenis_barang`, `detail_barang`, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang) VALUES (?,?,?,?,?,?,?,?)"
    const data = [
        id_barang,nama_barang,jenis_barang,detail_barang,harga_barang, gambar1_barang, gambar2_barang, gambar3_barang
    ]
    return dbpool.execute(query,data);
}

const updateBarang = (req) =>{
    const {nama_barang,
        detail_barang,
        jenis_barang,
        harga_barang,
        gambar1_barang,
        gambar2_barang,
        gambar3_barang
       } = body;
    const id_barang = uuidv4();
    const query = `UPDATE barang SET 'nama_barang='${nama_barang}','jenis_barang'='${jenis_barang}','detail_barang'='${detail_barang}','harga_barang'='[value-5]','gambar1_barang'='[value-6]','gambar2_barang'='[value-7]','gambar3_barang'='[value-8]' WHERE 1`
    // const data = [
    //     id_barang,nama_barang,jenis_barang,detail_barang,harga_barang, gambar1_barang, gambar2_barang, gambar3_barang
    // ]
    return dbpool.execute(query);
}

module.exports = {
    insertBarang, getAllBarang
}