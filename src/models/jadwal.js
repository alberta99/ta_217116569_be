const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
var moment = require("moment");

const insertJadwal = async (body) => {
  const connection = await dbpool.getConnection();
  const { id_sales, id_lead, tanggal_kunjungan, catatan_kunjungan } = body;
  const id_jadwal = uuidv4();
  const date = new Date(tanggal_kunjungan);
  const temp_date = moment(date).format("YYYY-MM-DD HH:mm:ss");
  const query = `INSERT INTO ${process.env.DB_NAME}.jadwal(id_jadwal, id_lead, id_sales, tanggal_kunjungan,catatan_kunjungan) VALUES (?,?,?,?,?)`;
  const data = [id_jadwal, id_lead, id_sales, temp_date, catatan_kunjungan];
  var execute = connection.query(query, data);
  connection.release();
  return execute;
};

const getJadwalByIDsales = (id_sales) => {
  const query = `select j.id_jadwal,j.tanggal_kunjungan, j.catatan_kunjungan, l.nama_lead, l.nama_toko, l.alamat_lead,l.detail_alamat, l.nohp_lead from ${process.env.DB_NAME}.jadwal j JOIN ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead where j.id_sales='${id_sales}' ORDER BY DATE(j.tanggal_kunjungan) DESC;`;
  return dbpool.execute(query);
};

const getJadwalByIDsalesToday = (id_sales) => {
  const query = `SELECT 
  j.id_jadwal,
  j.tanggal_kunjungan,
  j.catatan_kunjungan, 
  l.nama_lead, 
  l.nama_toko, 
  l.alamat_lead,
  l.detail_alamat, 
  l.nohp_lead 
FROM 
  ${process.env.DB_NAME}.jadwal j 
JOIN 
  ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead 
WHERE 
  j.id_sales='${id_sales}' AND DATE(j.tanggal_kunjungan) = CURDATE() 
ORDER BY 
  DATE(j.tanggal_kunjungan) DESC
;`;
  return dbpool.execute(query);
};

const getJadwalByIDJadwal = (id_jadwal) => {
  const query = `select j.id_jadwal,j.tanggal_kunjungan, j.catatan_kunjungan,j.id_sales, l.nama_lead, l.nama_toko, l.alamat_lead,l.detail_alamat,l.lat_lead,l.lng_lead, l.nohp_lead from ${process.env.DB_NAME}.jadwal j JOIN ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead where j.id_jadwal='${id_jadwal}';`;
  return dbpool.execute(query);
};

const getJadwalByTanggalidSales = (id_sales, tanggal) => {
  const query = `select j.id_jadwal,j.tanggal_kunjungan, j.catatan_kunjungan, l.nama_lead, l.nama_toko, l.alamat_lead,l.detail_alamat, l.nohp_lead from ${process.env.DB_NAME}.jadwal j JOIN ${process.env.DB_NAME}.lead l ON l.id_lead=j.id_lead where j.id_sales='${id_sales}' and DATE(j.tanggal_kunjungan)='${tanggal}' ORDER BY DATE(j.tanggal_kunjungan) DESC;`;
  return dbpool.execute(query);
};

module.exports = {
  insertJadwal,
  getJadwalByIDsales,
  getJadwalByIDJadwal,
  getJadwalByTanggalidSales,
  getJadwalByIDsalesToday,
};
