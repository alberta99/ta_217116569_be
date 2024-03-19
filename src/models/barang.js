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

const cekBarangkembar = async (body) => {
  const connection = await dbpool.getConnection();
  const { nama_barang } = body;
  const checkkembar = `SELECT COUNT(*) as 'check' FROM barang where LOWER(nama_barang) = LOWER('${nama_barang}')`;
  var cekkembar = await connection.query(checkkembar);
  var kembar = parseInt(cekkembar[0][0].check);
  return kembar;
};
const insertBarang = async (body) => {
  const connection = await dbpool.getConnection();
  try {
    const {
      nama_barang,
      detail_barang,
      jenis_barang,
      harga_barang,
      gambar1_barang,
      gambar2_barang,
      gambar3_barang,
    } = body;
    const id_barang = uuidv4();
    const query = `INSERT INTO ${process.env.DB_NAME}.barang(id_barang, nama_barang, jenis_barang, detail_barang, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang, deleted,qty_terjual) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    const data = [
      id_barang,
      nama_barang,
      jenis_barang,
      detail_barang,
      harga_barang,
      gambar1_barang,
      gambar2_barang,
      gambar3_barang,
      1,
      0,
    ];
    connection.query(query, data);
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }
};

const updateBarang = async (id_barang, body) => {
  var {
    nama_barang,
    detail_barang,
    jenis_barang,
    harga_barang,
    gambar1_barang,
    gambar2_barang,
    gambar3_barang,
  } = body;
  const selectgambar = `SELECT gambar1_barang,gambar2_barang,gambar3_barang FROM ${process.env.DB_NAME}.barang WHERE id_barang = '${id_barang}'`;
  const res = await dbpool.execute(selectgambar);
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
  return dbpool.execute(query);
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
  cekBarangkembar,
};
