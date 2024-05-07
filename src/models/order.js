const dbpool = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const getAllOrder_sum = () => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.order_sum`;
  return dbpool.execute(query);
};

const getAllOrder_detail = () => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.order_detail`;
  return dbpool.execute(query);
};

const getOrderSum_by_idOrder = (id_order) => {
  const query = `SELECT 
                  os.id_order,os.tanggal_order,os.tanggal_kirim,os.alamat_kirim,os.nama_penerima,os.nama_toko_penerima,
                  os.no_telp_penerima,os.id_sales,os.sub_total_order,os.harga_diskon,os.id_lead,os.qty_total,os.total_order,
                  os.jenis_pembayaran,l.nohp_lead,l.nama_lead,l.nama_toko,l.alamat_lead,l.detail_alamat,s.nama_sales 
                FROM 
                  ${process.env.DB_NAME}.order_sum os 
                JOIN 
                  ${process.env.DB_NAME}.lead l 
                ON 
                  l.id_lead = os.id_lead 
                JOIN 
                  ${process.env.DB_NAME}.salesperson s 
                ON 
                  s.id_sales=os.id_sales 
                WHERE 
                  os.id_order='${id_order}'`;
  return dbpool.execute(query);
};

const getAllOrder_idsales = (id_sales) => {
  const query = `SELECT os.id_order,os.tanggal_order,os.tanggal_kirim,os.alamat_kirim,os.id_sales,os.id_lead,os.qty_total,os.total_order,os.jenis_pembayaran,l.nama_lead,l.nama_toko FROM ${process.env.DB_NAME}.order_sum os JOIN ${process.env.DB_NAME}.lead l ON l.id_lead = os.id_lead WHERE os.id_sales='${id_sales}'`;
  return dbpool.execute(query);
};

const getOrder_detail = (id_order) => {
  const query = `SELECT id_order_detail, id_order, id_barang, nama_barang, harga_barang_order, qty_barang, sub_total, catatan_order FROM ${process.env.DB_NAME}.order_detail WHERE id_order = '${id_order}'`;
  return dbpool.execute(query);
};

const getOrder_byIdLead = (id_lead) => {
  const query = `SELECT os.id_order,os.tanggal_order,os.tanggal_kirim,os.alamat_kirim,os.id_sales,os.id_lead,os.qty_total,os.total_order,os.jenis_pembayaran,l.nama_lead,l.nama_toko FROM ${process.env.DB_NAME}.order_sum os JOIN ${process.env.DB_NAME}.lead l ON l.id_lead = os.id_lead WHERE os.id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

async function generateOrderNumber() {
  let query = `SELECT COUNT(*) as orderCount FROM ${process.env.DB_NAME}.order_sum where date(tanggal_order) = CURRENT_DATE`;
  return dbpool.execute(query);
}

function paddingCount(angka, panjang) {
  return String(angka).padStart(panjang, "0");
}

const inputOrderSummary = async (body) => {
  const id_order_temp = await generateOrderNumber();
  const count = id_order_temp[0][0].orderCount;
  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    const {
      id_sales,
      id_lead,
      tanggal_kirim,
      nama_penerima,
      nama_toko_penerima,
      alamat_kirim,
      no_telp_penerima,
      jenis_pembayaran,
      harga_total,
      qty_total,
      harga_diskon,
    } = body;
    const date = new Date();
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
    const id_order = `INV-${("00" + date.getDate()).slice(-2)}${(
      "00" +
      (date.getMonth() + 1)
    ).slice(-2)}${date.getFullYear()}-${paddingCount(count + 1, 4)}`;
    //tanggal kirim
    const date2 = new Date(tanggal_kirim);
    const tgl_kirim =
      date2.getFullYear() +
      "-" +
      ("00" + (date2.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date2.getDate()).slice(-2);
    //details
    const temp_diskon =
      harga_diskon && harga_diskon != "" && harga_diskon != null
        ? parseInt(harga_diskon)
        : 0;
    const query1 = `INSERT INTO ${process.env.DB_NAME}.order_sum(id_order, tanggal_order,tanggal_kirim,nama_penerima,nama_toko_penerima,alamat_kirim,no_telp_penerima, id_sales, id_lead, qty_total,sub_total_order,harga_diskon ,total_order, jenis_pembayaran,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result1 = await connection.query(query1, [
      id_order,
      temp_date,
      tgl_kirim,
      nama_penerima,
      nama_toko_penerima,
      alamat_kirim,
      no_telp_penerima,
      id_sales,
      id_lead,
      qty_total,
      harga_total,
      temp_diskon,
      harga_total - (temp_diskon == null ? 0 : temp_diskon),
      jenis_pembayaran,
      0,
    ]);
    const order_details = body.detail.map((item) => {
      return [
        uuidv4(),
        id_order,
        item.id_barang,
        item.nama_barang,
        item.harga_barang,
        item.qty_barang,
        item.sub_total,
        item.catatan_order == null ? "" : item.catatan_order,
      ];
    });
    const query2 = `INSERT INTO ${process.env.DB_NAME}.order_detail(id_order_detail, id_order, id_barang, nama_barang, harga_barang_order, qty_barang, sub_total, catatan_order) VALUES ?`;
    const result2 = await connection.query(query2, [order_details]);
    const cekstatus = `SELECT status FROM ${process.env.DB_NAME}.lead WHERE id_lead='${id_lead}'`;
    const cekstatusresult = await connection.query(cekstatus);
    if (parseInt(cekstatusresult[0][0].status) == 0) {
      const query3 = `UPDATE ${
        process.env.DB_NAME
      }.lead set status=1,tgl_konversi_lead='${moment("2024-04-23").format(
        "YYYY-MM-DD"
      )}' where id_lead='${id_lead}'`;
      await connection.query(query3);
    }
    for (let i = 0; i < body.detail.length; i++) {
      const query4 = `UPDATE ${process.env.DB_NAME}.barang set qty_terjual = qty_terjual+${body.detail[i].qty_barang} WHERE id_barang='${body.detail[i].id_barang}'`;
      await connection.query(query4);
    }
    await connection.commit();
    return [result1, result2];
  } catch (error) {
    await connection.rollback();
    dbpool.releaseConnection();
    console.log(error);
    return error;
  }
};

