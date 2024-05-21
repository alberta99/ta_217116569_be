const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const getAllBarang = async () => {
  const connection = await dbpool.getConnection();
  try {
    const query = `SELECT * FROM ${process.env.DB_NAME}.barang where deleted = 1`;
    var data = connection.query(query);
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
  return data;
};

const getBarangByID = async (id_barang) => {
  const connection = await dbpool.getConnection();
  try {
    const query = `SELECT nama_barang, jenis_barang, detail_barang, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang, qty_terjual FROM ${process.env.DB_NAME}.barang WHERE id_barang='${id_barang}'`;
    var data = connection.query(query);
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    connection.release();
  }
  return data;
};

const cekBarangkembar = async (nama) => {
  const connection = await dbpool.getConnection();
  const checkkembar = `SELECT COUNT(*) as cek FROM barang where LOWER(nama_barang) = LOWER('${nama}')`;
  var cekkembar = await connection.query(checkkembar);
  return cekkembar[0][0].cek;
};

const insertBarang = async (body) => {
  let connection;
  try {
    connection = await dbpool.getConnection();
    const {
      nama_barang,
      detail_barang,
      jenis_barang,
      harga_barang,
      gambar_1_barang,
      gambar_2_barang,
      gambar_3_barang,
    } = body;

    const cekkembar = await cekBarangkembar(nama_barang);
    if (parseInt(cekkembar) > 0) {
      throw new Error("Nama produk tidak boleh kembar");
    } else {
      const id_barang = uuidv4();
      const query = `INSERT INTO ${process.env.DB_NAME}.barang(id_barang, nama_barang, jenis_barang, detail_barang, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang, deleted, qty_terjual) VALUES (?,?,?,?,?,?,?,?,?,?)`;
      const data = [
        id_barang,
        nama_barang,
        jenis_barang,
        detail_barang,
        harga_barang,
        gambar_1_barang,
        gambar_2_barang,
        gambar_3_barang,
        1,
        0,
      ];
      await connection.query(query, data);
      return true;
    }
  } catch (error) {
    console.error("Error insert barang:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const updateBarang = async (id_barang, body) => {
  const connection = await dbpool.getConnection();
  try {
    var {
      nama_barang,
      detail_barang,
      jenis_barang,
      harga_barang,
      gambar1_barang,
      gambar2_barang,
      gambar3_barang,
    } = body;
    const cekkembar = await cekBarangkembar(nama_barang);
    if (parseInt(cekkembar) > 0) {
      throw new Error("Nama produk tidak boleh kembar");
    } else {
      const selectgambar = `SELECT gambar1_barang,gambar2_barang,gambar3_barang FROM ${process.env.DB_NAME}.barang WHERE id_barang = '${id_barang}'`;
      const res = await connection.query(selectgambar);
      const gambar1_temp = res[0][0].gambar1_barang;
      const gambar2_temp = res[0][0].gambar2_barang;
      const gambar3_temp = res[0][0].gambar3_barang;
      if (gambar1_barang === "") {
        gambar1_barang = gambar1_temp;
      }
      if (gambar2_barang === "") {
        gambar2_barang = gambar2_temp;
      }
      if (gambar3_barang === "") {
        gambar3_barang = gambar3_temp;
      }
      const query = `UPDATE ${process.env.DB_NAME}.barang SET nama_barang='${nama_barang}',jenis_barang='${jenis_barang}',detail_barang='${detail_barang}',harga_barang=${harga_barang},gambar1_barang='${gambar1_barang}',gambar2_barang='${gambar2_barang}',gambar3_barang='${gambar3_barang}'
      WHERE id_barang = '${id_barang}'`;
      connection.query(query);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

const deleteBarang = async (id_barang) => {
  const connection = await dbpool.getConnection();
  const query = `UPDATE ${process.env.DB_NAME}.barang SET deleted = 0 WHERE id_barang = '${id_barang}' AND deleted = 1`;
  var execute = connection.query(query);
  connection.release();
  return execute;
};

module.exports = {
  insertBarang,
  getAllBarang,
  getBarangByID,
  updateBarang,
  deleteBarang,
};
