const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");

const insertJadwal = (body) => {
  const { id_sales, id_lead, tanggal_kunjungan, catatan_kunjungan } = body;
  const id_jadwal = uuidv4();
  const date = new Date(tanggal_kunjungan);
  const temp_date =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    "-" +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  const query = `INSERT INTO ${process.env.DB_NAME}.jadwal(id_jadwal, id_lead, id_sales, tanggal_kunjungan,catatan_kunjungan) VALUES (?,?,?,?,?)`;
  const data = [id_jadwal, id_lead, id_sales, temp_date, catatan_kunjungan];
  return dbpool.execute(query, data);
};

const getJadwalByIDsales = (id_sales) => {
  const query = `select j.id_jadwal,j.tanggal_kunjungan, j.catatan_kunjungan, l.nama_lead, l.nama_perusahaan, l.alamat_lead,l.detail_alamat, l.nohp_lead from ${process.env.DB_NAME}.jadwal j JOIN ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead where j.id_sales='${id_sales}';`;
  return dbpool.execute(query);
};

const getJadwalByIDJadwal = (id_jadwal) => {
  const query = `select j.id_jadwal,j.tanggal_kunjungan, j.catatan_kunjungan,j.id_sales, l.nama_lead, l.nama_perusahaan, l.alamat_lead,l.detail_alamat,l.lat_lead,l.lng_lead, l.nohp_lead from ${process.env.DB_NAME}.jadwal j JOIN ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead where j.id_jadwal='${id_jadwal}';`;
  return dbpool.execute(query);
};

const getJadwalByTanggalidSales = (id_sales, tanggal) => {
  const query = `select j.id_jadwal,j.tanggal_kunjungan, j.catatan_kunjungan, l.nama_lead, l.nama_perusahaan, l.alamat_lead,l.detail_alamat, l.nohp_lead from ${process.env.DB_NAME}.jadwal j JOIN ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead where j.id_sales='${id_sales}' and DATE(j.tanggal_kunjungan)='${tanggal}';`;
  return dbpool.execute(query);
};

module.exports = {
  insertJadwal,
  getJadwalByIDsales,
  getJadwalByIDJadwal,
  getJadwalByTanggalidSales,
};