const daftarPesanan = async (body) => {
  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    const { id_sales, id_lead } = body;
    const id_cart = uuidv4();
    let total = 0;
    let qty_temp = 0;
    const cart_details = body.detail.map((item) => {
      const sub_total = item.qty_barang * item.harga_barang;
      total += sub_total;
      qty_temp += item.qty_barang;
      return [
        uuidv4(),
        id_cart,
        item.id_barang,
        item.nama_barang,
        item.harga_barang,
        item.qty_barang,
        sub_total,
      ];
    });
    const query1 = `INSERT INTO ${process.env.DB_NAME}.cart(id_cart, id_sales,id_lead, qty_total, harga_total) VALUES (?,?,?,?,?)`;
    const result1 = await connection.query(query1, [
      id_cart,
      id_sales,
      id_lead,
      qty_temp,
      total,
    ]);
    const query2 = `INSERT INTO ${process.env.DB_NAME}.cart_detail(id_cart_detail, id_cart, id_barang, nama_barang, harga_barang, qty_barang, sub_total) VALUES ?`;
    const result2 = await connection.query(query2, [cart_details]);
    await connection.commit();
    return [result1, result2];
  } catch (error) {
    await connection.rollback();
    console.log(error);
    dbpool.releaseConnection();
    return error;
  }
};

const getDaftarpesanan_idsales = (id_sales, id_lead) => {
  const query = `SELECT dp.id_cart,dp.id_sales,dp.id_lead,dp.qty_total,dp.harga_total,dpd.id_cart_detail,dpd.id_barang,dpd.nama_barang,dpd.harga_barang,dpd.qty_barang,dpd.sub_total, b.gambar1_barang,l.nama_lead,l.nama_toko FROM ${process.env.DB_NAME}.cart dp JOIN ${process.env.DB_NAME}.cart_detail dpd ON dp.id_cart=dpd.id_cart JOIN ${process.env.DB_NAME}.barang b ON b.id_barang=dpd.id_barang JOIN ${process.env.DB_NAME}.lead l ON l.id_lead = dp.id_lead WHERE dp.id_sales = '${id_sales}' AND dp.id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

const countDaftarpesanan = (id_sales) => {
  const query = `SELECT COUNT(*) as jml from ${process.env.DB_NAME}.cart WHERE id_sales = '${id_sales}'`;
  return dbpool.execute(query);
};

const countPesananTerproses = (id_sales) => {
  const query = `SELECT COUNT(*) as jml from ${process.env.DB_NAME}.order_sum WHERE id_sales = '${id_sales}' AND status=0`;
  return dbpool.execute(query);
};

const countPesananSelesai = (id_sales) => {
  const query = `SELECT COUNT(*) as jml from ${process.env.DB_NAME}.order_sum WHERE id_sales = '${id_sales}' AND status=1`;
  return dbpool.execute(query);
};

const countOrderperhari = (id_sales, tanggal_start, tanggal_end) => {
  try {
    var string = `select DATE('${tanggal_start}') as date `;
    for (var i = 0; i < 6; i++) {
      var temp_date = new Date(tanggal_start);
      temp_date.setDate(temp_date.getDate() + (i + 1));
      string += ` union all select DATE('${moment(temp_date).format(
        "YYYY-MM-DD"
      )}')`;
    }
    const query = `SELECT dates.date,IFNULL(COUNT(os.id_order),0) AS dc FROM (${string}) as dates LEFT JOIN ${process.env.DB_NAME}.order_sum os ON dates.date = DATE(os.tanggal_order) AND os.id_sales = '${id_sales}' GROUP BY dates.date ORDER BY dates.date`;
    return dbpool.execute(query);
  } catch (error) {
    console.log(error);
  }
};

