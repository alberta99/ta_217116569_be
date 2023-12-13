const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");

const getAllBarang = () => {
  const query = "SELECT * FROM barang where deleted = 1";
  return dbpool.execute(query);
};

const getBarangByID = (id_barang) => {
  const query = `SELECT nama_barang, jenis_barang, detail_barang, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang FROM barang WHERE id_barang='${id_barang}'`;
  return dbpool.execute(query);
};

const insertBarang = (body) => {
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
  const query =
    "INSERT INTO `barang`(`id_barang`, `nama_barang`, `jenis_barang`, `detail_barang`, harga_barang, gambar1_barang, gambar2_barang, gambar3_barang, deleted) VALUES (?,?,?,?,?,?,?,?,?)";
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
  ];
  return dbpool.execute(query, data);
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
  const selectgambar = `SELECT gambar1_barang,gambar2_barang,gambar3_barang FROM barang WHERE id_barang = '${id_barang}'`;
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
  const query = `UPDATE barang SET nama_barang='${nama_barang}',jenis_barang='${jenis_barang}',detail_barang='${detail_barang}',harga_barang=${harga_barang},gambar1_barang='${gambar1_barang}',gambar2_barang='${gambar2_barang}',gambar3_barang='${gambar3_barang}'
  WHERE id_barang = '${id_barang}'`;
  return dbpool.execute(query);
};

const deleteBarang = (id_barang) => {
  const query = `UPDATE barang SET deleted = 0 WHERE id_barang = '${id_barang}' AND deleted = 1`;
  return dbpool.execute(query);
};

module.exports = {
  insertBarang,
  getAllBarang,
  getBarangByID,
  updateBarang,
  deleteBarang,
};
