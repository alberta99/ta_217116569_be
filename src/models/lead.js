const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
const getAllLead = () => {
  const query = `SELECT l.nama_lead,l.nama_perusahaan,l.alamat_lead,l.nohp_lead,l.email_lead,l.tgl_join_lead,l.id_sales, s.nama_sales FROM ${process.env.DB_NAME}.lead l JOIN ${process.env.DB_NAME}.salesperson s ON l.id_sales=s.id_sales where l.deleted = 1`;
  return dbpool.execute(query);
};

//kenapa error
const getLeadByID = (id_lead) => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.lead WHERE id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

const changePassword = (id_lead, body) => {
  const { passwordbaru } = body;
  const query = `UPDATE ${process.env.DB_NAME}.lead SET password_lead='${passwordbaru}' WHERE id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

const getLeadByIDsales = (id_sales) => {
  const query = `SELECT l.id_lead,l.nama_lead,l.nama_perusahaan,l.alamat_lead,l.nohp_lead,l.email_lead,l.tgl_join_lead,l.id_sales, s.nama_sales FROM ${process.env.DB_NAME}.lead l JOIN ${process.env.DB_NAME}.salesperson s ON l.id_sales=s.id_sales where l.deleted = 1 AND l.id_sales='${id_sales}'`;
  return dbpool.execute(query);
};

const updateLead = (id_lead, body) => {
  const {
    nama_lead,
    nama_perusahaan,
    alamat_lead,
    nohp_lead,
    email_lead,
    long_lead,
    lat_lead,
  } = body;
  const query = `UPDATE ${process.env.DB_NAME}.lead SET nama_lead='${nama_lead}',nama_perusahaan='${nama_perusahaan}',alamat_lead='${alamat_lead}',nohp_lead='${nohp_lead}',email_lead='${email_lead}' WHERE id_lead = '${id_lead}'`;
  //,long_lead=${long_lead},lat_lead=${lat_lead}
  return dbpool.execute(query);
};

const registerLead = (body) => {
  try {
    const {
      nama_lead,
      tgl_lahir_lead,
      nama_perusahaan,
      alamat_lead,
      detail_alamat,
      lat_lng_lead,
      nohp_lead,
      email_lead,
      id_sales,
    } = body;
    const tgl_join_temp = new Date();
    const temp_date =
      tgl_join_temp.getFullYear() +
      "-" +
      ("00" + (tgl_join_temp.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + tgl_join_temp.getDate()).slice(-2) +
      " " +
      ("00" + tgl_join_temp.getHours()).slice(-2) +
      ":" +
      ("00" + tgl_join_temp.getMinutes()).slice(-2) +
      ":" +
      ("00" + tgl_join_temp.getSeconds()).slice(-2);
    const id_lead = uuidv4();
    const lat = lat_lng_lead.lat;
    const lng = lat_lng_lead.lng;
    const date = new Date(tgl_lahir_lead);
    const tgl_lahir =
      date.getFullYear() +
      "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date.getDate()).slice(-2);
    const query = `INSERT INTO ${process.env.DB_NAME}.lead(id_lead, nama_lead, tgl_lahir_lead, nama_perusahaan,alamat_lead,detail_alamat, lat_lead,lng_lead,nohp_lead,email_lead,password_lead,tgl_join_lead,id_sales,status,deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const data = [
      id_lead,
      nama_lead,
      tgl_lahir,
      nama_perusahaan,
      alamat_lead,
      detail_alamat,
      lat,
      lng,
      nohp_lead,
      email_lead,
      "default",
      temp_date,
      id_sales,
      0,
      1,
    ];
    return dbpool.execute(query, data);
  } catch (error) {
    console.log(error);
  }
};

const deleteLead = (id_lead) => {
  const query = `UPDATE ${process.env.DB_NAME}.lead SET deleted = 0 WHERE id_lead = '${id_lead}' AND deleted = 1`;
  return dbpool.execute(query);
};

module.exports = {
  getAllLead,
  registerLead,
  getLeadByID,
  updateLead,
  deleteLead,
  getLeadByIDsales,
  changePassword,
};