const cekDaftarPesanan = async (id_sales, id_lead) => {
  const query = `SELECT * FROM ${process.env.DB_NAME}.cart WHERE id_sales = '${id_sales}' AND id_lead='${id_lead}'`;
  return dbpool.execute(query);
};

const updateCart = async (body) => {
  const connection = await dbpool.getConnection();
  try {
    await connection.beginTransaction();
    const { id_sales, id_lead } = body;
    const query3 = `SELECT id_cart, qty_total, harga_total FROM ${process.env.DB_NAME}.cart WHERE id_sales = '${id_sales}' AND id_lead='${id_lead}'`;
    const result3 = await connection.query(query3);
    let total = result3[0][0].harga_total;
    let qty_temp = result3[0][0].qty_total;
    let id_cart = result3[0][0].id_cart;
    let id_barang_temp = body.detail[0].id_barang;
    const query4 = `SELECT qty_barang, sub_total FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart = '${id_cart}' AND id_barang='${id_barang_temp}'`;
    const result4 = await connection.query(query4);

    let sub_total_temp = 0;
    let qty_barang_temp = 0;
    if (result4[0].length > 0) {
      sub_total_temp = result4[0][0].sub_total;
      qty_barang_temp = result4[0][0].qty_barang;
    }
    const daftarpesanan_details = body.detail.map((item) => {
      const sub_total = item.qty_barang * item.harga_barang;
      total += sub_total;
      qty_temp += item.qty_barang;
      sub_total_temp += sub_total;
      qty_barang_temp += item.qty_barang;
      return [
        uuidv4(),
        id_cart,
        item.id_barang,
        item.nama_barang,
        item.harga_barang,
        item.qty_barang,
        sub_total,
      ];
    });
    const query1 = `UPDATE ${process.env.DB_NAME}.cart SET qty_total=${qty_temp}, harga_total=${total} WHERE id_sales = '${id_sales}' AND id_lead='${id_lead}'`;
    const result1 = await connection.query(query1, [qty_temp, total]);
    if (result3[0].length > 0 && result4[0].length > 0) {
      const query2 = `UPDATE ${process.env.DB_NAME}.cart_detail SET qty_barang=${qty_barang_temp}, sub_total=${sub_total_temp} WHERE id_cart='${id_cart}' AND id_barang = '${id_barang_temp}'`;
      const result2 = await connection.query(query2);
      await connection.commit();
      return [result1, result2];
    } else {
      const query2 = `INSERT INTO ${process.env.DB_NAME}.cart_detail(id_cart_detail,id_cart,id_barang,nama_barang, harga_barang, qty_barang, sub_total) VALUES ?`;
      const result2 = await connection.query(query2, [daftarpesanan_details]);
      await connection.commit();
      return [result1, result2];
    }
  } catch (error) {
    console.log(error);
    await connection.rollback();
    dbpool.releaseConnection();
  }
};

