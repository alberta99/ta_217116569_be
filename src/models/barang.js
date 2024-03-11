const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const getAllBarang = () => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.barang where deleted = 1`;
  return dbpool.execute(query);
};

const getBarangByID = (id_barang) => {
  const query = `SELECT nama_barang, jenis_barang, detail_barang, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang, qty_terjual FROM ${process.env.DB_NAME}.barang WHERE id_barang='${id_barang}'`;
  return dbpool.execute(query);
};

const insertBarang = (body) => {
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
    return dbpool.execute(query, data);
  } catch (error) {
    console.log(error);
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
  console.log(gambar3_temp);
  const query = `UPDATE ${process.env.DB_NAME}.barang SET nama_barang='${nama_barang}',jenis_barang='${jenis_barang}',detail_barang='${detail_barang}',harga_barang=${harga_barang},gambar1_barang='${gambar1_barang}',gambar2_barang='${gambar2_barang}',gambar3_barang='${gambar3_barang}'
  WHERE id_barang = '${id_barang}'`;
  return dbpool.execute(query);
};

const deleteBarang = (id_barang) => {
  const query = `UPDATE ${process.env.DB_NAME}.barang SET deleted = 0 WHERE id_barang = '${id_barang}' AND deleted = 1`;
  return dbpool.execute(query);
};

module.exports = {
  insertBarang,
  getAllBarang,
  getBarangByID,
  updateBarang,
  deleteBarang,
};
