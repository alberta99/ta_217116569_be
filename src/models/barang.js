const dbpool = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');

const getAllBarang = () => {
    const query = 'SELECT * FROM barang';
    return dbpool.execute(query);
}

const getBarangByID = (id_barang) => {
    const query = `SELECT nama_barang, jenis_barang, detail_barang, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang FROM barang WHERE id_barang='${id_barang}'`
    return dbpool.execute(query);
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

const updateBarang = (id_barang,body) =>{
    const {nama_barang,
        detail_barang,
        jenis_barang,
        harga_barang
        //gambar1_barang,
        //gambar2_barang,
        //gambar3_barang
       } = body;
    const query = `UPDATE barang SET nama_barang='${nama_barang}',jenis_barang='${jenis_barang}',detail_barang='${detail_barang}',harga_barang=${harga_barang} WHERE id_barang = '${id_barang}'`
    //'gambar1_barang'='${gambar1_barang}','gambar2_barang'='${gambar2_barang}','gambar3_barang'='${gambar3_barang}'
    return dbpool.execute(query);
}

module.exports = {
    insertBarang, getAllBarang, getBarangByID, updateBarang
}