const DeleteAllCart = async (id_lead) => {
  try {
    const queryselect = `SELECT * FROM ${process.env.DB_NAME}.cart WHERE id_lead='${id_lead}'`;
    const select = await dbpool.execute(queryselect);
    if (select[0].length > 0) {
      const query1 = `DELETE FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${select[0][0].id_cart}'`;
      const query2 = `DELETE FROM ${process.env.DB_NAME}.cart WHERE id_cart='${select[0][0].id_cart}'`;
      dbpool.execute(query1).then(() => {
        return dbpool.execute(query2);
      });
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const deleteDetailCart = async (id_cart, id_cart_detail) => {
  try {
    const queryselect = `SELECT * FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${id_cart}'`;
    const select = await dbpool.execute(queryselect);
    if (select[0].length == 1) {
      const query1 = `DELETE FROM ${process.env.DB_NAME}.cart WHERE id_cart='${select[0][0].id_cart}'`;
      dbpool.execute(query1);
      const query2 = `DELETE FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
      return dbpool.execute(query2);
    }
    const queryselect2 = `SELECT qty_barang, sub_total FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    const select2 = await dbpool.execute(queryselect2);
    let subtotaltemp = select2[0][0].sub_total;
    let qtytemp = select2[0][0].qty_barang;
    const query3 = `DELETE FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    dbpool.execute(query3);
    const query4 = `UPDATE ${process.env.DB_NAME}.cart SET qty_total=qty_total-${qtytemp}, harga_total=harga_total-${subtotaltemp}`;
    return dbpool.execute(query4);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const cartMinus = async (id_cart, id_cart_detail) => {
  try {
    const queryselect2 = `SELECT * FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${id_cart}'`;
    const select2 = await dbpool.execute(queryselect2);
    const queryselect = `SELECT * FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    const select = await dbpool.execute(queryselect);
    const queryselect3 = `SELECT * FROM ${process.env.DB_NAME}.cart WHERE id_cart='${id_cart}'`;
    const select3 = await dbpool.execute(queryselect3);
    if (
      (select2[0][0].length == 1 && select[0][0].qty_barang == 1) ||
      (select3[0][0].qty_total == 1 && select[0][0].qty_barang == 1)
    ) {
      const query1 = `DELETE FROM ${process.env.DB_NAME}.cart WHERE id_cart='${select[0][0].id_cart}'`;
      dbpool.execute(query1);
      const query2 = `DELETE FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
      return dbpool.execute(query2);
    } else if (select[0][0].qty_barang <= 1) {
      const query5 = `DELETE FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${select[0][0].id_cart}' AND id_cart_detail='${id_cart_detail}'`;
      dbpool.execute(query5);
      const query6 = `UPDATE ${
        process.env.DB_NAME
      }.cart SET qty_total=qty_total-${1}, harga_total=harga_total-${
        select[0][0].harga_barang
      }`;
      return dbpool.execute(query6);
    }
    const query3 = `UPDATE ${
      process.env.DB_NAME
    }.cart_detail set qty_barang=qty_barang-${1}, sub_total=sub_total-harga_barang WHERE id_cart='${
      select[0][0].id_cart
    }' AND id_cart_detail='${id_cart_detail}'`;
    dbpool.execute(query3);
    const query4 = `UPDATE ${
      process.env.DB_NAME
    }.cart SET qty_total=qty_total-${1}, harga_total=harga_total-${
      select[0][0].harga_barang
    }`;
    return dbpool.execute(query4);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const cartPlus = async (id_cart, id_cart_detail) => {
  try {
    const queryselect = `SELECT * FROM ${process.env.DB_NAME}.cart_detail WHERE id_cart='${id_cart}' AND id_cart_detail='${id_cart_detail}'`;
    const select = await dbpool.execute(queryselect);
    const query1 = `UPDATE ${
      process.env.DB_NAME
    }.cart_detail set qty_barang=qty_barang+${1}, sub_total=sub_total+harga_barang WHERE id_cart='${
      select[0][0].id_cart
    }' AND id_cart_detail='${id_cart_detail}'`;
    dbpool.execute(query1);
    const query2 = `UPDATE ${
      process.env.DB_NAME
    }.cart SET qty_total=qty_total+${1}, harga_total=harga_total+${
      select[0][0].harga_barang
    }`;
    return dbpool.execute(query2);
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getAllOrder_detail,
  getAllOrder_idsales,
  getAllOrder_sum,
  inputOrderSummary,
  daftarPesanan,
  getDaftarpesanan_idsales,
  updateCart,
  cekDaftarPesanan,
  DeleteAllCart,
  deleteDetailCart,
  cartMinus,
  cartPlus,
  getOrder_detail,
  getOrderSum_by_idOrder,
  countDaftarpesanan,
  countPesananSelesai,
  countPesananTerproses,
  countOrderperhari,
  getOrder_byIdLead,
};
