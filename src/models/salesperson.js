const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
const getAllSales = () => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.salesperson where deleted = 1`;
  return dbpool.execute(query);
};

const getSalesByID = (id_sales) => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.salesperson WHERE id_sales='${id_sales}' AND deleted = 1`;
  return dbpool.execute(query);
};

const updateSales = (id_sales, body) => {
  const { nama_sales, alamat_sales, nohp_sales, email_sales } = body;
  const query = `UPDATE ${process.env.DB_NAME}.salesperson SET nama_sales='${nama_sales}',alamat_sales='${alamat_sales}',nohp_sales='${nohp_sales}',email_sales='${email_sales}' WHERE id_sales = '${id_sales}'`;
  return dbpool.execute(query);
};

const deleteSales = (id_sales) => {
  const query = `UPDATE ${process.env.DB_NAME}.salesperson SET deleted = 0 WHERE id_sales = '${id_sales}' AND deleted = 1`;
  return dbpool.execute(query);
};

const registerSales = (body) => {
  const { nama_sales, alamat_sales, nohp_sales, email_sales, password_sales } =
    body;
  const id_sales = uuidv4();
  const date = new Date();
  const temp_date =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  const query = `INSERT INTO '${process.env.DB_NAME}.salesperson'('id_sales','tgl_join_sales' ,'nama_sales', 'alamat_sales', 'nohp_sales', 'email_sales','password_sales','status','deleted') VALUES (?,?,?,?,?,?,?,?,?)`;
  const data = [
    id_sales,
    temp_date,
    nama_sales,
    alamat_sales,
    nohp_sales,
    email_sales,
    password_sales,
    1,
    1,
  ];
  return dbpool.execute(query, data);
};

const loginSales = (email, password) => {
  const query = `select * from ${process.env.DB_NAME}.salesperson where email_sales = '${email}' AND password_sales = '${password}' AND status = 1 AND deleted = 1`;
  return dbpool.execute(query);
};

module.exports = {
  getAllSales,
  registerSales,
  getSalesByID,
  updateSales,
  deleteSales,
  loginSales,
};
